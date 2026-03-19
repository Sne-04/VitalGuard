"""
VitalGuard AI - Train All Models
Trains disease predictor and severity classifier from the generated dataset
"""

import pandas as pd
import os
import sys

sys.path.append(os.path.dirname(__file__))

from disease_predictor import DiseasePredictorModel
from severity_classifier import SeverityClassifier

def train_all():
    print("=" * 60)
    print("  VitalGuard AI - Model Training Pipeline")
    print("=" * 60)
    
    # Load dataset
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'health_dataset.csv')
    if not os.path.exists(data_path):
        print("[ERROR] Dataset not found. Run create_dataset.py first.")
        sys.exit(1)
    
    df = pd.read_csv(data_path)
    print(f"\n✅ Loaded dataset: {len(df)} records")
    
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # ---- Train Disease Predictor ----
    print("\n" + "-" * 40)
    print("  Training Disease Predictor")
    print("-" * 40)
    
    disease_model = DiseasePredictorModel()
    
    # Prepare features and target
    feature_cols = [c for c in df.columns if c not in ['disease', 'severity']]
    X = df[feature_cols].copy()
    y_disease = df['disease']
    
    # Encode
    encoded = disease_model.prepare_data(pd.concat([X, y_disease], axis=1))
    X_encoded = encoded[feature_cols]
    
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(X_encoded, y_disease, test_size=0.2, random_state=42)
    
    disease_model.train(X_train, y_train)
    accuracy = disease_model.evaluate(X_test, y_test)
    disease_model.save_model(os.path.join(models_dir, 'disease_predictor.pkl'))
    
    print(f"\n🎯 Disease Predictor Accuracy: {accuracy*100:.1f}%")
    
    # ---- Train Severity Classifier ----
    print("\n" + "-" * 40)
    print("  Training Severity Classifier")
    print("-" * 40)
    
    severity_model = SeverityClassifier()
    
    y_severity = df['severity']
    
    # We need fresh encoding for severity model
    severity_model_data = df[feature_cols].copy()
    
    # Encode categorical columns
    from sklearn.preprocessing import LabelEncoder
    label_encoders = {}
    for col in severity_model_data.columns:
        if severity_model_data[col].dtype == 'object':
            le = LabelEncoder()
            severity_model_data[col] = le.fit_transform(severity_model_data[col].astype(str))
            label_encoders[col] = le
    
    X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(
        severity_model_data, y_severity, test_size=0.2, random_state=42
    )
    
    severity_model.train(X_train_s, y_train_s)
    sev_accuracy = severity_model.evaluate(X_test_s, y_test_s)
    severity_model.save_model(os.path.join(models_dir, 'severity_classifier.pkl'))
    
    print(f"\n🎯 Severity Classifier Accuracy: {sev_accuracy*100:.1f}%")
    
    # ---- Summary ----
    print("\n" + "=" * 60)
    print("  Training Complete!")
    print("=" * 60)
    print(f"  Disease Predictor: {accuracy*100:.1f}% accuracy")
    print(f"  Severity Classifier: {sev_accuracy*100:.1f}% accuracy")
    print(f"  Models saved to: {os.path.abspath(models_dir)}")
    print("=" * 60)

if __name__ == '__main__':
    train_all()
