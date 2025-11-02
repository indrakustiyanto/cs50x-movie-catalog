import { initNav } from "./nav.js";
import axios from "axios";


// init nav
initNav();

// fetching main data faq
async function getFAQ() {
  const response = await axios.get('https://cs50x-movie-catalog-production.up.railway.app/get/faq');
  console.log(response.data);
  return response.data;
}

// render faq capsule
// global var
const mainData = await getFAQ();
const container = document.getElementById('js-faq-container');
container.innerHTML = ''
mainData.forEach( (data) => {
  container.innerHTML += `
  <div class="js-trigger w-full  px-4 py-2.5 border border-white/75 rounded-4xl">
    <div class="w-full flex justify-between">
      <p class="text-xl">${data.question}</p>
      <p>&#9662;</p>
    </div>
    <p class="js-target hidden text-sm text-white/70 mt-4">${data.answer}</p>
  </div>`
});

// faq capsule functionality
const triger = document.querySelectorAll('.js-trigger');
triger.forEach( (capsule) => {
  capsule.addEventListener('click', function() {
    const target = this.querySelector('.js-target');
    target.classList.toggle('hidden');
  })
})