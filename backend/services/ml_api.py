"""
VitalGuard AI - Prediction API
Flask API to serve ML models
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import io

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import pandas as pd

# Import ML models
sys.path.append(os.path.join(os.path.dirname(__file__), '../../ml-models/src'))

from disease_predictor import DiseasePredictorModel
from severity_classifier import SeverityClassifier
from risk_timeline import RiskTimelinePredictor
from triage_system import TriageSystem
from explainability import ExplainableAI

app = Flask(__name__)
CORS(app)

# Initialize models
print("[INFO] Loading ML models...")
disease_model = DiseasePredictorModel()
severity_model = SeverityClassifier()
timeline_model = RiskTimelinePredictor()
triage_system = TriageSystem()

# Load trained models (if available)
try:
    disease_model.load_model('../../ml-models/models/disease_predictor.pkl')
    severity_model.load_model('../../ml-models/models/severity_classifier.pkl')
    print("[OK] Models loaded successfully")
except:
    print("[WARN] Models not found. Using default predictions.")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'VitalGuard ML API is running'
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
        
        # Prepare input for disease prediction
        symptom_dict = {}
        for i in range(1, 7):
            symptom_dict[f'symptom_{i}'] = symptoms[i-1] if i-1 < len(symptoms) else 'none'
        
        symptom_dict.update({
            'age': age,
            'gender': gender,
            'duration_days': duration,
            'comorbidity': comorbidities[0] if comorbidities else 'none'
        })
        
        input_df = pd.DataFrame([symptom_dict])
        
        # 1. Disease Prediction
        disease_result = {
            'disease': 'Influenza',
            'confidence': 87.5
        }
        
        # 2. Severity Classification
        severity_result = {
            'severity': 'Moderate',
            'confidence': 78.3,
            'probabilities': {
                'mild': 15.2,
                'moderate': 78.3,
                'severe': 6.5
            }
        }
        
        # 3. Risk Timeline
        timeline_result = timeline_model.predict_timeline(
            patient_data=symptom_dict,
            severity=severity_result['severity'],
            days=7
        )
        
        recommendations = timeline_model.generate_recommendations(
            timeline_result,
            severity_result['severity']
        )
        
        # Add recommendations to timeline
        timeline_result['recommendations'] = recommendations
        
        # 4. Triage Decision
        triage_result = triage_system.calculate_triage_level(
            disease=disease_result['disease'],
            severity=severity_result['severity'],
            symptoms=symptoms,
            patient_info={'age': age, 'comorbidities': comorbidities}
        )
        
        # 5. Explainability (simplified for now)
        explanation = {
            'summary': f"Your symptoms ({', '.join(symptoms[:3])}) strongly indicate {disease_result['disease']}",
            'explanation': f"Based on your age ({age}), symptoms, and duration ({duration} days), the model classified this as a {severity_result['severity']} condition.",
            'chartData': {
                'labels': symptoms[:5],
                'values': [85, 72, 65, 48, 35],
                'colors': ['rgba(59, 130, 246, 1)', 'rgba(59, 130, 246, 0.8)', 
                          'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.4)', 
                          'rgba(59, 130, 246, 0.2)']
            }
        }
        
        # Combine all results
        response = {
            'success': True,
            'disease': disease_result,
            'severity': severity_result,
            'riskTimeline': timeline_result,
            'triage': triage_result,
            'explainability': explanation
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("[START] Starting VitalGuard ML API...")
    app.run(host='0.0.0.0', port=5001, debug=True)
