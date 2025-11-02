import axios from "axios";
import { initNav } from './nav.js';
import Swiper from 'swiper';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { countryIso, countries } from './country.js';  

// init params
const param = new URLSearchParams(window.location.search);
let type = param.get('type');
if (!type) {
  type = 'trending';
};

// Initialize navigation functionality
initNav();

// fetching genres from the backend
async function fetchGenres() {
  try {
    const response = await axios.get('https://cs50x-movie-catalog-production.up.railway.app/genres/list');
    const genres = response.data.genres;
    return genres;
  }
  catch (error) {
    console.error(error);
  }
}
fetchGenres();

// generate genres list in the filter section
const genContainer = document.querySelector('.js-genres-container .swiper-wrapper');
const genres = await fetchGenres();
console.log(genres);

const genresSwiper = new Swiper('.js-genres-container', {
  // optinal paramenters
  direction: "horizontal",
  loop: false,

  // main slider setting
  slidesPerView: 'auto',
  spaceBetween: 20,
  freeMode: true,
  modules: [FreeMode],
});

genContainer.innerHTML += genres.map(genre => `
  <div class="swiper-slide !w-auto">
  <button class="js-genre-capsule border border-[#f338e0] rounded-full px-7 py-3 hover:bg-[#f338e0] active:bg-[#f338e0]" data-genre-id="${genre.id}" data-genre-name="${genre.name}" data-state="unselected">
    <span>${genre.name}</span>
  </button>
  </div>
`).join('');

genresSwiper.update();


// fucnctionality for genre capsules
const genreCapsContainer = document.querySelectorAll('.js-genre-capsule');
genreCapsContainer.forEach(capsule => {
  capsule.addEventListener('click', function() {
    const state = this.getAttribute('data-state');
    if (state === 'unselected') {
      this.setAttribute('data-state', 'selected');
      this.classList.add('bg-[#f338e0]');
      console.log(this.getAttribute('data-genre-name') + ' selected');
    } else {
      this.setAttribute('data-state', 'unselected');
      this.classList.remove('bg-[#f338e0]');
      console.log(this.getAttribute('data-genre-name') + ' unselected');
    }
  });
});

// genre selection state
let selectedGenres = [];
genreCapsContainer.forEach(capsule => {
  capsule.addEventListener('click', function() {
    const genreId = this.getAttribute('data-genre-id');
    const state = this.getAttribute('data-state');
    if (state === 'selected') {
      if (!selectedGenres.includes(genreId)) {
        selectedGenres.push(genreId);
      }
    } else {
      selectedGenres = selectedGenres.filter(id => id !== genreId);
    }
    // console.log('Selected genres IDs: ', selectedGenres);
  });
});

// genres counter update
const genresCounter = document.querySelector('.js-genres-counter');
genresCounter.textContent = `${selectedGenres.length} genre selected`;
genreCapsContainer.forEach(capsule => {
  capsule.addEventListener('click', function() {
    genresCounter.textContent = `${selectedGenres.length} genre selected`;
  });
});

// filter counrty dropdown
const filterCountryDropdown = document.getElementById('filter-country-dropdown');
countries.forEach(country => {
  const option = document.createElement('option');
  option.value = country.iso_3166_1;
  option.textContent = country.english_name;
  filterCountryDropdown.appendChild(option);
})

// functiolity for filter section inputs
const filterYearInput = document.getElementById('filter-year');
const filterCountryInput = document.getElementById('filter-country-dropdown');
const filterActorInput = document.getElementById('filter-actor');
const filterDirectorInput = document.getElementById('filter-director');
const filterSearchInput = document.getElementById('filter-search');

// collecting data on submit
const filters= {};
const submitButton = document.getElementById('js-filter-search-button');
submitButton.addEventListener('click', function(event) {
  event.preventDefault();
  filters.year = filterYearInput.value;
  filters.country = filterCountryInput.value;
  filters.actor = filterActorInput.value;
  filters.director = filterDirectorInput.value;
  filters.search = filterSearchInput.value;
  filters.genres = selectedGenres.join(',');
  filters.page = 1; // reset to first page on new search
  console.log('Filters to apply: ', filters);

  // cleanup filters object
  Object.keys(filters).forEach(key => {
    if (!filters[key]) delete filters[key]; 
  });
  console.log('Filters to apply after cleanup: ', filters);
});


// request data movie based on filters
async function fetchFilteredMovies(filters, page = 1) {
  try {
    const response = await axios.get('https://cs50x-movie-catalog-production.up.railway.app/quick/search/movie', {params:{ ...filters, page}});
    const movies = response.data;
    document.querySelector('.js-error-handling').innerHTML = ""
    return movies;
  }
  catch (error) {
    console.error("error:", error);
    document.querySelector('.js-error-handling').innerHTML = `
    <div class="flex justify-center items-center">
      <p>movie not found</p>
    </div>`
  }
};

