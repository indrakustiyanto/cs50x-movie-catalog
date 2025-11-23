import axios from 'axios';
import { initNav } from './nav.js';
import Swiper from 'swiper';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

  // getting movie id
const param = new URLSearchParams(window.location.search);
const movieId = param.get('id');
const type = param.get('type');
console.log(type);
console.log(movieId);

  // NAV FUNCTIONALITY
initNav();

  // MAIN FUNCTIONALITY
  
// fetching main data
async function mainFetch() {
  try {
    const response = await axios.get(`https://cs50x-movie-catalog-production.up.railway.app/details/${movieId}/${type}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error)
  }
}

// change play hour time
function hour(data) {
  let m = data%60;
  let h = Math.floor(data/60);
  return `${h} Hour ${m} minutes`
}

// GLOBAL VARIABLES
const movie = await mainFetch();
console.log(movie);

// render main data
async function renderMain() {  
  const hero = document.querySelector('.js-detail-hero');
  if (type === 'movie') {
    hero.innerHTML = `
  <div class="relative">
    <img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" srcset="https://image.tmdb.org/t/p/w300/${movie.backdrop_path} 300w, https://image.tmdb.org/t/p/w780/${movie.backdrop_path} 780w, https://image.tmdb.org/t/p/w1280/${movie.backdrop_path} 1280w, https://image.tmdb.org/t/p/original/${movie.backdrop_path} 2000w" sizes="100vw" alt="${movie.title}" class="w-screen h-screen object-cover brightness-50 max-sm:h-[80vh]">
      <div class="absolute inset-0 max-sm:top-0 max-sm:left-0 max-sm:w-screen max-sm:h-[80vh] bg-gradient-to-t from-[var(--color-dark-green)] via-transparent to-transparent">

    <div class="max-sm:hidden js-detailed-backdrop absolute left-15 bottom-14 w-[40%] h-content z-50 flex flex-col justify-start">
      <p class="mb-2 text-white text-5xl font-bold mt-4 ml-4">${movie.title}</p>
      <p class="w-full h-[2.5rem] line-clamp-2 text-white text-sm mt-2 ml-4">${hour(movie.runtime)} - ${(movie.release_date).split("-")[0]} - ${movie.production_countries[0].iso_3166_1}</p>
      <div class="mt-[-1rem] mb-4 ml-4 flex flex-row gap-2 items-center">
        <img src="/assets/tmdb-logo.png" alt="imdb" class="w-10 h-auto">
        <p class="text-white text-sm">${movie.vote_average} / 10</p>
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

    <div class="max-sm:hidden w-[30%] h-content absolute bottom-14 right-25 font-bold flex flex-row gap-8 text-center">
      <a href="" class="px-8 py-4 bg-[#00b2f8df] rounded-full flex-1 hover:shadow-[0_0_30px_1px_#00b2f8df] whitespace-nowrap">Watch Now</a>
      <button class="js-preview-button px-8 py-4 border border-[#00b2f8df] rounded-full flex-1 hover:scale-105 hover:border-amber-300 self-center">Preview</button>
    </div>

    <div class="hidden max-sm:flex js-detailed-backdrop absolute bottom-5 left-0 w-full px-4 flex-col z-50">
      <p class="mb-2 text-white text-2xl font-bold">${movie.title}</p>
      <p class="line-clamp-2 text-white text-sm">${hour(movie.runtime)} - ${(movie.release_date).split("-")[0]} - ${movie.production_countries[0].iso_3166_1}</p>
      <div class="flex flex-row gap-2 items-center mt-2">
        <img src="/assets/tmdb-logo.png" alt="imdb" class="w-8 h-auto">
        <p class="text-white text-sm">${movie.vote_average} / 10</p>
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
      <button id="" class="js-preview-button bg-[#00b2f8df] text-white px-4 py-2 rounded-full w-[8rem] mt-3 hover:bg-red-700 transition">Watch Trailer</button>
    </div>
  </div>`;
  }
  
  else {
    hero.innerHTML = `
    <div class="relative">
      <img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" srcset="https://image.tmdb.org/t/p/w300/${movie.backdrop_path} 300w, https://image.tmdb.org/t/p/w780/${movie.backdrop_path} 780w, https://image.tmdb.org/t/p/w1280/${movie.backdrop_path} 1280w, https://image.tmdb.org/t/p/original/${movie.backdrop_path} 2000w" sizes="100vw" alt="${movie.title}" class="w-screen h-screen object-cover brightness-50 max-sm:h-[80vh]">
      <div class="absolute inset-0 max-sm:top-0 max-sm:left-0 max-sm:w-screen max-sm:h-[80vh] bg-gradient-to-t from-[var(--color-dark-green)] via-transparent to-transparent">

      <div class="max-sm:hidden js-detailed-backdrop absolute left-15 bottom-14 w-[40%] h-content z-50 flex flex-col justify-start">
        <p class="mb-2 text-white text-5xl font-bold mt-4 ml-4">${movie.name}</p>
        <p class="w-full h-[2.5rem] line-clamp-2 text-white text-sm mt-2 ml-4">${movie.number_of_seasons} seasons ${movie.number_of_episodes} episodes - ${(movie.first_air_date).split("-")[0]} - ${movie.production_countries[0].iso_3166_1}</p>
        <div class="mt-[-1rem] mb-4 ml-4 flex flex-row gap-2 items-center">
          <img src="/assets/tmdb-logo.png" alt="imdb" class="w-10 h-auto">
          <p class="text-white text-sm">${movie.vote_average} / 10</p>
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
      <div class="max-sm:hidden w-[30%] h-content absolute bottom-14 right-25 font-bold flex flex-row gap-8 text-center">
        <a href="" class="px-8 py-4 bg-[#00b2f8df] rounded-full flex-1 hover:shadow-[0_0_30px_1px_#00b2f8df] whitespace-nowrap">Watch Now</a>
        <button id="" class="js-preview-button px-8 py-4 border border-[#00b2f8df] rounded-full flex-1 hover:scale-105 hover:border-amber-300 self-center">Preview</button>
      </div>

      <div class="hidden max-sm:flex js-detailed-backdrop absolute bottom-5 left-0 w-full px-4 flex-col z-50">
        <p class="mb-2 text-white text-2xl font-bold">${movie.name}</p>
        <p class="line-clamp-2 text-white text-sm">${movie.number_of_seasons} seasons ${movie.number_of_episodes} episodes - ${(movie.first_air_date).split("-")[0]} - ${movie.production_countries[0].iso_3166_1}</p>
        <div class="flex flex-row gap-2 items-center mt-2">
          <img src="/assets/tmdb-logo.png" alt="imdb" class="w-8 h-auto">
          <p class="text-white text-sm">${movie.vote_average} / 10</p>
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
        <a id="" class="js-preview-button bg-[#00b2f8df] text-white px-4 py-2 rounded-full w-[8rem] mt-3 hover:bg-red-700 transition">Watch Trailer</a>
      </div>
    </div>`
  }
}
renderMain();

// preview functionality
const previewButton = document.querySelectorAll('.js-preview-button');
const overlay = document.getElementById('overlay-container');
const closeBtn = document.getElementById('iframe-close');
const iframe = document.getElementById('iframe');
const videos = movie.videos.results;

previewButton.forEach((button) => {
  button.addEventListener('click', () => {
    if (videos && videos.length >= 1) {
      const key = videos.find(video => video.site === 'YouTube' && video.type === 'Trailer') || videos.find(video => video.site === 'YouTube' && video.type === 'Teaser')
      if(key) {
        iframe.src = `https://www.youtube.com/embed/${key.key}?autoplay=1`;
        overlay.classList.remove('hidden');
      }
    } else {
      alert('sorry but we couldn\'t find the triler of this movies or serires ')
    }
  });
})


