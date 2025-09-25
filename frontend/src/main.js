import Swiper from 'swiper';
import {Navigation, Pagination, FreeMode, EffectFade, Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/effect-fade';

// NAV FUNCTIONALITY

// Search Icon Click
const searchIcon = document.querySelector('.js-search-icon');
const searchBar = document.querySelector('.js-search');
const navLink = document.querySelector('.js-nav-link');
let condition = false;

searchIcon.addEventListener('click', () => {
  if (condition === false) {
    searchBar.innerHTML = `
      <input type="text" placeholder="Search for a movie..." name="search" id="search" autocomplete="off" class="w-max h-[2.5rem] rounded-full text-white text-center border border-white px-2 py-1 transition duration-100 ease-in-out focus:outline-none text-sm" autofocus>
      <div class="js-dropdown hidden w-[20rem] h-[10rem] overflow-auto bg-[#1A19194D] absolute right-[-50%] z-50 rounded-lg"></div>`
    searchBar.focus();
  }
  else {
    searchBar.innerHTML = ``;
  }
  navLink.classList.toggle('max-xl:hidden');

  // click outside to close search bar
  document.addEventListener('click', (event) => {
    if (!searchIcon.contains(event.target) && !searchBar.contains(event.target)) {
      condition = true;
      searchBar.innerHTML = '';
    }
});
   

  condition = !condition;
})

// Hamburger Menu Click
const hamburger = document.querySelector('.js-hamburger');
const dropDown = document.querySelector('.js-dropdown-menu');
let hamCondition = false;

hamburger.addEventListener('click', () => {
  dropDown.classList.toggle('hidden');
  hamCondition = !hamCondition;
  
  // click outside to close hamburger menu
  document.addEventListener('click', (event) => {
    if (!hamburger.contains(event.target) && !dropDown.contains(event.target)) {
      hamCondition = true;
      dropDown.classList.add('hidden');
    }
  });
});

// search bar functionality
searchBar.addEventListener('input', async () => {
  const query = document.getElementById('search').value;
  const dropdown = document.querySelector('.js-dropdown');

  // fetch api with query
  try {
    let response = await axios.get(`http://127.0.0.1:5000/search?query=${query}`)
    let result = response.data.results;
    
    // display results in dropdown
    dropdown.classList.remove('hidden');
    dropdown.innerHTML  = '';

    result.forEach(movie => {
      dropdown.innerHTML += `
        <div class="flex flex-row gap-[1rem] p-2 border-b border-white hover:bg-[#FFFFFF1A] cursor-pointer justify-start items-center">
          <img src="https://image.tmdb.org/t/p/w92/${movie.poster_path}" alt="${movie.title}" class="w-[2rem] h-[3rem] object-cover mx-auto mb-1 border ">
          <p class="flex-1 text-white text-sm">${movie.title}</p>
        </div>
      `
    })
  }
  catch (error) {
    console.error(error);
    dropdown.classList.add('hidden');
    dropdown.innerHTML = '';
  }
});

// fetch main hero

// init swiper
const swiper = new Swiper('.js-hero-swiper', {
  //optional parameters
  direction: 'horizontal',
  loop: true,
  modules: [Navigation, Pagination, EffectFade, Autoplay],
  // main slider settings
  slidesPerView: 1,
  spaceBetween: 0,
  effect: 'fade',
  autoplay: {
        delay: 5000,
        disableOnInteraction: false,
  },
    
  // init pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  // init navigation
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

const trendingSwiper = new Swiper('.js-trending-swiper', {
  //optional parameters
  direction: 'horizontal',
  modules: [Navigation, Pagination, FreeMode],
  loop: false,

  // main slider settings
  freeMode: true,
  slidesPerView: "auto",
  spaceBetween: 30,
})

const popularSwiper = new Swiper('.js-popular-swiper', {
  //optional parameters
  direction: 'horizontal',
  modules: [Navigation, Pagination, FreeMode],
  loop: false,

  // main slider settings
  freeMode: true,
  slidesPerView: "auto",
  spaceBetween: 30,
})

const seriesSwiper = new Swiper('.js-series-swiper', {
  //optional parameters
  direction: 'horizontal',
  modules: [Navigation, Pagination, FreeMode],
  loop: false,

  // main slider settings
  freeMode: true,
  slidesPerView: "auto",
  spaceBetween: 30,
})

async function fetchHero() {
  const response = await axios.get('http://127.0.0.1:5000/')
  const index = response.data.results.slice(0, 10);
  const target = document.querySelector('.js-hero-swiper .swiper-wrapper');
  const movieDesc = document.querySelector('.js-sm-movie-desc');

  target.innerHTML = '';
  
  index.forEach(movie => {
    target.innerHTML += `
    <div class="swiper-slide relative transition duration-100 ease-in-out">
      <img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" alt="${movie.title}" class="w-screen h-screen object-cover brightness-50 max-sm:h-[75vh]">
       <div class="absolute inset-0 max-sm:top-0 max-sm:left-0 max-sm:w-screen max-sm:h-[75vh] bg-gradient-to-t from-[var(--color-dark-green)] via-transparent to-transparent"></div>
      <div class="max-sm:hidden js-detailed-backdrop absolute left-15 bottom-14 w-[40%] h-content z-50 flex flex-col justify-start">
        <p class="mb-2 text-white text-5xl font-bold mt-4 ml-4">${movie.title}</p>
        <p class="w-full h-[2.5rem] line-clamp-2 text-white text-sm mt-2 ml-4">${movie.overview}</p>
        <div class="ml-4 flex flex-row gap-2 items-center">
          <img src="/assets/tmdb-logo.png" alt="imdb" class="w-10 h-auto">
          <p class="text-white text-sm">${movie.vote_average} / 10</p>
        </div>
        <button class="bg-red-600 text-white px-4 py-2 rounded-full w-[8rem] mt-4 ml-4 hover:bg-red-700 transition duration-100 ease-in-out">Watch Now</button>
      </div>
        <div class="hidden max-sm:flex js-detailed-backdrop absolute bottom-4 left-0 w-full px-4 flex-col z-50">
        <p class="mb-2 text-white text-2xl font-bold">${movie.title}</p>
        <p class="line-clamp-2 text-white text-sm">${movie.overview}</p>
        <div class="flex flex-row gap-2 items-center mt-2">
          <img src="/assets/tmdb-logo.png" alt="imdb" class="w-8 h-auto">
          <p class="text-white text-sm">${movie.vote_average} / 10</p>
        </div>
        <button class="bg-red-600 text-white px-4 py-2 rounded-full w-[8rem] mt-4 hover:bg-red-700 transition">Watch Now</button>
      </div>
    </div>`;
  })

  swiper.update();
}

fetchHero();

// func: fecth movie list api (home)
async function listMovies(segmentation) {
  // fetch api
  try {
    const response = await axios.get(`http://127.0.0.1:5000/${segmentation}`)
    const movies = response.data.results;
    return movies;
  }
  catch (error) {
    console.error(error);
  }
}

// render trending movies list
let trending = await listMovies('trending');
const target = document.querySelector('.js-trending-swiper .swiper-wrapper');
target.innerHTML = '';

trending.forEach(movie => {
  target.innerHTML +=`
  <div class="swiper-slide !w-auto">
    <div class="w-[8rem] h-[12rem] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:scale-105 hover:shadow-lg shadow-alice-blue transition duration-100 ease-in-out">
      <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="${movie.title}" class="w-full h-full object-cover">
    </div>
  </div>`
});
trendingSwiper.update();

// render popular movies list
let popular = await listMovies('popular');
const swiperPopular = document.querySelector('.js-popular-swiper .swiper-wrapper');
swiperPopular.innerHTML = '';

popular.forEach(movie => {
  swiperPopular.innerHTML += `
  <div class="swiper-slide !w-auto">
    <div class="w-[8rem] h-[12rem] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:scale-105 hover:shadow-lg shadow-alice-blue transition duration-100 ease-in-out">
      <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="${movie.title}" class="w-full h-full object-cover">
    </div>
  </div>`
});
popularSwiper.update();

// render popular series list
let series = await listMovies('series');
const swiperSeries = document.querySelector('.js-series-swiper .swiper-wrapper');
swiperSeries.innerHTML = '';

series.forEach(movie => {
  swiperSeries.innerHTML += `
  <div class="swiper-slide !w-auto">
    <div class="w-[8rem] h-[12rem] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:scale-105 hover:shadow-lg shadow-alice-blue transition duration-100 ease-in-out">
      <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="${movie.title}" class="w-full h-full object-cover">
    </div>
  </div>`
});
seriesSwiper.update();