// loadMore(baseMovies(), currentpage+=1);
// load more button functionality
let totalMoviesPages;
let currentpage = 1;
let isfiltered = false;
async function loadMore(event) {
  event.target.classList.add('hidden');
  if (currentpage < totalMoviesPages) {
    let movies;
    if (isfiltered) {
      movies = await baseMovies(currentpage+=1);
    } else {
      movies = await fetchFilteredMovies(filters, currentpage+=1);
    }
    console.log(movies);
    movies.results.forEach(movie => {
    if (movie.poster_path) {
      moviesContainer.innerHTML += `<a href="detailed.html?id=${movie.id}&type=movie">
      <div class="movie-card">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster" class="movie-poster rounded-lg mb-4">
      <h3 class="movie-title text-lg font-semibold mb-2">${movie.title}</h3>
      <p class="movie-release-date text-sm text-gray-500 mb-2">Release Date: ${movie.release_date}</p>
      </div>
      </a>`;
    }
  })
  if (movies) {
    const loadMoreContainer = document.querySelector('.js-load-more');
    loadMoreContainer.innerHTML = `<button class="js-load-more-button bg-[#f338e0] text-white px-6 py-3 rounded-md hover:bg-pink-600 active:bg-pink-700 mt-6 w-[80%] max-md:w-[95%]">Load More</button>`;
    document.querySelector('.js-load-more').addEventListener('click', loadMore);
  } else {
    document.querySelector('.js-load-more').innerHTML = `
    <p class="text-gray/25">end of pages</p>`
  }
}}

// render filtered movie functionality
const moviesContainer = document.querySelector('.js-movies-template');
submitButton.addEventListener('click', async function(event) {
  event.preventDefault();
  const movies = await fetchFilteredMovies(filters);
  if (movies) {
    totalMoviesPages = movies.total_pages;
    currentpage = 1;
  }
  console.log(movies);
  moviesContainer.innerHTML = '';
  movies.results.forEach(movie => {
    if (movie.poster_path) {
      moviesContainer.innerHTML += `<a href="detailed.html?id=${movie.id}&type=movie">
      <div class="movie-card">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster" class="movie-poster rounded-lg mb-4">
      <h3 class="movie-title text-lg font-semibold mb-2">${movie.title}</h3>
      <p class="movie-release-date text-sm text-gray-500 mb-2">Release Date: ${movie.release_date}</p>
      </div>
      </a>`;
    }
    if (movies) {
      const loadMoreContainer = document.querySelector('.js-load-more');
      loadMoreContainer.innerHTML = `<button class="js-load-more-button bg-[#f338e0] text-white px-6 py-3 rounded-md hover:bg-pink-600 active:bg-pink-700 mt-6 w-[80%] max-md:w-[95%]">Load More</button>`;
    }
  })

  isfiltered = false;
  if (movies) {
    const loadMoreContainer = document.querySelector('.js-load-more');
    loadMoreContainer.innerHTML = `<button class="js-load-more-button bg-[#f338e0] text-white px-6 py-3 rounded-md hover:bg-pink-600 active:bg-pink-700 mt-6 w-[80%] max-md:w-[95%]">Load More</button>`;
    document.querySelector('.js-load-more').addEventListener('click', loadMore);
  }
});

// request render base movie (movies tabs)

async function baseMovies(page = 1) {
  try {
    const response = await axios.get(`https://cs50x-movie-catalog-production.up.railway.app/${type}`, {params: {page}});
    const movies = response.data;
    return movies;
  }
  catch (error) {
    console.error(error);
  } 
}

// render base movie 
async function renderBase() {
  const movies = await baseMovies()
  if (movies) {
    totalMoviesPages = movies.total_pages;
    currentpage = 1;
  }
  console.log(movies);

  movies.results.forEach(movie => {
    if (movie.poster_path) {
      moviesContainer.innerHTML += `<a href="detailed.html?id=${movie.id}&type=movie">
      <div class="movie-card hover:scale-105 hover:shadow-lg shadow-alice-blue transition duration-100 ease-in-out">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster" class="movie-poster rounded-lg mb-4">
      <h3 class="movie-title text-lg font-semibold mb-2">${movie.title}</h3>
      <p class="movie-release-date text-sm text-gray-500 mb-2">Release Date: ${movie.release_date}</p>
      </div>
      </a>`;
    }
    if (movies) {
      const loadMoreContainer = document.querySelector('.js-load-more');
      loadMoreContainer.innerHTML = `<button class="js-load-more-button bg-[#f338e0] text-white px-6 py-3 rounded-md hover:bg-pink-600 active:bg-pink-700 mt-6 w-[80%] max-md:w-[95%]">Load More</button>`;
    }
  })
  
  isfiltered = true;
  if (movies) {
    const loadMoreContainer = document.querySelector('.js-load-more');
    loadMoreContainer.innerHTML = `<button class="js-load-more-button bg-[#f338e0] text-white px-6 py-3 rounded-md hover:bg-pink-600 active:bg-pink-700 mt-6 w-[80%] max-md:w-[95%]">Load More</button>`;
    document.querySelector('.js-load-more').addEventListener('click', loadMore);
  };
};

renderBase();

// load more button event
