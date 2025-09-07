import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_session import Session
from cs50 import SQL
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# initialize Flask app
app = Flask(__name__)

# config
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = os.getenv("SESSION_TYPE")
app.config["SESSION_USE_SIGNER"] = True
Session(app)

# enable CORS
CORS(app, supports_credentials=True)

# initialize database
db_URL = os.getenv("DATABASE_URL")
db = SQL(db_URL)

# third party API key
TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")

@app.route('/api/users', methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                "indra",
                "fauzan",
                "fauzi"
            ]
        }
    )

@app.route('/check', methods=['GET'])
def check():
    res = db.execute("SELECT * FROM users")
    return jsonify(res)

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    url = f'https://api.themoviedb.org/3/search/movie?query={query}'
    headers = {
        'Authorization': f'Bearer {TMDB_ACCESS_TOKEN}',
    }

    res = requests.get(url, headers=headers)
    return jsonify(res.json())

if __name__ == '__main__':
    app.run(debug=True, port=8080)