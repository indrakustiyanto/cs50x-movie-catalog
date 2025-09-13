// function to fetch trending movies and display the backdrop of the first movie and poster

async function fetchTrending() {
  const response = await axios.get('http://127.0.0.1:5000/')
  const index = response.data.results;
  console.log(index);

  const target = document.querySelector('.poster-container');

  target.innerHTML = '';
  
  const moviebackdrop = `
  
    <img src="https://image.tmdb.org/t/p/original/${index[0].backdrop_path}" alt="${index[0].title}" class="w-screen h-screen object-cover brightness-50">`

  target.innerHTML += moviebackdrop;
}

fetchTrending();

// NAV FUNCTIONALITY
// Search Icon Click
const searchIcon = document.querySelector('.js-search-icon');
const searchBar = document.querySelector('.js-search');
let condition = false;

// searchIcon.addEventListener('click', () => {
//   if (condition === false) {
//     document.querySelector('.js-nav-center').innerHTML = `
//       <input type="text" placeholder="Search for a movie..." name="search" id="search" autocomplete="off" class="w-max h-[2.5rem] rounded-full text-white text-center border border-white px-2 py-1 transition duration-300 ease-in-out">`
//   }
//   else {
//     document.querySelector('.js-nav-center').innerHTML = `
//     <ul class="flex items-center justify-center gap-[2rem] w-max h-full text-[1rem] font-semibold">
//       <li class="flex items-center justify-center h-full w-max">
//         <a href="#" class="relative pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0
//         after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:transition after:duration-300
//         hover:after:scale-x-100 hover:after:[box-shadow:0_0_12px_#ffffff,0_0_24px_#ffffff]">Home</a>
//       </li>
//       <li class="flex items-center justify-center h-full">
//         <a href="#" class="relative pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0
//         after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:transition after:duration-300
//         hover:after:scale-x-100 hover:after:[box-shadow:0_0_12px_#ffffff,0_0_24px_#ffffff]">Movies</a>
//       </li>
//       <li class="flex items-center justify-center h-full">
//         <a href="#" class="relative pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0
//         after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:transition after:duration-300
//         hover:after:scale-x-100 hover:after:[box-shadow:0_0_12px_#ffffff,0_0_24px_#ffffff]">Series</a>
//       </li>
//       <li class="flex items-center justify-center h-full">
//         <a href="#" class="relative pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0
//         after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:transition after:duration-300
//         hover:after:scale-x-100 hover:after:[box-shadow:0_0_12px_#ffffff,0_0_24px_#ffffff]">Collections</a>
//       </li>
//       <li class="flex items-center justify-center h-full">
//         <a href="#" class="relative pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0
//         after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:transition after:duration-300
//         hover:after:scale-x-100 hover:after:[box-shadow:0_0_12px_#ffffff,0_0_24px_#ffffff]">FAQ</a>
//       </li>
//     </ul>`
//   };

//   condition = !condition;
//   console.log(condition);
// });

searchIcon.addEventListener('click', () => {
  if (condition === false) {
    searchBar.innerHTML = `
      <input type="text" placeholder="Search for a movie..." name="search" id="search" autocomplete="off" class="w-max h-[2.5rem] rounded-full text-white text-center border border-white px-2 py-1 transition duration-100 ease-in-out focus:outline-none text-sm">`
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