closeBtn.addEventListener('click', function(event) {
  event.preventDefault();
  iframe.src = '';
  overlay.classList.add('hidden');  
});

overlay.addEventListener('click', (event) => {
  if(event.target === overlay) {
    iframe.src = '';
    overlay.classList.add('hidden');
  }
})
// getting movie image
async function getImage() {
  try {
    const response = await axios.get(`https://cs50x-movie-catalog-production.up.railway.app/details/${movieId}/${type}/images`);
    const result = response.data.backdrops;
    return result;
  } catch (error) {
    console.error(error)
  }
}
getImage()

// init imageSwiper

let imageSwiper = new Swiper(".js-image-swiper", {
  // optinal paramenters
  direction: "horizontal",
  loop: false,

  // main slider setting
  slidesPerView: 'auto',
  spaceBetween: 3,
  freeMode: true,
  modules: [FreeMode],
})

// render image swiper
async function renderImage() {
  const images = await getImage();
  const target = document.querySelector(".js-image-swiper .swiper-wrapper");
  target.innerHTML = '';
  console.log(images);

  if (target !== undefined) {
    images.forEach(Image => {
    target.innerHTML += `
    <div class="swiper-slide !w-auto">
      <div class="size-[8rem] mx-3">
        <img src="https://image.tmdb.org/t/p/w300/${Image.file_path}" alt="movie image" class="w-full h-full object-cover rounded-lg">
      </div>
    </div>`;
     });
  } else {
    target.innerHTML = '';
  }
}
imageSwiper.update();
renderImage();

