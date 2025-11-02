import { initNav } from "./nav.js";
import axios from 'axios';

// colection params

const param = new URLSearchParams(window.location.search);
const collectionId = param.get('id');
console.log(collectionId);


// init nav
initNav();

// alert('page is under constructions');
console.log('page is underconstructions');

async function mainData() {
  const response = await axios.get(`https://cs50x-movie-catalog-production.up.railway.app/get/collections/${collectionId}`);
  console.log(response.data);
  return response.data;
}

// Global variable
const collections = await mainData();


async function renderMain() {  
  const hero = document.querySelector('.js-detail-hero');
  hero.innerHTML = `
  <div class="relative">
    <img src="https://image.tmdb.org/t/p/original/${collections.backdrop_path}" srcset="https://image.tmdb.org/t/p/w300/${collections.backdrop_path} 300w, https://image.tmdb.org/t/p/w780/${collections.backdrop_path} 780w, https://image.tmdb.org/t/p/w1280/${collections.backdrop_path} 1280w, https://image.tmdb.org/t/p/original/${collections.backdrop_path} 2000w" sizes="100vw" alt="${collections.name}" class="w-screen h-screen object-cover brightness-50 max-sm:h-[80vh]">
      <div class="absolute inset-0 max-sm:top-0 max-sm:left-0 max-sm:w-screen max-sm:h-[80vh] bg-gradient-to-t from-[var(--color-dark-green)] via-transparent to-transparent">

    <div class="max-sm:hidden js-detailed-backdrop absolute left-15 bottom-14 w-[40%] h-content z-50 flex flex-col justify-start">
      <p class="mb-2 text-white text-5xl font-bold mt-4 ml-4">${collections.name}</p>
      <p class="w-full h-[2.5rem] line-clamp-4 mb-5 text-white text-sm mt-2 ml-4">${collections.overview}</p>
      <div class="mt-[-1rem] mb-4 ml-4 flex flex-row gap-2 items-center">
        <img src="/assets/tmdb-logo.png" alt="imdb" class="w-10 h-auto">
      </div>
      <div class="flex flex-row gap-[2rem] w-[75%]">
        <div class="size-[4rem] flex justify-center items-center border border-[#40c5fae0] rounded-full bg-dark-green p-3 cursor-pointer hover:border-[#74d5fce0] hover:scale-103">
          <img src="/assets/details/bookmark.png" class="w-auto h-auto ">
        </div>
        <div class="size-[4rem] flex justify-center items-center border border-[#40c5fae0] rounded-full bg-dark-green p-3 cursor-pointer hover:border-[#74d5fce0] hover:scale-103">
          <img src="/assets/details/thumb-up.png" class="w-auto h-auto ">
        </div>
        <div class="size-[4rem] flex justify-center items-center border border-[#40c5fae0] rounded-full bg-dark-green p-3 cursor-pointer hover:border-[#74d5fce0] hover:scale-103">
          <img src="/assets/details/thumb-down.png" class="w-auto h-auto ">
        </div>
      </div>
    </div>

    <!-- mobile layout -->
    <div class="hidden max-sm:flex js-detailed-backdrop absolute bottom-5 left-0 w-full px-4 flex-col z-50">
      <p class="mb-2 text-white text-2xl font-bold">${collections.name}</p>
      <p class="line-clamp-2 text-white text-sm">${collections.overview}</p>
      <div class="flex flex-row gap-2 items-center mt-2">
        <img src="/assets/tmdb-logo.png" alt="imdb" class="w-8 h-auto">
      </div>
      <div class="flex flex-row gap-[2rem] w-[75%] my-3">
        <div class="size-[3rem] flex justify-center items-center border border-[#40c5fae0] rounded-full bg-dark-green p-3 cursor-pointer hover:scale-105">
          <img src="/assets/details/bookmark.png" class="w-auto h-auto ">
        </div>
        <div class="size-[3rem] flex justify-center items-center border border-[#40c5fae0] rounded-full bg-dark-green p-3 cursor-pointer hover:scale-105">
          <img src="/assets/details/thumb-up.png" class="w-auto h-auto ">
        </div>
        <div class="size-[3rem] flex justify-center items-center border border-[#40c5fae0] rounded-full bg-dark-green p-3 cursor-pointer hover:scale-105">
          <img src="/assets/details/thumb-down.png" class="w-auto h-auto ">
        </div>
      </div>
    </div>
  </div>
  </div>`;
}

renderMain();

const moviesContainer = document.querySelector('.js-collections-part');
document.querySelector('.js-sub-title').innerText = 'Movie Collections'
collections.parts.forEach((movie) => {
  moviesContainer.innerHTML += `<a href="detailed.html?id=${movie.id}&type=movie">
      <div class=" flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:scale-105 hover:shadow-lg shadow-alice-blue transition duration-100 ease-in-out">
        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="w-full h-full object-cover">
        <p class="text-white text-sm text-center mt-2 overflow-hidden">${movie.title}</p>
        <p class="text-white/30 text-xs text-center mt-2 overflow-hidden">${movie.release_date}</p>
      </div>
    </a>`
})