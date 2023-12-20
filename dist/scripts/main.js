var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// Deklaration av DOM-element som kommer att användas senare i koden.
var solarSystem = document.querySelector('.solarsystem');
var closeButton = document.querySelector('.info--close');
var infoPage = document.querySelector('.infopage');
var starBackground = document.querySelector('.stars');
var infoPlanet = document.querySelector('.info-planet');
// Deklarerar huvud-URL:en för API-anrop och en variabel som kommer att hålla data om alla planeter.
var mainUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
var planetData;
// Asynkron funktion för att hämta en API-nyckel varje gång sidan laddas.
var getApiKey = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch("".concat(mainUrl, "/keys"), { method: 'POST' })];
            case 1:
                response = _a.sent();
                if (!response) {
                    throw new Error("Failed to fetch API key. Status: ".concat(response.status));
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data.key];
            case 3:
                error_1 = _a.sent();
                console.log(error_1.message);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Här hämtas datan ut från vår api samt anropar 2 funktioner för att gå vidare med datan
var getPlanetData = function (url, key) { return __awaiter(_this, void 0, void 0, function () {
    var response, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, fetch(url, {
                        method: 'GET',
                        headers: { 'x-zocom': key },
                    })];
            case 1:
                response = _a.sent();
                if (!response) {
                    throw new Error('Error fetching planets');
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [4 /*yield*/, planetObjectCreator(data)];
            case 3:
                // Skapar ett objekt med nödvändig information om varje planet och skapar sedan en DOM-element för varje planet
                planetData = _a.sent();
                createPlanets(planetData);
                return [2 /*return*/, planetData];
            case 4:
                error_2 = _a.sent();
                console.log('Error:', error_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// Funktion för att skapa upp ett objekt med endast den nödvändiga infon om alla planeter
var planetObjectCreator = function (data) {
    return data.bodies.map(function (planet) { return ({
        name: planet.name,
        latinName: planet.latinName,
        desc: planet.desc,
        night: "".concat(planet.temp.night, " \u00B0C"),
        day: "".concat(planet.temp.day, " \u00B0C"),
        circumference: "".concat(planet['circumference'].toLocaleString(), " km"),
        distance: "".concat(planet['distance'].toLocaleString(), " km"),
        moons: getUniqueMoons(planet.name, planet.moons),
    }); });
};
// Hjälp för att få unika värden från månarray
var getUniqueMoons = function (planetName, moons) {
    if (moons.length) {
        // Använder Set för att bara få ut unika värden
        var uniqueMoons = new Set(moons);
        return Array.from(uniqueMoons).join(', ');
    }
    else {
        return "".concat(planetName, " har inga m\u00E5nar.");
    }
};
// Funktion för att skapa upp planeterna
var createPlanets = function (planetData) {
    // forEach loop för att lägga in classList så att stylingen hoppar in
    planetData === null || planetData === void 0 ? void 0 : planetData.forEach(function (planet) {
        var planetElement = document.createElement('figure');
        planetElement.classList.add(planet.name.toLowerCase());
        solarSystem === null || solarSystem === void 0 ? void 0 : solarSystem.append(planetElement);
        // eventListener på varje planet för att kunna se mer info
        planetElement.addEventListener('click', function () {
            showInfo(planet);
        });
    });
};
// Funktion för att se information om vald planet
var showInfo = function (planet) {
    // Loop för att printa ut all info samt anropa funktion för att stylea infoPlaneten
    for (var key in planet) {
        if (planet.hasOwnProperty(key)) {
            var infoElement = document.querySelector(".".concat(key));
            infoElement.textContent = planet[key];
        }
    }
    // Anropa infoPlanetStyler här med planetens namn
    infoPlanetStyler(planet.name.toLowerCase());
    // För att visa infoboxen samt sätta en eventlistener på X-knappen så att man kan stänga ner
    infoPage.style.display = 'flex';
    closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener('click', hideInfo);
};
// infoplanet stylingfunktion
var infoPlanetStyler = function (planetName) {
    var planetElement = document.querySelector(".".concat(planetName));
    var computedPlanet = planetElement
        ? window.getComputedStyle(planetElement)
        : null;
    var hasBefore = computedPlanet
        ? window.getComputedStyle(planetElement, ':before').getPropertyValue('content') !==
            'none'
        : false;
    var backgroundColor = computedPlanet === null || computedPlanet === void 0 ? void 0 : computedPlanet.backgroundColor;
    if (backgroundColor) {
        // Extrahera RGB-värden från bakgrundsfärgen
        var rgbValues = backgroundColor.match(/\d+/g);
        var rgbString = rgbValues ? rgbValues.join(', ') : '';
        // Kontrollerar om elementet har :before för att visa ring runt planet
        var infoPlanetRing = document.querySelector('.info-planet--ring');
        infoPlanetRing.style.display = hasBefore ? 'block' : 'none';
        // Här sätts färgen
        infoPlanet.style.backgroundColor = backgroundColor;
        infoPlanet.style.boxShadow = "0px 0px 0px 40px rgba(".concat(rgbString, ", 0.1), 0px 0px 0px 80px rgba(").concat(rgbString, ", 0.06)");
    }
};
// Snabb funktion för att toggla bort planetinfon
var hideInfo = function () {
    infoPage.style.display = 'none';
};
// Funktion för att loppa ut sjärnor på randompositioner samt olika storlekar
var createStars = function () {
    for (var i = 0; i < 100; i++) {
        var star = document.createElement('figure');
        // För att få med stylingen samt animationen så läggs klassnamn till
        star.className = 'star';
        // Här slumpas positionerna för varje separat stjärna
        star.style.top = "".concat(Math.random() * 100, "%");
        star.style.left = "".concat(Math.random() * 100, "%");
        // Här randomizas storlek på stjärnorna mellan .1 - .5 rem samt hur lång animationDelay ska vara.
        star.style.width = "".concat(Math.random() * (0.5 - 0.1) + 0.1, "rem");
        star.style.animationDelay = "".concat((Math.random() * 9 + 1).toFixed(2), "s");
        starBackground === null || starBackground === void 0 ? void 0 : starBackground.append(star);
    }
};
// En IIFE (Immediately Invoked Function Expression) som körs direkt när sidan laddas.
// Denna funktion är asynkron för att tillåta användning av 'await' för att hantera de asynkrona funktionsanropen i ordning.
// Användning av IIFE hjälper till att skydda API-nyckeln från att hittas i konsolen.
(function () { return __awaiter(_this, void 0, void 0, function () {
    var apiKey, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, getApiKey()];
            case 1:
                apiKey = _a.sent();
                return [4 /*yield*/, getPlanetData("".concat(mainUrl, "/bodies"), apiKey || '')];
            case 2:
                planetData = _a.sent();
                createStars();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.log('Problem to run the IIFE');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })();