// render description
const descriptionTarget = document.querySelector('.js-description');
const subDesc = document.querySelector('.js-sub-desc');
descriptionTarget.innerText = movie.overview;
if (movie.overview) {
  subDesc.innerText = 'Movie Description';
};

// render genres
const genres = movie.genres;
const subGenres = document.querySelector('.js-sub-genres');
if (genres) {
  subGenres.innerText = "Genres";
}
const genContainer = document.querySelector('.js-genres-container .swiper-wrapper')
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
    <div class="js-genre-capsule bg-[#f338e0] rounded-full px-7 py-3" data-genre-id="${genre.id}" data-genre-name="${genre.name}" data-state="unselected">
      <span>${genre.name}</span>
    </div>
  </div>
`).join('');

// fecthing cast
async function fetchCast() {
  try {
    const response = await axios.get(`https://cs50x-movie-catalog-production.up.railway.app/credit/${type}/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// init castSwiper
let castSwiper = new Swiper(".js-cast-swiper", {
  // optional parameters
  derection: "horizontal",
  loop: false,

  // main slider setting
  slidesPerView: 'auto',
  spaceBetween: 10,
  freeMode: true,
  modules: [FreeMode],
})

// render cast
const cast = await fetchCast();
console.log(cast);
const subCast = document.querySelector('.js-sub-cast');
if (cast) {
  subCast.innerText = 'Characters';
}
const castTarget = document.querySelector('.js-cast-swiper .swiper-wrapper');
castTarget.innerHTML = '';
cast.cast.forEach(actor => {
  if (actor.profile_path != null) {
    castTarget.innerHTML += `
    <div class="swiper-slide !w-[9.5rem]">
    <a href="movies.html?cast=${actor.name}">
      <div>
        <div class="size-[8rem] mx-3">
          <img src="https://image.tmdb.org/t/p/w300/${actor.profile_path}" alt="actor image" class="w-full h-full object-cover rounded-lg">
        </div>
        <p class="text-white text-sm text-center mt-2 line-clamp-1">${actor.name}</p>
        <p class="text-gray-400 text-xs text-center mt-1 line-clamp-1 overflow-hidden">${actor.character}</p>
      </div>
    </a>
    </div>`;
  }
});

// fetching similiar movies
async function fetchRecommendation() {
  try {
    const response = await axios.get(`https://cs50x-movie-catalog-production.up.railway.app/recomendation/${type}/${movieId}`);
    return response.data.results;
  }
  catch (error) {
    console.error(error);
    return [];
  }
}

// init recomendationSwiper
let recomendationSwiper = new Swiper('.js-similiar-swiper', {
  // optional parameters
  direction: 'horizontal',
  loop: false,

  // main slider setting
  slidesPerView: 'auto',
  spaceBetween: 10,
  FreeMode: true,
  modules: [FreeMode],
});

// render recomendation
const recomendations = movie.recommendations.results;
console.log(recomendations);
const subSimiliar = document.querySelector('.js-sub-similiar');
if (type === 'movie') {
  subSimiliar.innerText = 'Similiar Movie';
} else {
  subSimiliar.innerText = 'Similiar Series';
}

const recomendationTarget = document.querySelector('.js-similiar-swiper .swiper-wrapper');
recomendationTarget.innerHTML = '';
recomendations.forEach(item => {
  if (item.poster_path != null || recomendations.length === 0) {
    recomendationTarget.innerHTML += `
    <div class="swiper-slide !w-[9.5rem]">
      <a href="detailed.html?id=${item.id}&type=${type}">
        <div class="size-[8rem] mx-3">
          <img src="https://image.tmdb.org/t/p/w300/${item.poster_path}" alt="movie poster" class="w-full h-full object-cover rounded-lg">
          </div>
          <p class="text-white text-sm text-center mt-2 overflow-hidden">${type === 'movie' ? item.title : item.name}</p>
          <p class="text-gray-400 text-xs text-center mt-1 overflow-hidden">${type === 'movie' ? (item.release_date).split("-")[0] : (item.first_air_date).split("-")[0]}</p>
        </div>
      </a>
    </div>`;
  } else {
    document.querySelector('.empty').innerHTML = '<p>No similar movies found.</p>';
  }
});

// movie collection
const collections = movie.belongs_to_collection;
if (collections) {
  const collectsContain = document.querySelector('.js-movie-collections');
  document.querySelector('.js-sub-collections').innerText = 'Movie Collections';
  collectsContain.innerHTML = `
  <a href="collections.html?id=${collections.id}" class="inline-block size-fit">
    <div class="size-[8rem] mx-3">
      <img src="https://image.tmdb.org/t/p/w300/${collections.poster_path}">
      <p class="text-white text-sm text-center mt-2 overflow-hidden">${collections.name}</p>
    </div>
  </a>`
}

