// Deklarerande av DOM-element
const solarSystem = document.querySelector('.solarsystem');
const closeButton = document.querySelector('.info--close');
const infoPage = document.querySelector('.infopage');
const starBackground = document.querySelector('.stars');

//Variabel för att säkra mainUrlen samt deklarera att vi har en variabel med alla planeter
const mainUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
let planetData;

//Funktion för att hämta ut en apiKey vid start av sidan varje gång.
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

    //Uppskapning av objekt & uppskapning av planeterna på DOM
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
    moons:
      planet.moons.length > 0
        ? Array.isArray(planet.moons)
          ? planet.moons.join(', ')
          : planet.moons
        : `${planet.name} har inga månar.`,
  }));
};

// Funktion för  att skapa upp planeterna
const createPlanets = (planetData) => {
  //forEach loop för att lägga in classList så att stylingen hoppar in
  planetData.forEach((planet) => {
    const planetElement = document.createElement('figure');
    planetElement.classList.add(planet.name.toLowerCase());
    solarSystem.append(planetElement);

    //eventListener på varje element för att kunna se mer info
    planetElement.addEventListener('click', () => {
      showInfo(planet);
    });
  });
};

// Funktion för att se information om vald planet
const showInfo = (planet) => {
  // Loop för att printa ut all info - se om jag kunde
  for (let key in planet) {
    if (planet.hasOwnProperty(key)) {
      const infoElement = document.querySelector(`.${key}`);
      infoElement.textContent = planet[key];
    }
  }

  // För att visa infoboxen samt sätta en eventlistener på X-knappen så att man kan stänga ner
  infoPage.style.display = 'flex';
  closeButton.addEventListener('click', hideInfo);
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
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;

    //Här randomizas storlek på stjärnorna mellan .1 - .5 rem samt hur lång animationDelay ska vara.
    star.style.width = `${Math.random() * (0.5 - 0.1) + 0.1}rem`;
    star.style.animationDelay = `${(Math.random() * 9 + 1).toFixed(2)}s`;

    starBackground.append(star);
  }
};

// IIFE/IAFE (Immediately invoked async function expression) funktion för att köra asynkrona funktioner direkt när hemsidan laddas
// Denna används även för att inte kunna hitta api-keyn i consolen när sidan är up and running
(async () => {
  try {
    const apiKey = await getApiKey();
    planetData = await getPlanetData(`${mainUrl}/bodies`, apiKey);
    createStars();
  } catch (error) {
    console.log('Problem to run the IIFE');
  }
})();
