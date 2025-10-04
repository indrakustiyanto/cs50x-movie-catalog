import axios from 'axios';

export function initNav() {
  // *** NAV FUNCTIONALITY ***

  // active nav link tab
  // toggle active nav link
  const activeTab = document.querySelectorAll('.js-nav-link-item a');
  const activated = document.querySelector(".js-active")
  activeTab.forEach(tab => {
    tab.addEventListener("click", function() {
      activeTab.forEach(tabs => tabs.classList.remove("js-active"));
      this.classList.add("js-active");
      activated.classList.add("b")
    })
  })

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
      console.log(result)
      
      // display results in dropdown
      dropdown.classList.remove('hidden');
      dropdown.innerHTML  = '';

      result.forEach(movie => {
        dropdown.innerHTML += `
        <a href="detailed.html?id=${movie.id}&type=${movie.media_type}">
          <div class="flex flex-row gap-[1rem] p-2 border-b border-white hover:bg-[#FFFFFF1A] cursor-pointer justify-start items-center">
            <img src="https://image.tmdb.org/t/p/w92/${movie.poster_path}" alt="${movie.title ? movie.title : movie.original_name}" class="w-[2rem] h-[3rem] object-cover mx-auto mb-1 border ">
            <p class="flex-1 text-white text-sm">${movie.title ? movie.title : movie.original_name}</p>
          </div>
        </a>
        `
      })
    }
    catch (error) {
      console.error(error);
      dropdown.classList.add('hidden');
      dropdown.innerHTML = '';
    }
  });
}