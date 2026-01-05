"""
VitalGuard AI - Simplified ML API
Flask API for health predictions (using mock data for demo)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

print("🚀 Starting VitalGuard ML API (Demo Mode)...")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'VitalGuard ML API is running (Demo Mode)'
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract input data
        symptoms = data.get('symptoms', [])
        duration = data.get('duration', 1)
        age = data.get('age', 30)
        gender = data.get('gender', 'Male')
        comorbidities = data.get('comorbidities', ['none'])
        
        # Determine disease based on symptoms
        disease_name = determine_disease(symptoms)
        confidence = round(85 + random.uniform(-5, 10), 1)
        
        # Determine severity
        severity_level = determine_severity(symptoms, duration, age)
        severity_conf = round(80 + random.uniform(-5, 10), 1)
        
        # Generate risk timeline
        timeline = generate_timeline(severity_level, duration)
        
        # Generate triage decision
        triage = generate_triage(severity_level, symptoms, age, comorbidities)
        
        # Generate explainability
        explanation = generate_explanation(symptoms, disease_name, severity_level, age, duration)
        
        # Combine all results
        response = {
            'success': True,
            'disease': {
                'name': disease_name,
                'confidence': confidence
            },
            'severity': {
                'level': severity_level,
                'confidence': severity_conf,
                'probabilities': {
                    'mild': 20.0 if severity_level == 'Mild' else 15.0,
                    'moderate': 70.0 if severity_level == 'Moderate' else 20.0,
                    'severe': 80.0 if severity_level == 'Severe' else 10.0
                }
            },
            'riskTimeline': timeline,
            'triage': triage,
            'explainability': explanation
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def determine_disease(symptoms):
    """Determine disease based on symptoms"""
    symptoms_lower = [s.lower() for s in symptoms]
    
    if any('fever' in s for s in symptoms_lower) and any('cough' in s for s in symptoms_lower):
        if any('shortness of breath' in s or 'difficulty breathing' in s for s in symptoms_lower):
            return 'Possible Influenza or COVID-19'
        return 'Influenza (Flu)'
    elif any('chest pain' in s or 'heart' in s for s in symptoms_lower):
        return 'Possible Cardiac Concern'
    elif any('headache' in s for s in symptoms_lower) and any('nausea' in s for s in symptoms_lower):
        return 'Migraine'
    elif any('sore throat' in s for s in symptoms_lower):
        return 'Upper Respiratory Infection'
    elif any('stomach' in s or 'abdominal' in s for s in symptoms_lower):
        return 'Gastrointestinal Issue'
    
    return 'Common Cold / Viral Infection'

def determine_severity(symptoms, duration, age):
    """Determine severity level"""
    severity_score = 0
    
    # Age factor
    if age > 65:
        severity_score += 15
    elif age > 50:
        severity_score += 10
    elif age < 5:
        severity_score += 10
    
    # Duration factor
    if duration > 7:
        severity_score += 20
    elif duration > 3:
        severity_score += 10
    
    # Symptom count and type
    symptoms_lower = [s.lower() for s in symptoms]
    severity_score += len(symptoms) * 3
    
    # Critical symptoms
    critical_symptoms = ['chest pain', 'shortness of breath', 'severe', 'blood', 'unconscious', 'confusion']
    for critical in critical_symptoms:
        if any(critical in s for s in symptoms_lower):
            severity_score += 25
            break
    
    # Determine level
    if severity_score >= 50:
        return 'Severe'
    elif severity_score >= 25:
        return 'Moderate'
    else:
        return 'Mild'

def generate_timeline(severity, duration):
    """Generate 7-day risk timeline"""
    base_risk = {'Mild': 20, 'Moderate': 50, 'Severe': 80}[severity]
    timeline_data = []
    
    for day in range(1, 8):
        if severity == 'Severe':
            risk = min(95, base_risk + (day * 2) + random.randint(-3, 3))
        elif severity == 'Moderate':
            risk = min(75, base_risk + (day * 1) + random.randint(-3, 3))
        else:
            risk = max(10, base_risk - (day * 2) + random.randint(-2, 2))
        
        timeline_data.append({
            'day': day,
            'risk_score': round(risk, 1),
            'status': 'High Risk' if risk > 60 else 'Moderate Risk' if risk > 30 else 'Low Risk'
        })
    
    peak_day = max(timeline_data, key=lambda x: x['risk_score'])['day']
    trend = 'Increasing' if severity == 'Severe' else 'Decreasing' if severity == 'Mild' else 'Stable'
    
    recommendations = [
        f"💊 {'Immediate medical attention required' if severity == 'Severe' else 'Take prescribed medications as directed'}",
        f"🏥 {'Visit emergency room now' if severity == 'Severe' else 'Monitor symptoms daily'}",
        f"📞 {'Call emergency services' if severity == 'Severe' else 'Contact doctor if symptoms worsen'}",
        "💧 Stay hydrated and get adequate rest"
    ]
    
    return {
        'timeline': timeline_data,
        'peak_risk_day': peak_day,
        'trend': trend,
        'recommendations': recommendations
    }

def generate_triage(severity, symptoms, age, comorbidities):
    """Generate triage recommendation"""
    symptoms_lower = [s.lower() for s in symptoms]
    
    # Check for emergency symptoms
    emergency_keywords = ['chest pain', 'shortness of breath', 'severe', 'unconscious', 'bleeding']
    is_emergency = any(keyword in ' '.join(symptoms_lower) for keyword in emergency_keywords)
    
    if severity == 'Severe' or is_emergency:
        return {
            'level': 'EMERGENCY',
            'title': '🔴 Immediate Emergency Care Required',
            'message': 'Your symptoms indicate a potentially serious condition. Please seek emergency medical attention immediately.',
            'urgency_score': 95,
            'color': '#ef4444',
            'actions': [
                'Call emergency services (911) immediately',
                'Go to the nearest emergency room',
                'Do not drive yourself',
                'Inform someone about your condition'
            ]
        }
    elif severity == 'Moderate' or age > 65 or (comorbidities and comorbidities[0] != 'none'):
        return {
            'level': 'VISIT_DOCTOR',
            'title': '🟡 Medical Consultation Recommended',
            'message': 'Your symptoms suggest you should see a doctor soon. Please schedule an appointment within 24-48 hours.',
            'urgency_score': 65,
            'color': '#f59e0b',
            'actions': [
                'Schedule doctor appointment within 24-48 hours',
                'Document your symptoms in detail',
                'Prepare list of current medications',
                'Monitor for worsening symptoms'
            ]
        }
    else:
        return {
            'level': 'HOME_CARE',
            'title': '🟢 Home Care Recommended',
            'message': 'Your symptoms appear manageable with home care. Monitor your condition and seek medical help if symptoms worsen.',
            'urgency_score': 25,
            'color': '#10b981',
            'actions': [
                'Get adequate rest and hydration',
                'Take over-the-counter medication as needed',
                'Monitor your symptoms daily',
                'Seek medical help if condition worsens'
            ]
        }

def generate_explanation(symptoms, disease, severity, age, duration):
    """Generate AI explanation"""
    symptom_list = ', '.join(symptoms[:3]) if len(symptoms) > 3 else ', '.join(symptoms)
    
    summary = f"Your symptoms ({symptom_list}) strongly suggest {disease}."
    
    explanation = (
        f"Based on your age ({age}), reported symptoms, and duration ({duration} days), "
        f"our AI model has classified this as a {severity} condition. "
        f"The analysis considered multiple factors including symptom combination, duration, and patient demographics."
    )
    
    # Generate chart data for symptom impact
    chart_labels = symptoms[:5] if len(symptoms) <= 5 else symptoms[:5]
    chart_values = [90 - (i * 10) for i in range(len(chart_labels))]
    chart_colors = [f'rgba(59, 130, 246, {1 - i*0.15})' for i in range(len(chart_labels))]
    
    return {
        'summary': summary,
        'explanation': explanation,
        'chartData': {
            'labels': chart_labels,
            'values': chart_values,
            'colors': chart_colors
        }
    }

if __name__ == '__main__':
    print("✅ VitalGuard ML API Ready (Demo Mode)")
    print("📡 Running on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
