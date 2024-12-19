const apiKEY = "27eedd9e3f839130d3c83e4b0ed69202";
const apiENDPOINT = "api.openweathermap.org"

const query = document.getElementById("query");
const resultbox = document.getElementById("results");
const searchButton = document.getElementById("querySearch");
let iterat = 0;
/**
 * @description takes parameter limit. This displays "limit" number of locations related to the value in the search box. 
 *              Will eventually link to result page with relevant php info.
 * 
 * @param {*} limit the number of related searches that populate upon typing
 */

function getSearchResults(limit)
{
    //const search = document.getElementById("query");
    const val = query.value;
    
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=${limit}&appid=${apiKEY}`)
    .then(res => res.json())
    .then(data => {
        displayResult(data);
      
    })
    .catch(error => console.error(error));
}

/**
 * @description displays the search results of the getSearchResults() method. result is turned into an array that is filtered based on country(US).
 * 
 * @param {*} result The json list of relevant search items from the api response.
 */

function displayResult(result) {
    //var iterat = 0;

    var content = [];

    for(element in result)
    {
        if(result[element].country.toLowerCase() == "us")            //matching US country code
        {
            iterat++;
            const resultHTML =  "<li id=\"" + `item${iterat}` + "\" onclick= \"setAPICall(" + 
                                `${result[element].lon}, ${result[element].lat}` + 
                                ")\"><button>" + result[element].name + ", " + result[element].state + " </button></li>";
            content.push(resultHTML);
        }
        else
        {
            continue;
        }
    }

    //idea: could grab result boxes by class in order to generalize the function
    //will make the results show in two result boxes, one is hidden at a given time though
    if(content.length > 0)
    {
        resultbox.innerHTML = "<ul>" + content.join("") + "</ul>";
    }
    else
        resultbox.innerHTML = "";
}

/**
 * @description grabs the information for the API call from within displayResult(). Will be used when selecting one of the search results to display.
 * @requires function displayResult()
 */
function setAPICall(lon, lat)
{
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKEY}&units=imperial`)
    .then(res => res.json())
    .then(data => {
        //console.log(data);
        onSearch();
        updateWeatherDetails(data);
        loadWeatherRadar(lon, lat);
        fetchAQIData(lat, lon);
        loadHourlyWeather(lat, lon)
      
    })
    .catch(error => console.error(error));
}

function updateWeatherDetails(data) {
    const locationName = document.getElementById("location-name");
    const temperature = document.getElementById("temperature");
    const feelsLike = document.getElementById("feels-like");
    const wind = document.getElementById("wind");
    const rainChance = document.getElementById("rain-chance");
    const humidity = document.getElementById("humidity");
    const pressure = document.getElementById("pressure");

    locationName.innerText = `Location: ${data.name}`;
    temperature.innerText = `Temperature: ${data.main.temp}°F`;
    feelsLike.innerText = `Feels Like: ${data.main.feels_like}°F`;
    wind.innerText = `Wind Speed: ${data.wind.speed} mph`;
    rainChance.innerText = `Rain Chance: ${data.rain ? data.rain['1h'] + '%' : 'No rain forecasted'}`;
    humidity.innerText = `Humidity: ${data.main.humidity}%`;
}

function loadWeatherRadar(lon,lat) {
    const layer = "precipitation_new";
    const iframe = document.getElementById("weatherRadarFrame");
    iframe.src = `${apiENDPOINT}/weathermap?basemap=map&cities=true&layer=${layer}&lat=${lat}&lon=${lon}&zoom=8&appid=${apiKEY}`;

}
/**
 * @description using the longitude and latitude given by setAPICall(), this fetches the air quality index.
 * 
 * @param {*} lat latitude of the location.
 * @param {*} lon longitude of the location.
 */
function fetchAQIData(lat, lon){
    fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKEY}`)
        .then(res => res.json())
        .then(aqiData => {
            const aqi = document.getElementById("AQI");
            aqi.innerText = `AQI: ${aqiData.list[0].main.aqi}, ${AQIRelativeTerm(aqiData.list[0].main.aqi)}`;
        })
        .catch(error => console.error('Error fetching AQI data:', error));AnalyserNode
}

function onSearch() {
    const homeElements = document.getElementsByClassName("home");
    const resultElements = document.getElementsByClassName("result-weather");

    // Hide all elements with class 'home'
    Array.from(homeElements).forEach(element => {
        if (element) element.style.display = 'none';
    });

    // Display all elements with class 'result-weather'
    Array.from(resultElements).forEach(element => {
        if (element) element.style.display = 'block';
    });
}

/**
 * @description Will do API call and displays hourly weather data for the location. Currently only 5 hours forecast.
 */
function loadHourlyWeather(lat, lon) {
    fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${apiKEY}&cnt=5`)
    .then(res => res.json())
    .then(data => {
        var content = [];
        var forecastArr = [];
        const forDisplay = document.getElementById("forecastDisplay");
        content = data.list;
        for(element in content)
        {
            const currElem = content[element];
            console.log(content[element]);
            const foreCastCard =`   <div class="card col-1">
                                    <div class="card-body"><img src="/static/images/fill/all/clear-day.svg" alt="clear day"></div>
                                    <div class="card-body">${currElem.weather[0].description}</div></div>`;
            forecastArr.push(foreCastCard);
        }
        forDisplay.innerHTML = forecastArr.join("");
      
    })
    .catch(error => console.error(error));
}

function getWeatherIcon (weatherID) {

}

/**
 * @description Will do API call and displays weekly weather data for the location.
 */
function loadWeeklyWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${apiKEY}`)
    .then(res => res.json())
    .then(data => {
        
      
    })
    .catch(error => console.error(error));
}

const pyCity = document.getElementById("pyCity");

function pyLoadHourly(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city.value}&limit=1&appid=${apiKEY}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
      
    })
    .catch(error => console.error(error));
}

// searchButton.addEventListener('click', function() {
//     getSearchResults(5);
//     onSearch();
// }, false);

// query.addEventListener('keyup', function() {
//     getSearchResults(5);
// }, false);

pyLoadHourly(pyCity);