import os
import requests
from flask import Flask, jsonify, request, redirect
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
app.config["SESSION_TYPE"] = 'filesystem'
app.config["SESSION_USE_SIGNER"] = True
Session(app)

# enable CORS
CORS(app, origins=["https://themowvie.vercel.app","http://localhost:5173"], supports_credentials=True)

# initialize database
# db_URL = os.getenv("DATABASE_URL")
# db = SQL(db_URL)

# third party API key
TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")

# routes
@app.before_request
def enforce_https():
    if not request.is_secure and request.headers.get('X-Forwarded-Proto', '') != 'https':
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)

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
    page = request.args.get('page')
    params = {}
    if page:
        params['page'] = page
    url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
    headers = {
        "accept" : "application/json",
        "Authorization" : f'Bearer {TMDB_ACCESS_TOKEN}'
    }

    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json())

# trending series endpoint
@app.route('/series')
def series():
    page = request.args.get('page')
    params = {}
    if page:
        params['page'] = page
    url = "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
    headers = {
        "accept" : "application/json",
        "Authorization" : f'Bearer {TMDB_ACCESS_TOKEN}'
    }

    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json())

# details page endpoint
@app.route('/details/<int:movieId>/<string:type>')
def movieDetails(movieId, type):
    
    url = f"https://api.themoviedb.org/3/{type}/{movieId}?language=en-US&append_to_response=videos,similar"
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
    url = f"https://api.themoviedb.org/3/{type}/{movieId}/similar?language=en-US&page=1"
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

# movies page: filters movies function endpoint
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
        'include_adult' : 'false',
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

# series page: filtered series endpoint

@app.route('/quick/search/tv')
def filtersTv():
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
        url = "https://api.themoviedb.org/3/search/tv"
    else:
        url = "https://api.themoviedb.org/3/discover/tv"


    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json())

# collections page: main fetch
@app.route('/get/collections/<int:collectionId>')
def getCollections(collectionId):
    name = request.args.get('query')
    url = f'https://api.themoviedb.org/3/collection/{collectionId}?language=en-US'
    headers = {
        "accept" : "application/json",
        "Authorization" : f"Bearer {TMDB_ACCESS_TOKEN}" 
    }

    response = requests.get(url, headers=headers)
    return jsonify(response.json())

# faq page: main fetch 
@app.route('/get/faq')
def getFAQ():
    faq_data = [
        {
            "question": "What is this website about ?",
            "answer": "This website is a movie catalog that allows users to browse, search, and explore movies, TV shows, and collections with detailed information such as release dates, genres, casts, similiar movies/series, and trailers."
        },
        {
            "question": "Where does the data come from ?",
            "answer": "All data displayed on this website is fetched from The Movie Database (TMDB) API."
        },
        {
            "question": "Can I watch full movies here ?",
            "answer": "No. This website only provides trailers and detailed information about movies and series, not full-length streaming."
        },
        {
            "question": "Is this an official TMDB website ?",
            "answer": "No. This project is an educational showcase built using TMDB’s public API as part of the CS50x final project."
        },
        {
            "question": "Who built this website ?",
            "answer": "This website was built by Indra Yuliana Kustiyanto Saputro as a final project for Harvard’s CS50x course."
        },
        {
            "question": "What technologies were used to build this project ?",
            "answer": "The project uses Flask for the backend, Vanilla JavaScript and Vite for the frontend, and TMDB API for movie data."
        },
        {
            "question": "How does the website fetch movie data ?",
            "answer": "The Flask backend sends requests to the TMDB API using secure access tokens, then returns the data as JSON to the frontend."
        },
        {
            "question": "Can I search for specific movies or series ?",
            "answer": "Yes. You can use the search bar to find movies or TV shows by and more advance you can use filter functions on page movie or series for specific result."
        },
        {
            "question": "What are collections on this website ?",
            "answer": "Collections are groups of related movies, such as franchises like The Avengers or Harry Potter, combined into one category."
        },
        {
            "question": "Why do some posters or trailers not appear ?",
            "answer": "Some movies may not have complete data available from TMDB, which can cause missing images or trailers."
        },
        {
            "question": "Does the website store any user data ?",
            "answer": "No. This project does not collect or store any personal information from users."
        },
        {
            "question": "Is this website mobile-friendly ?",
            "answer": "Yes. The layout is designed to be responsive and work well on both desktop and mobile devices."
        },
        {
            "question": "Can I filter movies by genre or popularity ?",
            "answer": "yeah, you could do it by using filters fucntionality. year, country, genre, even director and character are possible."
        },
        {
            "question": "Why are some movies marked as adult content ?",
            "answer": "TMDB includes metadata for all kinds of content. The site filters adult results by default unless explicitly enabled."
        },
        {
            "question": "How often is the data updated ?",
            "answer": "The data is fetched directly from TMDB’s live API, ensuring it’s always up to date whenever the page loads."
        },
        {
            "question": "What’s the purpose of this project ?",
            "answer": "This project demonstrates web development fundamentals, including API integration, asynchronous fetching, and frontend-backend communication."
        },
        {
            "question": "How are trailers displayed ?",
            "answer": "Trailer links are retrieved from TMDB’s video endpoint, which often references official YouTube trailers."
        },
        {
            "question": "Can I contribute or modify this project ?",
            "answer": "Yes. The source code is available on GitHub, and contributions or improvements are welcome."
        },
        {
            "question": "What challenges did you face during development ?",
            "answer": "Some challenges included handling asynchronous data loading, managing CORS issues, and designing a clean, responsive interface."
        },
        {
            "question": "What are your future plans for this website ?",
            "answer": "Possible future updates include user accounts, favorites lists, rating systems, and more detailed movie analytics."
        },
        {
            "question": "Why adult movie still appering ?",
            "answer": "Sometimes TMDB’s data still includes adult stuff even if you set include_adult=false. It’s not always perfect, so a few might slip through the filter."
        },
        {
            "question": "why there's so many dummy button or icon",
            "answer": "Those are just placeholders for now — the real functions are coming later"
        },
    ]
    return jsonify(faq_data)
# end routes

if __name__ == '__main__':
    app.run()