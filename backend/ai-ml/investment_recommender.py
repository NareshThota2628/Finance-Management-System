import numpy as np
from pypfopt import EfficientFrontier, risk_models, expected_returns

class PortfolioOptimizer:
    def __init__(self):
        self.risk_free_rate = 0.02

    def optimize_portfolio(self, historical_prices):
        mu = expected_returns.mean_historical_return(historical_prices)
        S = risk_models.sample_cov(historical_prices)
        
        ef = EfficientFrontier(mu, S)
        ef.add_constraint(lambda w: w >= 0.05)  # Minimum 5% per asset
        ef.add_constraint(lambda w: w <= 0.30)  # Maximum 30% per asset
        
        weights = ef.max_sharpe(risk_free_rate=self.risk_free_rate)
        return ef.clean_weights()

# Usage
optimizer = PortfolioOptimizer()
prices = pd.read_csv('stock_prices.csv', index_col=0)
print(optimizer.optimize_portfolio(prices))