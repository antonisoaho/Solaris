// Deklarerande av DOM-element som kommer att användas senare i koden.
const solarSystem = document.querySelector('.solarsystem');
const closeButton = document.querySelector('.info--close');
const infoPage = document.querySelector('.infopage');
const starBackground = document.querySelector('.stars');
const infoPlanet = document.querySelector('.info-planet');

//Deklarerar huvud-URL:en för API-anrop och en variabel som kommer att hålla data om alla planeter.
const mainUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
let planetData;

//Asynkron funktion för att hämta en API-nyckel varje gång sidan laddas.
const getApiKey = async () => {
  try {
    const response = await fetch(`${mainUrl}/keys`, { method: 'POST' });

    if (!response) {
      throw new Error(`Failed to fetch API key. Status: ${response.status}`);
    }
    const data = await response.json();

    return data.key;
  } catch (error) {
    console.log(error.message);
  }
};

// Här hämtas datan ut från vår api samt anropar 2 funktioner för att gå vidare med datan
const getPlanetData = async (url, key) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'x-zocom': key },
    });

    if (!response) {
      throw new Error('Error fetching planets');
    }
    data = await response.json();

    // Skapar ett objekt med nödvändig information om varje planet och skapar sedan en DOM-element för varje planet
    planetData = await planetObjectCreator(data);
    createPlanets(planetData);

    return planetData;
  } catch (error) {
    console.log('Error:', error);
  }
};

// Funktion för att skapa upp ett objekt med endast den nödvändiga infon om alla planeter
const planetObjectCreator = (data) => {
  return data.bodies.map((planet) => ({
    name: planet.name,
    latinName: planet.latinName,
    desc: planet.desc,
    night: `${planet.temp.night} °C`,
    day: `${planet.temp.day} °C`,
    circumference: `${planet['circumference'].toLocaleString()} km`,
    distance: `${planet['distance'].toLocaleString()} km`,
    moons: getUniqueMoons(planet.name, planet.moons),
  }));
};

// Hjälp för att få unika värden från månarray
const getUniqueMoons = (planetName, moons) => {
  if (moons.length) {
    // Använder Set för att bara få ut unika värden
    const uniqueMoons = new Set(moons);

    return Array.from(uniqueMoons).join(', ');
  } else {
    return `${planetName} har inga månar.`;
  }
};

// Funktion för att skapa upp planeterna
const createPlanets = (planetData) => {
  //forEach loop för att lägga in classList så att stylingen hoppar in
  planetData.forEach((planet) => {
    const planetElement = document.createElement('figure');
    planetElement.classList.add(planet.name.toLowerCase());
    solarSystem.append(planetElement);

    //eventListener på varje planet för att kunna se mer info
    planetElement.addEventListener('click', () => {
      showInfo(planet);
    });
  });
};

// Funktion för att se information om vald planet
const showInfo = (planet) => {
  // Loop för att printa ut all info samt anropa funktion för att stylea infoPlaneten
  for (let key in planet) {
    if (planet.hasOwnProperty(key)) {
      const infoElement = document.querySelector(`.${key}`);
      infoElement.textContent = planet[key];
    }
  }
  // Anropa infoPlanetStyler här med planetens namn
  infoPlanetStyler(planet.name.toLowerCase());
  // För att visa infoboxen samt sätta en eventlistener på X-knappen så att man kan stänga ner
  infoPage.style.display = 'flex';
  closeButton.addEventListener('click', hideInfo);
};

// infoplanet stylingfunktion
const infoPlanetStyler = (planetName) => {
  const planetElement = document.querySelector(`.${planetName}`);

  const computedPlanet = window.getComputedStyle(planetElement);
  const hasBefore =
    window
      .getComputedStyle(planetElement, ':before')
      .getPropertyValue('content') !== 'none';

  const backgroundColor = computedPlanet.backgroundColor;

  // Extrahera RGB-värden från bakgrundsfärgen
  const rgbValues = backgroundColor.match(/\d+/g);
  const rgbString = rgbValues.join(', ');

  // Kontrollerar om elementet har :before för att visa ring runt planet
  const infoPlanetRing = document.querySelector('.info-planet--ring');
  infoPlanetRing.style.display = hasBefore ? 'block' : 'none';

  // Här sätts färgen
  infoPlanet.style.backgroundColor = backgroundColor;
  infoPlanet.style.boxShadow = `0px 0px 0px 40px rgba(${rgbString}, 0.1), 0px 0px 0px 80px rgba(${rgbString}, 0.06)`;
};

// Snabb funktion för att toggla bort planetinfon
const hideInfo = () => {
  infoPage.style.display = 'none';
};

// Funktion för att loppa ut sjärnor på randompositioner samt olika storlekar
const createStars = () => {
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('figure');
    //För att få med stylingen samt animationen så läggs klassnamn till
    star.className = 'star';

    // Här slumpas positionerna för varje separat stjärna
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;

    //Här randomizas storlek på stjärnorna mellan .1 - .5 rem samt hur lång animationDelay ska vara.
    star.style.width = `${Math.random() * (0.5 - 0.1) + 0.1}rem`;
    star.style.animationDelay = `${(Math.random() * 9 + 1).toFixed(2)}s`;

    starBackground.append(star);
  }
};

// En IIFE (Immediately Invoked Function Expression) som körs direkt när sidan laddas.
// Denna funktion är asynkron för att tillåta användning av 'await' för att hantera de asynkrona funktionsanropen i ordning.
// Användning av IIFE hjälper till att skydda API-nyckeln från att hittas i konsolen.
(async () => {
  try {
    const apiKey = await getApiKey();
    planetData = await getPlanetData(`${mainUrl}/bodies`, apiKey);
    createStars();
  } catch (error) {
    console.log('Problem to run the IIFE');
  }
})();
