import os
import requests
from flask import Blueprint, request, jsonify
from openai import OpenAI

news_bp = Blueprint('news', __name__)

# Initialize OpenAI client
client = OpenAI()

@news_bp.route('/news-sentiment', methods=['GET'])
def get_news_sentiment():
    """
    Fetch news for a given symbol and analyze sentiment using OpenAI
    """
    try:
        symbol = request.args.get('symbol', 'EURUSD')
        count = int(request.args.get('count', 1))
        
        # NewsAPI.org endpoint
        news_api_key = os.environ.get('NEWS_API_KEY', 'demo_key')  # You'll need to set this
        news_url = f"https://newsapi.org/v2/everything"
        
        # Search for news related to the symbol
        search_query = f"{symbol} forex trading currency"
        
        params = {
            'q': search_query,
            'sortBy': 'publishedAt',
            'pageSize': count,
            'apiKey': news_api_key,
            'language': 'en'
        }
        
        response = requests.get(news_url, params=params)
        
        if response.status_code != 200:
            return jsonify({
                'error': 'Failed to fetch news',
                'status_code': response.status_code
            }), 500
        
        news_data = response.json()
        
        if not news_data.get('articles'):
            return jsonify({
                'title': 'No recent news found',
                'sentiment': 'neutral'
            })
        
        # Get the first article
        article = news_data['articles'][0]
        title = article.get('title', '')
        description = article.get('description', '')
        
        # Analyze sentiment using OpenAI
        text_to_analyze = f"{title}. {description}"
        
        try:
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a financial sentiment analyzer. Analyze the sentiment of the given news text and respond with only one word: 'positive', 'negative', or 'neutral'."
                    },
                    {
                        "role": "user",
                        "content": text_to_analyze
                    }
                ],
                max_tokens=10,
                temperature=0
            )
            
            sentiment = completion.choices[0].message.content.strip().lower()
            
            # Ensure sentiment is one of the expected values
            if sentiment not in ['positive', 'negative', 'neutral']:
                sentiment = 'neutral'
                
        except Exception as e:
            print(f"OpenAI API error: {e}")
            sentiment = 'neutral'
        
        return jsonify({
            'title': title,
            'sentiment': sentiment,
            'description': description,
            'url': article.get('url', ''),
            'publishedAt': article.get('publishedAt', '')
        })
        
    except Exception as e:
        print(f"Error in news sentiment analysis: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@news_bp.route('/summarize-week', methods=['POST'])
def summarize_week():
    """
    Summarize trading week using OpenAI
    """
    try:
        trade_data = request.json.get('trade_data', [])
        
        if not trade_data:
            return jsonify({
                'error': 'No trade data provided'
            }), 400
        
        # Prepare the data for OpenAI
        trade_summary = "Trading week summary:\n"
        for trade in trade_data:
            trade_summary += f"- {trade.get('symbol', 'Unknown')}: {trade.get('sentiment', 'neutral')} sentiment, Result: {trade.get('result', 'unknown')}\n"
        
        try:
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a trading performance analyst. Provide a concise summary of the trading week based on the provided trade data. Focus on patterns, sentiment trends, and overall performance. Keep it under 200 words."
                    },
                    {
                        "role": "user",
                        "content": trade_summary
                    }
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            summary = completion.choices[0].message.content.strip()
            
            return jsonify({
                'summary': summary
            })
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return jsonify({
                'error': 'Failed to generate summary',
                'message': str(e)
            }), 500
        
    except Exception as e:
        print(f"Error in week summary: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

