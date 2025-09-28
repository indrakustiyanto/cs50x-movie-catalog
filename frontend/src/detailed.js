import axios from 'axios';
import { initNav } from './nav.js';

  // getting movie id
const param = new URLSearchParams(window.location.search);
const movieId = param.get('id');
console.log(movieId)

  // NAV FUNCTIONALITY
initNav();

  // MAIN FUNCTIONALITY
// fetching main data
async function mainFetch() {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/details/${movieId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error)
  }
}


// render main data
async function renderMain() {
  const movie = await mainFetch();
  const hero = document.querySelector('.js-detail-hero');
  hero.innerHTML = `
  <div class="relative">
    <img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" srcset="https://image.tmdb.org/t/p/w300/${movie.backdrop_path} 300w, https://image.tmdb.org/t/p/w780/${movie.backdrop_path} 780w, https://image.tmdb.org/t/p/w1280/${movie.backdrop_path} 1280w, https://image.tmdb.org/t/p/original/${movie.backdrop_path} 2000w" sizes="100vw" alt="${movie.title}" class="w-screen h-screen object-cover brightness-50 max-sm:h-[75vh]">
      <div class="absolute inset-0 max-sm:top-0 max-sm:left-0 max-sm:w-screen max-sm:h-[75vh] bg-gradient-to-t from-[var(--color-dark-green)] via-transparent to-transparent">

    <div class="max-sm:hidden js-detailed-backdrop absolute left-15 bottom-14 w-[40%] h-content z-50 flex flex-col justify-start">
      <p class="mb-2 text-white text-5xl font-bold mt-4 ml-4">${movie.title}</p>
      <p class="w-full h-[2.5rem] line-clamp-2 text-white text-sm mt-2 ml-4">${movie.overview}</p>
      <div class="ml-4 flex flex-row gap-2 items-center">
        <img src="/assets/tmdb-logo.png" alt="imdb" class="w-10 h-auto">
        <p class="text-white text-sm">${movie.vote_average} / 10</p>
      </div>
      <a href="detailed.html?id=${movie.id}" class="bg-red-600 text-white px-4 py-2 rounded-full w-[8rem] mt-4 ml-4 hover:bg-red-700 transition duration-100 ease-in-out">View Details</a>
    </div>

    <div class="hidden max-sm:flex js-detailed-backdrop absolute bottom-4 left-0 w-full px-4 flex-col z-50">
      <p class="mb-2 text-white text-2xl font-bold">${movie.title}</p>
      <p class="line-clamp-2 text-white text-sm">${movie.overview}</p>
      <div class="flex flex-row gap-2 items-center mt-2">
        <img src="/assets/tmdb-logo.png" alt="imdb" class="w-8 h-auto">
        <p class="text-white text-sm">${movie.vote_average} / 10</p>
      </div>
      <a href="detailed.html?id=${movie.id}" class="bg-red-600 text-white px-4 py-2 rounded-full w-[8rem] mt-4 hover:bg-red-700 transition">View Details</a>
    </div>
  </div>`;
}


renderMain();



