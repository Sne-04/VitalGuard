"""
VitalGuard AI - Explainable AI Module
Uses SHAP (SHapley Additive exPlanations) for model interpretability
"""

import shap
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

class ExplainableAI:
    def __init__(self, model, model_type='tree'):
        """
        Initialize explainability module
        model_type: 'tree' for RandomForest/XGBoost, 'linear' for LogisticRegression
        """
        self.model = model
        self.model_type = model_type
        self.explainer = None
        
    def create_explainer(self, X_train):
        """Create SHAP explainer based on model type"""
        if self.model_type == 'tree':
            self.explainer = shap.TreeExplainer(self.model)
        else:
            self.explainer = shap.LinearExplainer(self.model, X_train)
        
        return self.explainer
    
    def explain_prediction(self, X_instance, feature_names):
        """
        Explain a single prediction
        Returns feature contributions
        """
        if self.explainer is None:
            raise ValueError("Explainer not initialized. Call create_explainer first.")
        
        # Get SHAP values
        shap_values = self.explainer.shap_values(X_instance)
        
        # Handle multi-class output
        if isinstance(shap_values, list):
            shap_values = shap_values[0]  # Take first class for simplicity
        
        # Get feature contributions
        contributions = []
        for idx, feature in enumerate(feature_names):
            value = X_instance.iloc[0, idx] if hasattr(X_instance, 'iloc') else X_instance[idx]
            shap_value = shap_values[0][idx] if len(shap_values.shape) > 1 else shap_values[idx]
            
            contributions.append({
                'feature': feature,
                'value': value,
                'contribution': float(shap_value),
                'abs_contribution': abs(float(shap_value))
            })
        
        # Sort by absolute contribution
        contributions.sort(key=lambda x: x['abs_contribution'], reverse=True)
        
        # Calculate total contribution
        total_contribution = sum([abs(c['contribution']) for c in contributions])
        
        # Add percentage
        for contrib in contributions:
            contrib['percentage'] = (contrib['abs_contribution'] / total_contribution * 100) if total_contribution > 0 else 0
        
        return contributions
    
    def generate_explanation_text(self, contributions, top_n=5):
        """Generate human-readable explanation"""
        top_features = contributions[:top_n]
        
        # Create natural language explanation
        explanations = []
        for feature in top_features:
            feature_name = feature['feature'].replace('_', ' ').title()
            percentage = round(feature['percentage'], 1)
            
            if percentage > 0:
                explanations.append(f"{feature_name} ({percentage}%)")
        
        if explanations:
            main_text = f"The prediction was primarily influenced by: {', '.join(explanations[:3])}"
            
            if len(explanations) > 3:
                main_text += f", and {len(explanations) - 3} other factor(s)"
            
            return {
                'summary': main_text,
                'top_features': top_features,
                'explanation': f"Your symptoms and patient information were analyzed. " + main_text + "."
            }
        
        return {
            'summary': "Prediction based on overall symptom pattern",
            'top_features': top_features,
            'explanation': "The model analyzed your symptoms to make this prediction."
        }
    
    def get_visualization_data(self, contributions, top_n=5):
        """Prepare data for frontend visualization"""
        top_features = contributions[:top_n]
        
        chart_data = {
            'labels': [f['feature'].replace('_', ' ').title() for f in top_features],
            'values': [round(f['percentage'], 1) for f in top_features],
            'colors': self._generate_colors(len(top_features))
        }
        
        return chart_data
    
    def _generate_colors(self, n):
        """Generate color gradient for visualization"""
        colors = []
        for i in range(n):
            # Gradient from blue to light blue
            intensity = 1 - (i / n) * 0.5
            colors.append(f'rgba(59, 130, 246, {intensity})')
        
        return colors


if __name__ == "__main__":
    print("Explainable AI Module - VitalGuard AI")
    print("Uses SHAP for transparent ML predictions")
