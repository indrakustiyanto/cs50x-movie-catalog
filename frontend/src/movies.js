import axios from "axios";
import { initNav } from './nav.js';
import Swiper from 'swiper';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { countryIso, countries } from './country.js';  

// Initialize navigation functionality
initNav();

// fetching genres from the backend
async function fetchGenres() {
  try {
    const response = await axios.get('http://127.0.0.1:5000/genres/list');
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
  console.log('Filters to apply: ', filters);

  // cleanup filters object
  Object.keys(filters).forEach(key => {
    if (!filters[key]) delete filters[key]; 
  });
  console.log('Filters to apply after cleanup: ', filters);
});


// render movie based on filters

async function fetchFilteredMovies(filters) {
  try {
    const response = await axios.get('http://127.0.0.1:5000/quick/search/movie', {params: filters});
    const movies = response.data;
    return movies;
  }
  catch (error) {
    console.error("error:", error);
  }
};

const moviesContainer = document.querySelector('.js-movies-container');
submitButton.addEventListener('click', async function(event) {
  event.preventDefault();
  const movies = await fetchFilteredMovies(filters);
  console.log('Filtered movies: ', movies);
});