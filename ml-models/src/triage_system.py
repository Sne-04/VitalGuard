"""
VitalGuard AI - AI-Based Triage System
Hybrid rule-based + ML system for emergency decision making
"""

import pandas as pd
import numpy as np

class TriageSystem:
    def __init__(self):
        # Emergency symptoms that require immediate attention
        self.emergency_symptoms = [
            'chest pain', 'severe chest pain', 'shortness of breath',
            'difficulty breathing', 'severe headache', 'sudden numbness',
            'loss of consciousness', 'severe bleeding', 'stroke symptoms',
            'heart attack symptoms', 'severe allergic reaction',
            'severe abdominal pain', 'high fever with confusion'
        ]
        
        # Warning symptoms that need doctor visit
        self.warning_symptoms = [
            'persistent fever', 'severe cough', 'blood in stool',
            'blood in urine', 'severe pain', 'rapid weight loss',
            'persistent vomiting', 'severe diarrhea'
        ]
        
    def calculate_triage_level(self, disease, severity, symptoms, patient_info):
        """
        Determine triage level based on multiple factors
        Returns: 'EMERGENCY', 'VISIT_DOCTOR', or 'HOME_CARE'
        """
        
        # 1. Check for emergency symptoms
        symptoms_lower = [s.lower() for s in symptoms]
        
        for emergency_symptom in self.emergency_symptoms:
            if any(emergency_symptom in symptom for symptom in symptoms_lower):
                return self._create_triage_response(
                    'EMERGENCY',
                    '🔴 Immediate Medical Attention Required',
                    'Your symptoms indicate a potentially serious condition. Please visit the emergency room or call emergency services immediately.',
                    95
                )
        
        # 2. Check severity level
        if severity == 'Severe':
            return self._create_triage_response(
                'EMERGENCY',
                '🔴 Severe Condition - Emergency Care Needed',
                'The severity of your condition requires immediate medical attention. Please go to the emergency room.',
                90
            )
        
        # 3. Check for warning symptoms
        for warning_symptom in self.warning_symptoms:
            if any(warning_symptom in symptom for symptom in symptoms_lower):
                return self._create_triage_response(
                    'VISIT_DOCTOR',
                    '🟡 Medical Consultation Recommended',
                    'Your symptoms suggest you should see a doctor soon. Please schedule an appointment within 24-48 hours.',
                    70
                )
        
        # 4. Check patient risk factors
        age = patient_info.get('age', 0)
        comorbidities = patient_info.get('comorbidities', [])
        
        if age > 65 or len(comorbidities) > 0:
            if severity == 'Moderate':
                return self._create_triage_response(
                    'VISIT_DOCTOR',
                    '🟡 Doctor Visit Recommended',
                    'Given your age/medical history and symptom severity, please consult a doctor.',
                    75
                )
        
        # 5. Default to home care for mild conditions
        if severity == 'Mild':
            return self._create_triage_response(
                'HOME_CARE',
                '🟢 Home Care Recommended',
                'Your symptoms appear manageable with home care. Monitor your condition and seek medical help if symptoms worsen.',
                30
            )
        
        # 6. Moderate severity - visit doctor
        return self._create_triage_response(
            'VISIT_DOCTOR',
            '🟡 Medical Check-up Advised',
            'Consider visiting a doctor for proper evaluation and treatment.',
            60
        )
    
    def _create_triage_response(self, level, title, message, urgency_score):
        """Create standardized triage response"""
        
        colors = {
            'EMERGENCY': '#ef4444',  # Red
            'VISIT_DOCTOR': '#f59e0b',  # Yellow
            'HOME_CARE': '#10b981'  # Green
        }
        
        return {
            'level': level,
            'title': title,
            'message': message,
            'urgency_score': urgency_score,
            'color': colors[level],
            'action': self._get_action_steps(level)
        }
    
    def _get_action_steps(self, level):
        """Get recommended action steps based on triage level"""
        actions = {
            'EMERGENCY': [
                'Call emergency services (911) immediately',
                'Go to the nearest emergency room',
                'Do not drive yourself - get help',
                'If alone, inform someone about your condition'
            ],
            'VISIT_DOCTOR': [
                'Schedule a doctor appointment within 24-48 hours',
                'Document your symptoms in detail',
                'Prepare list of current medications',
                'Monitor for any worsening of symptoms'
            ],
            'HOME_CARE': [
                'Get adequate rest and hydration',
                'Take over-the-counter medication as needed',
                'Monitor your symptoms daily',
                'Seek medical help if condition worsens'
            ]
        }
        
        return actions.get(level, [])


if __name__ == "__main__":
    # Test the triage system
    triage = TriageSystem()
    
    # Test case 1: Emergency
    result1 = triage.calculate_triage_level(
        disease='Heart Attack',
        severity='Severe',
        symptoms=['chest pain', 'shortness of breath'],
        patient_info={'age': 55, 'comorbidities': ['diabetes']}
    )
    print("Test 1 (Emergency):", result1['title'])
    
    # Test case 2: Home care
    result2 = triage.calculate_triage_level(
        disease='Common Cold',
        severity='Mild',
        symptoms=['runny nose', 'mild cough'],
        patient_info={'age': 25, 'comorbidities': []}
    )
    print("Test 2 (Home Care):", result2['title'])
