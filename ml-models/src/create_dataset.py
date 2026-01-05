"""
VitalGuard AI - Sample Dataset Creator
Creates training data for disease prediction when Kaggle datasets are not available
"""

import pandas as pd
import numpy as np
import os

def create_sample_dataset():
    """Create a comprehensive sample dataset for training"""
    
    np.random.seed(42)
    
    # Define diseases and their typical symptoms
    diseases = {
        'Common Cold': {
            'symptoms': ['runny nose', 'sneezing', 'mild cough', 'sore throat', 'mild fever'],
            'severity_dist': {'Mild': 0.7, 'Moderate': 0.25, 'Severe': 0.05}
        },
        'Influenza': {
            'symptoms': ['high fever', 'body ache', 'severe cough', 'fatigue', 'headache', 'chills'],
            'severity_dist': {'Mild': 0.2, 'Moderate': 0.6, 'Severe': 0.2}
        },
        'COVID-19': {
            'symptoms': ['fever', 'dry cough', 'loss of taste', 'loss of smell', 'fatigue', 'shortness of breath'],
            'severity_dist': {'Mild': 0.4, 'Moderate': 0.4, 'Severe': 0.2}
        },
        'Pneumonia': {
            'symptoms': ['severe cough', 'chest pain', 'high fever', 'shortness of breath', 'fatigue'],
            'severity_dist': {'Mild': 0.1, 'Moderate': 0.4, 'Severe': 0.5}
        },
        'Bronchitis': {
            'symptoms': ['persistent cough', 'mucus production', 'mild fever', 'chest discomfort', 'fatigue'],
            'severity_dist': {'Mild': 0.5, 'Moderate': 0.4, 'Severe': 0.1}
        },
        'Allergies': {
            'symptoms': ['sneezing', 'runny nose', 'itchy eyes', 'mild cough', 'congestion'],
            'severity_dist': {'Mild': 0.8, 'Moderate': 0.15, 'Severe': 0.05}
        },
        'Gastroenteritis': {
            'symptoms': ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever', 'dehydration'],
            'severity_dist': {'Mild': 0.4, 'Moderate': 0.4, 'Severe': 0.2}
        },
        'Migraine': {
            'symptoms': ['severe headache', 'nausea', 'light sensitivity', 'visual disturbance'],
            'severity_dist': {'Mild': 0.3, 'Moderate': 0.5, 'Severe': 0.2}
        },
        'Urinary Tract Infection': {
            'symptoms': ['frequent urination', 'burning sensation', 'abdominal pain', 'fever', 'cloudy urine'],
            'severity_dist': {'Mild': 0.5, 'Moderate': 0.35, 'Severe': 0.15}
        },
        'Strep Throat': {
            'symptoms': ['severe sore throat', 'difficulty swallowing', 'fever', 'swollen lymph nodes', 'headache'],
            'severity_dist': {'Mild': 0.3, 'Moderate': 0.5, 'Severe': 0.2}
        }
    }
    
    # Generate dataset
    data = []
    num_samples = 1000
    
    for _ in range(num_samples):
        # Randomly select a disease
        disease = np.random.choice(list(diseases.keys()))
        disease_info = diseases[disease]
        
        # Select 3-6 symptoms for this case
        num_symptoms = np.random.randint(3, 7)
        selected_symptoms = np.random.choice(disease_info['symptoms'], 
                                            size=min(num_symptoms, len(disease_info['symptoms'])), 
                                            replace=False)
        
        # Determine severity based on distribution
        severity = np.random.choice(
            list(disease_info['severity_dist'].keys()),
            p=list(disease_info['severity_dist'].values())
        )
        
        # Generate patient info
        age = np.random.randint(5, 85)
        gender = np.random.choice(['Male', 'Female'])
        duration_days = np.random.randint(1, 14)
        
        # Comorbidities (more common in older patients)
        comorbidities_list = ['diabetes', 'hypertension', 'asthma', 'heart disease', 'none']
        if age > 60:
            comorbidity = np.random.choice(comorbidities_list, p=[0.2, 0.25, 0.15, 0.15, 0.25])
        else:
            comorbidity = np.random.choice(comorbidities_list, p=[0.05, 0.05, 0.1, 0.05, 0.75])
        
        # Create record
        record = {
            'disease': disease,
            'severity': severity,
            'symptom_1': selected_symptoms[0] if len(selected_symptoms) > 0 else 'none',
            'symptom_2': selected_symptoms[1] if len(selected_symptoms) > 1 else 'none',
            'symptom_3': selected_symptoms[2] if len(selected_symptoms) > 2 else 'none',
            'symptom_4': selected_symptoms[3] if len(selected_symptoms) > 3 else 'none',
            'symptom_5': selected_symptoms[4] if len(selected_symptoms) > 4 else 'none',
            'symptom_6': selected_symptoms[5] if len(selected_symptoms) > 5 else 'none',
            'age': age,
            'gender': gender,
            'duration_days': duration_days,
            'comorbidity': comorbidity
        }
        
        data.append(record)
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Save to CSV
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/health_dataset.csv', index=False)
    
    print(f"✅ Created sample dataset with {len(df)} records")
    print(f"\nDisease distribution:")
    print(df['disease'].value_counts())
    print(f"\nSeverity distribution:")
    print(df['severity'].value_counts())
    
    return df


if __name__ == "__main__":
    df = create_sample_dataset()
    print("\nDataset saved to: data/health_dataset.csv")
    print("\nSample records:")
    print(df.head(10))
