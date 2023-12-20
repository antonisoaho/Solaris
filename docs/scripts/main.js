var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const solarSystem = document.querySelector('.solarsystem');
const closeButton = document.querySelector('.info--close');
const infoPage = document.querySelector('.infopage');
const starBackground = document.querySelector('.stars');
const infoPlanet = document.querySelector('.info-planet');
const mainUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
let planetData;
const getApiKey = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${mainUrl}/keys`, { method: 'POST' });
        if (!response) {
            throw new Error(`Failed to fetch API key. Status: ${response.status}`);
        }
        const data = yield response.json();
        return data.key;
    }
    catch (error) {
        console.log(error.message);
    }
});
const getPlanetData = (url, key) => __awaiter(this, void 0, void 0, function* () {
    try {
        const response = yield fetch(url, {
            method: 'GET',
            headers: { 'x-zocom': key },
        });
        if (!response) {
            throw new Error('Error fetching planets');
        }
        const data = yield response.json();
        planetData = yield planetObjectCreator(data);
        createPlanets(planetData);
        return planetData;
    }
    catch (error) {
        console.log('Error:', error);
    }
});
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
const getUniqueMoons = (planetName, moons) => {
    if (moons.length) {
        const uniqueMoons = new Set(moons);
        return Array.from(uniqueMoons).join(', ');
    }
    else {
        return `${planetName} har inga månar.`;
    }
};
const createPlanets = (planetData) => {
    planetData === null || planetData === void 0 ? void 0 : planetData.forEach((planet) => {
        const planetElement = document.createElement('figure');
        planetElement.classList.add(planet.name.toLowerCase());
        solarSystem === null || solarSystem === void 0 ? void 0 : solarSystem.append(planetElement);
        planetElement.addEventListener('click', () => {
            showInfo(planet);
        });
    });
};
const showInfo = (planet) => {
    for (let key in planet) {
        if (planet.hasOwnProperty(key)) {
            const infoElement = document.querySelector(`.${key}`);
            infoElement.textContent = planet[key];
        }
    }
    infoPlanetStyler(planet.name.toLowerCase());
    infoPage.style.display = 'flex';
    closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener('click', hideInfo);
};
const infoPlanetStyler = (planetName) => {
    const planetElement = document.querySelector(`.${planetName}`);
    const computedPlanet = planetElement
        ? window.getComputedStyle(planetElement)
        : null;
    const hasBefore = computedPlanet
        ? window.getComputedStyle(planetElement, ':before').getPropertyValue('content') !==
            'none'
        : false;
    const backgroundColor = computedPlanet === null || computedPlanet === void 0 ? void 0 : computedPlanet.backgroundColor;
    if (backgroundColor) {
        const rgbValues = backgroundColor.match(/\d+/g);
        const rgbString = rgbValues ? rgbValues.join(', ') : '';
        const infoPlanetRing = document.querySelector('.info-planet--ring');
        infoPlanetRing.style.display = hasBefore ? 'block' : 'none';
        infoPlanet.style.backgroundColor = backgroundColor;
        infoPlanet.style.boxShadow = `0px 0px 0px 40px rgba(${rgbString}, 0.1), 0px 0px 0px 80px rgba(${rgbString}, 0.06)`;
    }
};
const hideInfo = () => {
    infoPage.style.display = 'none';
};
const createStars = () => {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('figure');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * (0.5 - 0.1) + 0.1}rem`;
        star.style.animationDelay = `${(Math.random() * 9 + 1).toFixed(2)}s`;
        starBackground === null || starBackground === void 0 ? void 0 : starBackground.append(star);
    }
};
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        const apiKey = yield getApiKey();
        planetData = yield getPlanetData(`${mainUrl}/bodies`, apiKey || '');
        createStars();
    }
    catch (error) {
        console.log('Problem to run the IIFE');
    }
}))();
