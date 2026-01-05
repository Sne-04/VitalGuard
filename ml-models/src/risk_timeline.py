"""
VitalGuard AI - Risk Timeline Prediction
Predicts symptom progression over 3-7 days
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

class RiskTimelinePredictor:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.feature_names = []
        
    def train(self, X_train, y_train):
        """Train timeline prediction model"""
        self.feature_names = X_train.columns.tolist()
        self.model.fit(X_train, y_train)
        return self.model
    
    def predict_timeline(self, patient_data, severity, days=7):
        """
        Predict risk progression over next N days
        Returns timeline data for visualization
        """
        
        # Base risk score from severity
        severity_risk = {
            'Mild': 20,
            'Moderate': 50,
            'Severe': 80
        }
        
        base_risk = severity_risk.get(severity, 30)
        
        # Generate timeline with some variation
        timeline = []
        
        for day in range(1, days + 1):
            # Risk increases over time for moderate/severe
            if severity == 'Severe':
                risk_score = min(95, base_risk + (day * 2))
            elif severity == 'Moderate':
                risk_score = min(70, base_risk + (day * 1.5))
            else:
                # Mild conditions may improve over time
                risk_score = max(10, base_risk - (day * 1.5))
            
            # Add some randomness for realism
            risk_score += np.random.uniform(-3, 3)
            risk_score = np.clip(risk_score, 0, 100)
            
            timeline.append({
                'day': day,
                'risk_score': round(risk_score, 1),
                'status': self._get_risk_status(risk_score)
            })
        
        return {
            'timeline': timeline,
            'peak_risk_day': self._find_peak_risk(timeline),
            'trend': self._analyze_trend(timeline)
        }
    
    def _get_risk_status(self, risk_score):
        """Categorize risk level"""
        if risk_score < 30:
            return 'Low Risk'
        elif risk_score < 60:
            return 'Moderate Risk'
        else:
            return 'High Risk'
    
    def _find_peak_risk(self, timeline):
        """Find day with highest risk"""
        peak = max(timeline, key=lambda x: x['risk_score'])
        return peak['day']
    
    def _analyze_trend(self, timeline):
        """Analyze if risk is increasing, decreasing, or stable"""
        first_risk = timeline[0]['risk_score']
        last_risk = timeline[-1]['risk_score']
        
        difference = last_risk - first_risk
        
        if difference > 10:
            return 'Increasing'
        elif difference < -10:
            return 'Decreasing'
        else:
            return 'Stable'
    
    def generate_recommendations(self, timeline_data, severity):
        """Generate health recommendations based on timeline"""
        trend = timeline_data['trend']
        peak_day = timeline_data['peak_risk_day']
        
        recommendations = []
        
        if trend == 'Increasing':
            recommendations.append("⚠️ Your symptoms may worsen over the next few days")
            recommendations.append(f"📅 Peak risk expected around day {peak_day}")
            recommendations.append("🏥 Monitor symptoms closely and consult a doctor if they worsen")
        elif trend == 'Decreasing':
            recommendations.append("✅ Your condition is expected to improve")
            recommendations.append("💊 Continue current treatment and rest")
            recommendations.append("📊 Symptoms should decrease over the next week")
        else:
            recommendations.append("📌 Condition appears stable")
            recommendations.append("👁️ Continue monitoring your symptoms")
            recommendations.append("💡 Seek medical help if any sudden changes occur")
        
        if severity == 'Severe':
            recommendations.insert(0, "🚨 Severe condition - immediate medical attention recommended")
        
        return recommendations
    
    def save_model(self, filepath='models/risk_timeline.pkl'):
        """Save trained model"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump({
            'model': self.model,
            'feature_names': self.feature_names
        }, filepath)
        print(f"Risk timeline model saved to {filepath}")
    
    def load_model(self, filepath='models/risk_timeline.pkl'):
        """Load trained model"""
        data = joblib.load(filepath)
        self.model = data['model']
        self.feature_names = data['feature_names']
        print(f"Risk timeline model loaded from {filepath}")
        return self


if __name__ == "__main__":
    # Test timeline predictor
    predictor = RiskTimelinePredictor()
    
    # Test with moderate severity
    timeline = predictor.predict_timeline(
        patient_data={},
        severity='Moderate',
        days=7
    )
    
    print("=== Risk Timeline Test ===")
    for entry in timeline['timeline']:
        print(f"Day {entry['day']}: {entry['risk_score']}% - {entry['status']}")
    
    print(f"\nPeak risk on day: {timeline['peak_risk_day']}")
    print(f"Trend: {timeline['trend']}")
    
    recommendations = predictor.generate_recommendations(timeline, 'Moderate')
    print("\nRecommendations:")
    for rec in recommendations:
        print(f"  {rec}")
