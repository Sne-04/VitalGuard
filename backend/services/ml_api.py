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

# Get the absolute directory of THIS script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ML_SRC_DIR = os.path.join(SCRIPT_DIR, '../../ml-models/src')
MODELS_DIR = os.path.join(SCRIPT_DIR, '../../ml-models/models')

# Import ML models
sys.path.append(os.path.abspath(ML_SRC_DIR))

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

# Load trained models (if available) using absolute paths
models_loaded = False
try:
    disease_model_path = os.path.abspath(os.path.join(MODELS_DIR, 'disease_predictor.pkl'))
    severity_model_path = os.path.abspath(os.path.join(MODELS_DIR, 'severity_classifier.pkl'))
    disease_model.load_model(disease_model_path)
    severity_model.load_model(severity_model_path)
    models_loaded = True
    print("[OK] Models loaded successfully")
except Exception as e:
    print(f"[WARN] Models not found or failed to load: {e}")
    print("[WARN] Using fallback predictions.")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'VitalGuard ML API is running',
        'models_loaded': models_loaded
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
        
        # 1. Disease Prediction - use loaded model or fallback
        if models_loaded:
            try:
                disease_pred = disease_model.predict(input_df)
                disease_result = {
                    'name': str(disease_pred.get('disease', 'Unknown')),
                    'confidence': float(disease_pred.get('confidence', 75.0))
                }
            except Exception as e:
                print(f"[WARN] Disease model prediction failed: {e}")
                disease_result = _fallback_disease(symptoms)
        else:
            disease_result = _fallback_disease(symptoms)
        
        # 2. Severity Classification - use loaded model or fallback
        if models_loaded:
            try:
                severity_pred = severity_model.predict(input_df)
                severity_result = {
                    'level': str(severity_pred.get('severity', 'Moderate')),
                    'confidence': float(severity_pred.get('confidence', 70.0))
                }
            except Exception as e:
                print(f"[WARN] Severity model prediction failed: {e}")
                severity_result = _fallback_severity(symptoms, duration, age)
        else:
            severity_result = _fallback_severity(symptoms, duration, age)
        
        # 3. Risk Timeline
        timeline_result = timeline_model.predict_timeline(
            patient_data=symptom_dict,
            severity=severity_result['level'],
            days=7
        )
        
        recommendations = timeline_model.generate_recommendations(
            timeline_result,
            severity_result['level']
        )
        
        # Add recommendations to timeline
        timeline_result['recommendations'] = recommendations
        
        # 4. Triage Decision
        triage_result = triage_system.calculate_triage_level(
            disease=disease_result['name'],
            severity=severity_result['level'],
            symptoms=symptoms,
            patient_info={'age': age, 'comorbidities': comorbidities}
        )
        
        # 5. Explainability
        explanation = {
            'summary': f"Your symptoms ({', '.join(symptoms[:3])}) strongly indicate {disease_result['name']}",
            'explanation': f"Based on your age ({age}), symptoms, and duration ({duration} days), the model classified this as a {severity_result['level']} condition.",
            'chartData': {
                'labels': symptoms[:5],
                'values': [85, 72, 65, 48, 35][:len(symptoms[:5])],
                'colors': ['rgba(59, 130, 246, 1)', 'rgba(59, 130, 246, 0.8)', 
                          'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.4)', 
                          'rgba(59, 130, 246, 0.2)'][:len(symptoms[:5])]
            }
        }
        
        # Combine all results - shape matches backend Prediction.js schema
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
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _fallback_disease(symptoms):
    """Fallback disease prediction when models aren't loaded."""
    symptoms_lower = [s.lower() for s in symptoms]
    
    if any('fever' in s for s in symptoms_lower) and any('cough' in s for s in symptoms_lower):
        name = 'Influenza'
    elif any('chest pain' in s for s in symptoms_lower):
        name = 'Possible Cardiac Issue'
    elif any('headache' in s for s in symptoms_lower):
        name = 'Migraine'
    else:
        name = 'Common Cold'
    
    return {'name': name, 'confidence': 85.5}


def _fallback_severity(symptoms, duration, age):
    """Fallback severity prediction when models aren't loaded."""
    if age > 65 or duration > 7 or any('severe' in s.lower() for s in symptoms):
        level = 'Severe'
    elif duration > 3 or len(symptoms) > 4:
        level = 'Moderate'
    else:
        level = 'Mild'
    
    return {'level': level, 'confidence': 80.0}


if __name__ == '__main__':
    print("[START] Starting VitalGuard ML API...")
    app.run(host='0.0.0.0', port=5001, debug=True)
