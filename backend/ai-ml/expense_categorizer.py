import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import ComplementNB
from sklearn.pipeline import Pipeline
import joblib

class ExpenseCategorizer:
    def __init__(self):
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=1000,
                stop_words='english'
            )),
            ('clf', ComplementNB(alpha=0.1))
        ])
        
        # Sample training data
        self.categories = {
            'Food': ['groceries', 'restaurant', 'coffee shop'],
            'Transport': ['uber', 'gas station', 'public transit'],
            'Utilities': ['electric bill', 'water bill', 'internet']
        }

    def generate_training_data(self):
        X, y = [], []
        for category, keywords in self.categories.items():
            for keyword in keywords:
                X.append(keyword)
                y.append(category)
        return X, y

    def train(self):
        X, y = self.generate_training_data()
        self.model.fit(X, y)
        joblib.dump(self.model, 'expense_category_model.pkl')

    def predict(self, description):
        model = joblib.load('expense_category_model.pkl')
        return model.predict([description])[0]

# Usage
categorizer = ExpenseCategorizer()
categorizer.train()
print(categorizer.predict("dinner at sushi restaurant"))  # Output: Food