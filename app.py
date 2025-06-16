from flask_cors import CORS
from flask import Flask, request, jsonify
import joblib
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

app = Flask(__name__)
CORS(app)

# Load saved assets
vectorizer = joblib.load('vectorizer.pkl')
vector_matrix = joblib.load('vector_matrix.pkl')
cars_data = pd.read_csv('car_data.csv')

# ----- Binning functions -----
def year_bin(year):
    if year >= 2017:
        return "year_new"
    elif year >= 2010:
        return "year_mid"
    else:
        return "year_old"

def price_bin(price):
    if price < 208749:
        return "price_budget"
    elif price < 600000:
        return "price_midrange"
    else:
        return "price_premium"

def kms_bin(kms):
    if kms < 35000:
        return "kms_low"
    elif kms < 90000:
        return "kms_mid"
    else:
        return "kms_high"

# ----- Route to get similar cars -----
@app.route('/getSimilarCars', methods=['POST'])

def get_similar_cars():
    data = request.json

    try:
        name = data['name'].strip().lower()
        year = int(data['year'])
        price = float(data['sellingPrice'])
        kms = float(data['kmsDriven'])
        fuel = data['fuel'].strip()
        sellerType = data['sellerType'].replace(' ', '')
        transmission = data['transmission']
        owner = data['owner'].replace(' ', '')

        # Apply binning
        year_tag = year_bin(year)
        price_tag = price_bin(price)
        kms_tag = kms_bin(kms)

        # Create tag string for the new car
        tags = f"{name} {year_tag} {price_tag} {kms_tag} {fuel} {sellerType} {transmission} {owner}".lower()

        # Transform new car tags
        input_vector = vectorizer.transform([tags])

        # Compute cosine similarity
        similarity = cosine_similarity(input_vector, vector_matrix)

        # Get top 5 similar cars
        top_indices = similarity[0].argsort()[-5:][::-1]
        similar_car_ids = cars_data.iloc[top_indices]['_id'].tolist()

        similar_cars = cars_data[cars_data['_id'].isin(similar_car_ids)][['_id', 'name']]
    
        # Convert to list of dicts
        result = similar_cars.to_dict(orient='records')
        
        return jsonify({'similarCars': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ----- Start server -----
if __name__ == '__main__':
    app.run()