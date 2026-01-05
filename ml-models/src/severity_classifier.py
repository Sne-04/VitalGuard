"""
VitalGuard AI - Severity Classification Model
Uses XGBoost to classify disease severity as Mild, Moderate, or Severe
"""

import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os

class SeverityClassifier:
    def __init__(self):
        self.model = xgb.XGBClassifier(
            n_estimators=150,
            max_depth=8,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            objective='multi:softmax',
            num_class=3
        )
        self.label_encoder = LabelEncoder()
        self.feature_names = []
        
    def prepare_features(self, df):
        """Prepare features for severity classification"""
        # Features: symptoms, age, comorbidities, symptom duration
        return df
    
    def train(self, X_train, y_train):
        """Train XGBoost classifier"""
        self.feature_names = X_train.columns.tolist()
        
        # Encode severity labels (Mild=0, Moderate=1, Severe=2)
        y_encoded = self.label_encoder.fit_transform(y_train)
        
        self.model.fit(X_train, y_encoded)
        
        return self.model
    
    def evaluate(self, X_test, y_test):
        """Evaluate severity classification"""
        y_encoded = self.label_encoder.transform(y_test)
        y_pred = self.model.predict(X_test)
        
        accuracy = accuracy_score(y_encoded, y_pred)
        
        print(f"\n=== Severity Classification Performance ===")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"\nClassification Report:")
        print(classification_report(y_encoded, y_pred, 
                                   target_names=['Mild', 'Moderate', 'Severe']))
        
        print(f"\nConfusion Matrix:")
        print(confusion_matrix(y_encoded, y_pred))
        
        return accuracy
    
    def predict_severity(self, patient_data):
        """Predict severity level"""
        prediction = self.model.predict(patient_data)[0]
        probabilities = self.model.predict_proba(patient_data)[0]
        
        severity_labels = ['Mild', 'Moderate', 'Severe']
        predicted_severity = severity_labels[int(prediction)]
        confidence = probabilities[int(prediction)] * 100
        
        return {
            'severity': predicted_severity,
            'confidence': round(confidence, 2),
            'probabilities': {
                'mild': round(probabilities[0] * 100, 2),
                'moderate': round(probabilities[1] * 100, 2),
                'severe': round(probabilities[2] * 100, 2)
            }
        }
    
    def save_model(self, filepath='models/severity_classifier.pkl'):
        """Save trained model"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump({
            'model': self.model,
            'label_encoder': self.label_encoder,
            'feature_names': self.feature_names
        }, filepath)
        print(f"Severity classifier saved to {filepath}")
    
    def load_model(self, filepath='models/severity_classifier.pkl'):
        """Load trained model"""
        data = joblib.load(filepath)
        self.model = data['model']
        self.label_encoder = data['label_encoder']
        self.feature_names = data['feature_names']
        print(f"Severity classifier loaded from {filepath}")
        
        return self


if __name__ == "__main__":
    print("Severity Classifier - VitalGuard AI")
    print("Classifies disease severity: Mild / Moderate / Severe")
