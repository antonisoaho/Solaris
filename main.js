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

//Funktion för att skapa upp planeterna med hjälp av datan hämtad
const createPlanets = async (url, key) => {
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

    //forEach loop för att loopa ut varje planet samt sätta en eventListener på för att kunna se mer info
    planetData.forEach((planet) => {
      const planetElement = document.createElement('figure');
      planetElement.classList.add(planet.name.toLowerCase());
      solarSystem.append(planetElement);

      planetElement.addEventListener('click', () => {
        showInfo(planet);
      });
    });

    return planetData;
  } catch (error) {
    console.log('Error:', error);
  }
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
      console.log(`${key}: ${planet[key]}`);
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

// IIFE funktion för att köra asynkrona funktioner direkt när hemsidan laddas
// Denna används även för att inte kunna hitta api-keyn i consolen när sidan är upp and running
(async () => {
  try {
    const apiKey = await getApiKey();
    planetData = await createPlanets(`${mainUrl}/bodies`, apiKey);
  } catch (error) {
    console.log('Problem to run the IIFE');
  }
})();
