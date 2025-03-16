import pandas as pd
from fbprophet import Prophet
import joblib

class ExpenseForecaster:
    def __init__(self):
        self.model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False
        )

    def preprocess_data(self, transactions):
        df = pd.DataFrame(transactions)
        df['ds'] = pd.to_datetime(df['date'])
        df = df.rename(columns={'amount': 'y'})
        return df.groupby('ds')['y'].sum().reset_index()

    def train(self, historical_data):
        df = self.preprocess_data(historical_data)
        self.model.fit(df)
        joblib.dump(self.model, 'expense_forecaster.pkl')

    def predict(self, periods=30):
        model = joblib.load('expense_forecaster.pkl')
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)
        return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]

# Usage
forecaster = ExpenseForecaster()
forecast = forecaster.predict()
print(forecast.tail())  # Shows next 30 days predictions