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

# routes

# base endpoint homepage
@app.route('/', methods=['GET'])
def index():
    url = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}"
    }   
    res = requests.get(url, headers=headers)
    return jsonify(res.json())

# db init check
@app.route('/check', methods=['GET'])
def check():
    res = db.execute("SELECT * FROM users")
    return jsonify(res)

# search bar nav endpoint
@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    url = f'https://api.themoviedb.org/3/search/multi?query={query}'
    headers = {
        'Authorization': f'Bearer {TMDB_ACCESS_TOKEN}',
    }

    res = requests.get(url, headers=headers)
    return jsonify(res.json())

# trending movie endpoint
@app.route('/trending', methods=["GET"])
def trending():
    page = request.args.get('page')
    params = {}
    if page:
        params['page'] = page
    url = "https://api.themoviedb.org/3/trending/movie/day?language=en-US"

    headers = {
        "accept": "application/json",
        "Authorization": f'Bearer {TMDB_ACCESS_TOKEN}'
    }

    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json())

# popular movie endpoint
@app.route('/popular', methods=["GET"])
def popular():
    url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
    headers = {
        "accept" : "application/json",
        "Authorization" : f'Bearer {TMDB_ACCESS_TOKEN}'
    }

    response = requests.get(url, headers=headers)
    return jsonify(response.json())

# trending series endpoint
@app.route('/series')
def series():
    url = "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
    headers = {
        "accept" : "application/json",
        "Authorization" : f'Bearer {TMDB_ACCESS_TOKEN}'
    }

    response = requests.get(url, headers=headers)
    return jsonify(response.json())

# details page endpoint
@app.route('/details/<int:movieId>/<string:type>')
def movieDetails(movieId, type):
    
    url = f"https://api.themoviedb.org/3/{type}/{movieId}?language=en-US&append_to_response=videos"
    headers = {
        "accept" : "application/json",
        "Authorization" : f'Bearer {TMDB_ACCESS_TOKEN}'
    }

    response = requests.get(url, headers=headers)
    return jsonify(response.json())


# image for details page's endpoint
@app.route('/details/<int:movieId>/<string:type>/images')
def getImages(movieId, type):
    url = f"https://api.themoviedb.org/3/{type}/{movieId}/images"
    headers = {
        "accept" : "application/json",
        "Authorization" : f"Bearer {TMDB_ACCESS_TOKEN}"
    }

    response = requests.get(url, headers=headers)
    print(response)
    return jsonify(response.json())

# details page: credit endpoint
@app.route('/credit/<string:type>/<int:movieId>')
def getMovieCredits(type, movieId):
    url = f"https://api.themoviedb.org/3/{type}/{movieId}/credits"
    headers = {
        "accept" : "application/json",
        "Authorization" : f"Bearer {TMDB_ACCESS_TOKEN}"
    }

    response = requests.get(url, headers=headers)
    return jsonify(response.json())


# details page: similiar movie/series enpoint
@app.route('/recomendation/<string:type>/<int:movieId>/')
def recomendationsMovieTv(type, movieId):
    url = f"https://api.themoviedb.org/3/{type}/{movieId}/recommendations?language=en-US&page=1"
    headers = {
        "accept" : "application/json",
        "Authorization" : f"Bearer {TMDB_ACCESS_TOKEN}"
    }

    response = requests.get(url, headers=headers)
    return jsonify(response.json())

# movies page: genres list endpoint
@app.route('/genres/list')
def genres():
    url = "https://api.themoviedb.org/3/genre/movie/list?language=en-US"
    headers = {
        "accept" : "application/json",
        "Authorization" : f"Bearer {TMDB_ACCESS_TOKEN}"
    }

    response = requests.get(url, headers=headers)
    return jsonify(response.json())

# movies page: country's id endpoint
@app.route('/country')
def getCountry():
    url = "https://api.themoviedb.org/3/configuration/countries"
    headers = {
        "accept" : "application/json",
        "Authorization" : f"Bearer {TMDB_ACCESS_TOKEN}"
    }
    response = requests.get(url, headers=headers)
    return jsonify(response.json())

# movies page: filters function endpoint
@app.route('/quick/search/movie')
def filters():
    year = request.args.get('year')
    country = request.args.get('country')
    actor = request.args.get('actor')
    director = request.args.get('director')
    search = request.args.get('search')
    genres = request.args.get('genres')
    page = request.args.get('page', 1)

    params = {
        'language': "en-US",
    }

    headers = {
        "accept" : "application/json",
        "Authorization" : f"Bearer {TMDB_ACCESS_TOKEN}"
    }

    if year:
        params['primary_release_year'] = year
    if country:
        params['with_origin_country'] = country
    if actor:
        getActorurl = "https://api.themoviedb.org/3/search/person"
        actor_params = {
            'query': actor,
            'language': "en-US",
        }
        actor_response = requests.get(getActorurl, headers=headers, params=actor_params)
        actor_response = actor_response.json()
        params['with_cast'] = actor_response["results"][0]['id']
    if director:
        get_director_url = "https://api.themoviedb.org/3/search/person"
        director_params = {
            'query': director,
            'language': "en-US",
        }
        director_response = requests.get(get_director_url, headers=headers, params=director_params)
        director_response = director_response.json()
        params['with_crew'] = director_response["results"][0]['id']
    if genres:
        params['with_genres'] = genres
    if page:
        params['page'] = page
    if search:
        params['query'] = search
        url = "https://api.themoviedb.org/3/search/multi"
    else:
        url = "https://api.themoviedb.org/3/discover/movie"


    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json())
# end routes

if __name__ == '__main__':
    app.run(debug=True, port=8080)