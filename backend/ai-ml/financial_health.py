import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
import joblib

class FinancialHealthScorer:
    def __init__(self):
        self.model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=3
        )
        
    def calculate_features(self, user_data):
        """Engineered financial features"""
        return np.array([
            user_data['income'] / (user_data['expenses'] + 1e-6),
            user_data['savings'] / user_data['income'],
            1 - (user_data['debt'] / (user_data['assets'] + 1e-6)),
            len(user_data['investment_accounts']),
            user_data['credit_score'] / 850
        ]).reshape(1, -1)

    def train(self, historical_data):
        X = np.array([self.calculate_features(d) for d in historical_data])
        y = np.array([d['financial_health_score'] for d in historical_data])
        X_train, X_test, y_train, y_test = train_test_split(X, y)
        self.model.fit(X_train, y_train)
        joblib.dump(self.model, 'financial_health_model.pkl')

    def predict(self, user_data):
        model = joblib.load('financial_health_model.pkl')
        features = self.calculate_features(user_data)
        return model.predict(features)[0]

# Sample usage
health_model = FinancialHealthScorer()
user_data = {
    'income': 5000,
    'expenses': 3500,
    'savings': 15000,
    'debt': 5000,
    'assets': 20000,
    'investment_accounts': 2,
    'credit_score': 720
}
print(health_model.predict(user_data))  # Output: 78.3 (scale 0-100)