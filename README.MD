# TheMowvie – CS50x Final Project 

## Demo
A demonstration video of TheMowvie can be viewed [here](https://youtu.be/u195jzohtFI).

## Project Overview
TheMowvie is a web application designed to provide users with a comprehensive, dynamic catalog of movies and TV series. The core idea of this project was to explore the capabilities of web APIs, frontend-backend integration, and dynamic content rendering while creating a useful and engaging user experience. By utilizing The Movie Database (TMDB) API, TheMowvie allows users to search for movies, explore detailed information, view cast members, watch trailers, and discover similar movies.  

This project was built as part of CS50x, with the goal of demonstrating skills in full-stack web development using Flask for the backend, vanilla JavaScript for the frontend, and third-party APIs. The emphasis was on creating a secure, reliable, and responsive application while also addressing practical issues such as HTTPS enforcement, API integration, and dynamic UI rendering.

---

## Features
The web application contains several key features designed to enhance usability and provide a rich movie-browsing experience. On the **homepage**, users can browse trending movies and TV series fetched dynamically from TMDB. The **search functionality** allows users to query movies or series by title in real-time, returning relevant results without needing to reload the page. On the **MOVIE PAGE** and **SERIES PAGE** users can find big filters fucntionality, this function will filter movie/series base on any parameter that users input. This filters including (year, country, actors, movie/series title, director, and genre) u can ssee the demo video for how to use this function properly. on the **FAQ PAGE** users will find faq card of any information of TheMowvie web app that u can't find it in this readme.md or i forgot to mention in demo video.

Each movie or series has a **detail page** that presents its title, overview, release date, and poster image. The page also includes a **cast section**, which lists actors and their roles, a **PREVIEW BUTTON** displaying YouTube trailers where available, and a **Similar Movies** feature. Also, there is **Collection Section**. What is that? That was special page that collect all prequel or sequel movies into one page so you don't have to browse it one by one. One of the design decisions made during development was to fetch similar movies using TMDB’s `append_to_response=similar` endpoint, which allowed a single API call to provide both detail and related content. This approach reduced network overhead and avoided mixed-content issues that could arise from multiple separate requests.

---

## Technical Details and Design Choices
TheMowvie is structured into two main components: the **frontend** and the **backend**. The frontend is built with HTML, CSS (using TailwindCSS for styling), and vanilla JavaScript. It employs **Swiper.js** to create a responsive, interactive slider for similar movies. By dynamically injecting HTML elements into the DOM, the frontend renders content fetched from the backend efficiently and with minimal page reloads.

The backend is implemented in Flask. It serves as an intermediary between the frontend and TMDB API, handling HTTPS requests, formatting responses, and ensuring CORS policies are properly applied to avoid mixed-content issues. Initially, the Similar Movies feature experienced issues due to HTTPS mismatches between Railway-hosted backend endpoints and the Vercel frontend. To resolve this, the backend was configured to detect `X-Forwarded-Proto` headers and enforce HTTPS, ensuring all client-server communications remain secure.

A design choice worth noting is the decision to **directly fetch similar movies from TMDB via `append_to_response`**. honestly when i try to build similiar backend route it will returning missmatch issue on the backend even though i already use https over http. so this is my way to keep getting the data from tmdb and serve it on frontend

---

## File Structure
The project’s file structure was organized to separate frontend and backend logic clearly:

cs50x-movie-catalog/
|-- frontend/
|   |- index.html         -> shows main hero movie slider, trending movies, trending series, and popular movies
|   |- movies.html        -> shows movie filters (genre, year, etc.) and filtered movie results
|   |- series.html        -> shows series filters and filtered series results
|   |- faq.html           -> displays FAQ cards for user guidance
|   |- detailed.html      -> shows details of a movie or series, including description, genre, collection, similar movies, and trailer
|   |- collections.html   -> displays a list of prequels, sequels, or related collection movies
|   |- src/
|       |- main.js        -> handles rendering for index.html (homepage) and global utilities
|       |- movies.js      -> handles rendering and API calls for movies.html (filters and results)
|       |- series.js      -> handles rendering and API calls for series.html (filters and results)
|       |- detailed.js    -> handles rendering of detailed.html (movie/series details, cast, trailer, similar)
|       |- collections.js -> handles rendering of collections.html (prequels, sequels, collection movies)
|       |- faq.js         -> handles rendering of faq.html (FAQ cards and interactive UI elements)
|-- backend/
|   |- app.py             -> Flask server handling API requests from frontend, fetching data from TMDB API, enforcing HTTPS, and returning JSON
|   |- requirements.txt   -> lists Python dependencies for backend (Flask, Flask-CORS, requests)
|   |- Procfile           -> tells Railway how to run the Flask app (e.g., `web: python app.py`)
|-- README.md             -> project documentation (this file)

Each frontend file is responsible for rendering a specific portion of the UI and interacting with the backend. The `main.js` file was designed modularly to allow easy addition of new features in the future, such as more filters or additional API endpoints. On the backend, `app.py` is the single source of truth for API communication, providing endpoints for the frontend while implementing error handling and security measures like HTTPS enforcement and CORS headers.

---

## Challenges and Solutions
Several challenges were encountered during development:

1. **Mixed-content errors:** Initial attempts to fetch similar movies via the backend caused browsers to block requests because of HTTP/HTTPS mismatches. This was solved by enforcing HTTPS on Railway and fetching similar movies via TMDB’s `append_to_response` directly.
2. **Dynamic content rendering:** Rendering cast, trailers, and similar movies dynamically required careful handling of null or missing API fields. Conditional checks were implemented to prevent broken images or empty elements from appearing.
3. **Deployment configuration:** Managing frontend deployment on Vercel and backend on Railway required ensuring proper CORS headers and secure request handling.

---

## Deployment
- **Frontend:** Hosted on [Vercel](https://vercel.com/) for fast, globally accessible deployment.
- **Backend:** Hosted on [Railway](https://railway.app/) with HTTPS enforced.
- **API Integration:** TMDB API is used for all movie data. Sensitive keys are stored in `.env` files.

---

## Future Improvements
- User authentication for saving favorite movies.
- Backend caching for TMDB responses to reduce API requests and improve performance.
- Enhanced animations and UI effects for mobile devices.

---

## Credits
- **TMDB API** for movie and TV data.  
- **Swiper.js** for the interactive slider on similar movies.  
- **TailwindCSS** for styling.  
- **CS50x** for course guidance and project structure.  
-**FIGMA COMUNITY DESIGN** for desktop and mobile layout design for this project
---