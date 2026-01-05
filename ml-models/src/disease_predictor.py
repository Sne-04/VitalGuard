"""
VitalGuard AI - Disease Prediction Model
Uses RandomForest for high-accuracy disease prediction from symptoms
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

class DiseasePredictorModel:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            min_samples_split=10,
            min_samples_leaf=4,
            random_state=42,
            n_jobs=-1
        )
        self.label_encoders = {}
        self.feature_names = []
        
    def prepare_data(self, df):
        """Prepare and encode data for training"""
        # Encode categorical features
        encoded_df = df.copy()
        
        for column in encoded_df.columns:
            if encoded_df[column].dtype == 'object' and column != 'disease':
                le = LabelEncoder()
                encoded_df[column] = le.fit_transform(encoded_df[column].astype(str))
                self.label_encoders[column] = le
        
        return encoded_df
    
    def train(self, X_train, y_train):
        """Train the RandomForest model"""
        self.feature_names = X_train.columns.tolist()
        self.model.fit(X_train, y_train)
        
        # Cross-validation score
        cv_scores = cross_val_score(self.model, X_train, y_train, cv=5)
        print(f"Cross-validation scores: {cv_scores}")
        print(f"Mean CV Score: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        
        return self.model
    
    def evaluate(self, X_test, y_test):
        """Evaluate model performance"""
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"\n=== Disease Prediction Model Performance ===")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        return accuracy
    
    def predict(self, symptoms_data):
        """Predict disease from symptoms"""
        # Encode input data
        encoded_data = symptoms_data.copy()
        for column, le in self.label_encoders.items():
            if column in encoded_data.columns:
                encoded_data[column] = le.transform(encoded_data[column].astype(str))
        
        # Make prediction
        prediction = self.model.predict(encoded_data)[0]
        probability = self.model.predict_proba(encoded_data)[0]
        confidence = max(probability) * 100
        
        return {
            'disease': prediction,
            'confidence': round(confidence, 2),
            'all_probabilities': dict(zip(self.model.classes_, probability))
        }
    
    def get_feature_importance(self):
        """Get feature importance scores"""
        importances = self.model.feature_importances_
        feature_importance = pd.DataFrame({
            'feature': self.feature_names,
            'importance': importances
        }).sort_values('importance', ascending=False)
        
        return feature_importance
    
    def save_model(self, filepath='models/disease_predictor.pkl'):
        """Save trained model"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump({
            'model': self.model,
            'label_encoders': self.label_encoders,
            'feature_names': self.feature_names
        }, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='models/disease_predictor.pkl'):
        """Load trained model"""
        data = joblib.load(filepath)
        self.model = data['model']
        self.label_encoders = data['label_encoders']
        self.feature_names = data['feature_names']
        print(f"Model loaded from {filepath}")
        
        return self


if __name__ == "__main__":
    # Example usage
    print("Disease Predictor Model - VitalGuard AI")
    print("This model will be trained with Kaggle health datasets")
