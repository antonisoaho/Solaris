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

//Funktion för att hämta ut data om planeterna samt spara i en variabel
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
    planetData = data.bodies;
    createPlanets(planetData);
    return data.bodies;
  } catch (error) {
    console.log('Error:', error);
  }
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
  for (let key in planet) {
    if (planet.hasOwnProperty(key)) {
      const element = document.querySelector(`.${key}`);

      if (key === 'temp') {
        //Kontrollerar om nyckeln är temp och går därför djupare i objektet för att få ut rätt typ
        for (let type in planet[key]) {
          const tempElement = document.querySelector(`.temp-${type}`);
          if (tempElement !== null) {
            tempElement.textContent = `${planet[key][type]} °C`;
          }
        }
      } else if (key === 'moons' && Array.isArray(planet[key])) {
        //Kollar om det är flera månar och printar därför ut lite snyggare
        const moonString = planet[key].join(', ');
        element.textContent = moonString;
      } else if (element !== null) {
        // Kontrollerar om det går att använda toLocaleString() innan det används
        const formattedValue =
          typeof planet[key] === 'number'
            ? planet[key].toLocaleString()
            : planet[key];
        // Lägger in den formatterade strängen och kikar om det behöver läggas in ' km' i slutet
        element.textContent =
          formattedValue +
          (key === 'distance' || key === 'circumference' ? ' km' : '');
      }
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
    star.style.animationDelay = `${(Math.random() * 14 + 1).toFixed(2)}s`;

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
