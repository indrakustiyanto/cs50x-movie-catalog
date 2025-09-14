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