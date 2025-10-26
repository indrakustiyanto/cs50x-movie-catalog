import Swiper from 'swiper';
import {Navigation, Pagination, FreeMode, EffectFade, Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/effect-fade';
import { initNav } from './nav.js';

// *** NAV FUNCTIONALITY ***
initNav();

// *** MAIN SECTION FUNCTIONALITY ***

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


// fetch main
async function fetchHero() {
  const response = await axios.get('http://127.0.0.1:5000/')
  const index = response.data.results.slice(0, 10);
  const target = document.querySelector('.js-hero-swiper .swiper-wrapper');
  const movieDesc = document.querySelector('.js-sm-movie-desc');
  console.log(index);
  target.innerHTML = '';
  
  index.forEach(movie => {
    target.innerHTML += `
    <div class="swiper-slide relative transition duration-100 ease-in-out">
      <img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" srcset="https://image.tmdb.org/t/p/w300/${movie.backdrop_path} 300w, https://image.tmdb.org/t/p/w780/${movie.backdrop_path} 780w, https://image.tmdb.org/t/p/w1280/${movie.backdrop_path} 1280w, https://image.tmdb.org/t/p/original/${movie.backdrop_path} 2000w" sizes="100vw" alt="${movie.title}" class="w-screen h-screen object-cover brightness-50 max-sm:h-[75vh]">
       <div class="absolute inset-0 max-sm:top-0 max-sm:left-0 max-sm:w-screen max-sm:h-[75vh] bg-gradient-to-t from-[var(--color-dark-green)] via-transparent to-transparent">

      <div class="max-sm:hidden js-detailed-backdrop absolute left-15 bottom-14 w-[40%] h-content z-50 flex flex-col justify-start">
        <p class="mb-2 text-white text-5xl font-bold mt-4 ml-4">${movie.title}</p>
        <p class="w-full h-[2.5rem] line-clamp-2 text-white text-sm mt-2 ml-4">${movie.overview}</p>
        <div class="ml-4 flex flex-row gap-2 items-center">
          <img src="/assets/tmdb-logo.png" alt="imdb" class="w-10 h-auto">
          <p class="text-white text-sm">${movie.vote_average} / 10</p>
        </div>
        <a href="detailed.html?id=${movie.id}&type=movie" class="bg-red-600 text-white px-4 py-2 rounded-full w-[8rem] mt-4 ml-4 hover:bg-red-700 transition duration-100 ease-in-out">View Details</a>
      </div>

      <div class="hidden max-sm:flex js-detailed-backdrop absolute bottom-4 left-0 w-full px-4 flex-col z-50">
        <p class="mb-2 text-white text-2xl font-bold">${movie.title}</p>
        <p class="line-clamp-2 text-white text-sm">${movie.overview}</p>
        <div class="flex flex-row gap-2 items-center mt-2">
          <img src="/assets/tmdb-logo.png" alt="imdb" class="w-8 h-auto">
          <p class="text-white text-sm">${movie.vote_average} / 10</p>
        </div>
        <a href="detailed.html?id=${movie.id}&type=movie" class="bg-red-600 text-white px-4 py-2 rounded-full w-[8rem] mt-4 hover:bg-red-700 transition">View Details</a>
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
const subTrend = document.querySelector('.js-sub-trends');
const seeTrend = document.querySelector('.js-see-trends');
if (trending) {
  subTrend.innerText = 'Trends';
  seeTrend.innerText = 'See More ->';
} else {
  subTrend.innerText = '';
  seeTrend.innerText = '';
}
const target = document.querySelector('.js-trending-swiper .swiper-wrapper');
target.innerHTML = '';

trending.forEach(movie => {
  target.innerHTML +=`
  <div class="swiper-slide !w-auto">
    <a href="detailed.html?id=${movie.id}&type=movie">
      <div class="w-[8rem] h-[12rem] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:scale-105 hover:shadow-lg shadow-alice-blue transition duration-100 ease-in-out">
        <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="${movie.title}" class="w-full h-full object-cover">
      </div>
    </a>
  </div>`
});
trendingSwiper.update();

// render popular movies list
let popular = await listMovies('popular');
const subPopular = document.querySelector('.js-sub-popular');
const seePopular = document.querySelector('.js-see-popular');
if (popular) {
  subPopular.innerText = 'Popular';
  seePopular.innerText = 'See More ->';
} else {
  subPopular.innerText = '';
  seePopular.innerText = '';
}
const swiperPopular = document.querySelector('.js-popular-swiper .swiper-wrapper');
swiperPopular.innerHTML = '';

popular.forEach(movie => {
  swiperPopular.innerHTML += `
  <div class="swiper-slide !w-auto">
    <a href="detailed.html?id=${movie.id}&type=movie">
      <div class="w-[8rem] h-[12rem] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:scale-105 hover:shadow-lg shadow-alice-blue transition duration-100 ease-in-out">
        <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="${movie.title}" class="w-full h-full object-cover">
      </div>
    </a>
  </div>`
  console.log(movie);
});
popularSwiper.update();

// render popular series list
let series = await listMovies('series');
const subSeries = document.querySelector('.js-sub-series');
const seeSeries = document.querySelector('.js-see-series');
if (series) {
  subSeries.innerText = 'Series';
  seeSeries.innerText = 'See More ->';
} else {
  subSeries.innerText = '';
  seeSeries.innerText = '';
}
const swiperSeries = document.querySelector('.js-series-swiper .swiper-wrapper');
swiperSeries.innerHTML = '';

series.forEach(movie => {
  swiperSeries.innerHTML += `
  <div class="swiper-slide !w-auto">
    <a href="detailed.html?id=${movie.id}&type=tv">
      <div class="w-[8rem] h-[12rem] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:scale-105 hover:shadow-lg shadow-alice-blue transition duration-100 ease-in-out">
        <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="${movie.title}" class="w-full h-full object-cover">
      </div>
    </a>
  </div>`
});
seriesSwiper.update();