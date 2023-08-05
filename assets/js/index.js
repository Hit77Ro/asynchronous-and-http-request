import LazyLoader from "./lazyloader";
"use strict";
const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");



const render = function (data, className = "") {
  const html = `
  <article class="country ${className}">
    <div class="img">
    <img  loading="lazy" class="country__img lazy" data-src="${
      data.flags.png
    }" />
    </div>
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🌐</span>${data.fifa}</p>
    </div>
    </article>
    `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;

  // selecting element after they are on the page ,then observing them

  const lazyLoader = new LazyLoader();
  document
    .querySelectorAll("img[data-src]")
    .forEach((el) => lazyLoader.observe(el));
};

// creating an http request that will be made after a previous http request if succeded
function getJson(url, msg) {
  return fetch(url).then((response) => {
    // throwin error if server can't find the country (404)
    if (!response.ok) throw new Error(`${msg} : ${response.status}`);
    return response.json();
  });
}

// Note : any error that happen in any (then)  will immediatly terminate this then ,an will propagate to catch method to handle that error
function getData(name) {
  getJson(
    `https://restcountries.com/v3.1/name/${name}`,
    "country couldn't be found"
  )
    .then((data) => {
      const [infos] = data;
      render(infos);

      // const [neighbor] = infos.borders;

      // no nieghbor the then function not gonna return  ; it will  return the resut of getJson()  ;
      // to fix that we shoud throw an error to terminate immediatly the then  function (rejected) => error will be catched by Catch method
      // if (!neighbor) return; // for reference

      if (!infos.borders) throw new Error("the country has no neighbors");

      return getJson(
        `https://restcountries.com/v3.1/alpha/${neighbor}`,
        "the given neighbor was not  found "
      );
    }) // Add this to handle the second fetch result
    .then(([data]) => render(data))
    .catch(({ message }) => {
      console.log(`Something went wrong 💥💥 ${message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
      spin(false);
    });
}

// getData("morocco");

btn.addEventListener("click", () => {
  spin(true);
  getData("australia");
});

function spin(show) {
  if (show) {
    document.querySelector(".over").classList.add("show");
    return;
  }

  document.querySelector(".over").classList.remove("show");
}
