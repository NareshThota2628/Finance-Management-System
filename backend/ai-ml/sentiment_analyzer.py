from transformers import pipeline
import pandas as pd
import numpy as np
import joblib

class SentimentAnalyzer:
    def __init__(self):
        # Load pre-trained sentiment analysis model
        self.model = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english"
        )
        
        # Custom financial sentiment labels
        self.financial_labels = {
            'POSITIVE': 'Bullish',
            'NEGATIVE': 'Bearish',
            'NEUTRAL': 'Neutral'
        }

    def analyze_sentiment(self, text):
        """
        Analyze sentiment of a single text input.
        Returns: sentiment label and confidence score.
        """
        result = self.model(text)[0]
        return {
            'sentiment': self.financial_labels.get(result['label'], 'Neutral'),
            'confidence': result['score']
        }

    def analyze_batch(self, texts):
        """
        Analyze sentiment of multiple texts.
        Returns: DataFrame with sentiment analysis results.
        """
        results = self.model(texts)
        df = pd.DataFrame(results)
        df['sentiment'] = df['label'].map(self.financial_labels)
        return df[['sentiment', 'score']]

    def analyze_market_trends(self, news_articles):
        """
        Analyze market trends from a collection of news articles.
        Returns: Aggregated sentiment score and trend direction.
        """
        sentiments = self.analyze_batch(news_articles)
        avg_score = sentiments['score'].mean()
        trend = 'Bullish' if avg_score > 0.6 else 'Bearish' if avg_score < 0.4 else 'Neutral'
        
        return {
            'average_sentiment_score': avg_score,
            'market_trend': trend,
            'details': sentiments.to_dict('records')
        }

    def save_model(self, path='sentiment_model.pkl'):
        """
        Save the sentiment analysis model for later use.
        """
        joblib.dump(self.model, path)

    def load_model(self, path='sentiment_model.pkl'):
        """
        Load a pre-trained sentiment analysis model.
        """
        self.model = joblib.load(path)

# Usage Example
if __name__ == "__main__":
    analyzer = SentimentAnalyzer()
    
    # Single text analysis
    text = "The stock market is expected to rise due to strong earnings reports."
    result = analyzer.analyze_sentiment(text)
    print(result)  # Output: {'sentiment': 'Bullish', 'confidence': 0.95}

    # Batch analysis
    news_articles = [
        "Company XYZ reports record profits this quarter.",
        "Economic downturn fears cause market panic.",
        "Tech stocks remain stable despite global uncertainties."
    ]
    batch_results = analyzer.analyze_batch(news_articles)
    print(batch_results)

    # Market trend analysis
    market_trend = analyzer.analyze_market_trends(news_articles)
    print(market_trend)