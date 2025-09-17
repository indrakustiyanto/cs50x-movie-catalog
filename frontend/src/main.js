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
let condition = false;

searchIcon.addEventListener('click', () => {
  if (condition === false) {
    searchBar.innerHTML = `
      <input type="text" placeholder="Search for a movie..." name="search" id="search" autocomplete="off" class="w-max h-[2.5rem] rounded-full text-white text-center border border-white px-2 py-1 transition duration-100 ease-in-out focus:outline-none text-sm">
      <div class="js-dropdown hidden w-[20rem] h-[10rem] overflow-auto bg-[#1A19194D] absolute left-0 right-0 z-50 rounded-lg"></div>`
  }
  else {
    searchBar.innerHTML = ``;
  }

  // click outside to close search bar
  document.addEventListener('click', (event) => {
    if (!searchIcon.contains(event.target) && !searchBar.contains(event.target)) {
      condition = true;
      searchBar.innerHTML = '';
    }
});
   

  condition = !condition;
  console.log(condition);
})

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

// function to fetch trending movies and display the backdrop of the first movie and poster

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
        delay: 3500,
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

async function fetchTrending() {
  const response = await axios.get('http://127.0.0.1:5000/')
  const index = response.data.results.slice(0, 10);
  const target = document.querySelector('.js-hero-swiper .swiper-wrapper');

  target.innerHTML = '';
  
  index.forEach(movie => {
    target.innerHTML += `
    <div class="swiper-slide transition duration-100 ease-in-out">
      <img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" alt="${movie.title}" class="w-screen h-screen object-cover brightness-50">
       <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-green)] via-transparent to-transparent"></div>
      <div class="js-detailed-backdrop absolute left-25 bottom-14 w-[40%] h-content z-50 flex flex-col justify-start">
        <p class="mb-2 text-white text-5xl font-bold mt-4 ml-4">${movie.title}</p>
        <p class="w-full h-[2.5rem] line-clamp-2 text-white text-sm mt-2 ml-4">${movie.overview}</p>
        <div class="ml-4 flex flex-row gap-2 items-center">
          <img src="/assets/tmdb-logo.png" alt="imdb" class="w-10 h-auto">
          <p class="text-white text-sm">${movie.vote_average} / 10</p>
        </div>
        <button class="bg-red-600 text-white px-4 py-2 rounded-full w-[8rem] mt-4 ml-4 hover:bg-red-700 transition duration-100 ease-in-out">Watch Now</button>
        
      </div>
    </div>`;

    // update swiper after adding slides
    // swiper.update();
    
  });
}

fetchTrending();

// list movies function
async function listMovies() {
  // fetch api
  try {
    const response = await axios.get('http://127.0.0.1:5000/trending')
    const movies = response.data.results;
    console.log(movies);

    // render movies
    const target = document.querySelector('.js-trending-swiper .swiper-wrapper');
    target.innerHTML = '';

    movies.forEach(movie => {
      target.innerHTML +=`
      <div class="swiper-slide !w-auto">
        <div class="w-[8rem] h-[12rem] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition duration-100 ease-in-out">
          <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="${movie.title}" class="w-full h-full object-cover">
        </div>
      </div>`
    });
    trendingSwiper.update();
  }
  catch (error) {
    console.error(error);
  }
}

listMovies();