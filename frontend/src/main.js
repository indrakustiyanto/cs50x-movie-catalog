const show = document.querySelector('.show');

async function searchMovies() {
  const query = document.getElementById('search').value;
  const response = await axios.get(`http://127.0.0.1:5000/search?q=${query}`)
  const movies = response.data.results;
  console.log(movies);

  const results = document.getElementById('results');
results.innerHTML = '';

movies.forEach(movie => {
  const movieCard = `
          <div class="bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform">
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="w-full h-96 object-cover">
            <div class="p-4">
              <h3 class="text-xl font-bold mb-2">${movie.title} 
                <span class="text-gray-400 text-sm">(${movie.release_date?.split("-")[0] || "N/A"})</span>
              </h3>
              <p class="text-sm text-gray-300 mb-2"><b>⭐ ${movie.vote_average}</b> (${movie.vote_count} votes)</p>
              <p class="text-gray-400 text-sm">${movie.overview ? movie.overview.substring(0, 100) + "..." : "No description available."}</p>
            </div>
          </div>
        `;
        results.innerHTML += movieCard;
  })
};

document.getElementById('searchBtn').addEventListener('click', searchMovies);

