from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib

class FraudDetector:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = IsolationForest(
            n_estimators=150,
            contamination=0.01,
            random_state=42
        )

    def preprocess(self, transactions):
        features = [[
            txn['amount'],
            txn['frequency'],
            txn['merchant_risk'],
            txn['location_consistency']
        ] for txn in transactions]
        return self.scaler.fit_transform(features)

    def train(self, transactions):
        X = self.preprocess(transactions)
        self.model.fit(X)
        joblib.dump((self.scaler, self.model), 'fraud_model.pkl')

    def predict(self, transaction):
        scaler, model = joblib.load('fraud_model.pkl')
        features = scaler.transform([[
            transaction['amount'],
            transaction['frequency'],
            transaction['merchant_risk'],
            transaction['location_consistency']
        ]])
        return model.predict(features)[0]

# Usage
detector = FraudDetector()
txn = {'amount': 1500, 'frequency': 12, 'merchant_risk': 0.8, 'location_consistency': 0.2}
print(detector.predict(txn))  # Output: -1 (anomaly)