
const apiKEY = "27eedd9e3f839130d3c83e4b0ed69202";
let iterat = 0;


function pyLoadHourly(city, lat, lon) {
    fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${apiKEY}&cnt=12&units=imperial`)
    .then(res => res.json())
    .then(data => {
        var content = [];
        var hourlyArr = [];
        const hourlyDisplay = document.getElementById('hourly-view')
        content = data.list;
        setMinMax(content[0].main);
        fetchAQIData(lat, lon);
        for(element in content)
        {
            const currElem = content[element];
            console.log(currElem)
            let elemUnix = timeConverter(currElem.dt);
            //just have the hour and the AM/PM
            elemUnix = elemUnix.slice(0, elemUnix.length - 6) + elemUnix.slice(elemUnix.length - 3, elemUnix.length);
            iterat++; 
            //console.log(currElem.sys.pod);
            const foreCastCard =`   <div class="card col-1">
                                        <div class="card-body">${setWeatherIconOW(currElem.weather[0].id, currElem.sys.pod)}</img></div>
                                        <div class="card-body">${elemUnix}</div>
                                        <div class="card-body">${Math.round(currElem.main.temp)}°F</div>
                                    </div>`;
            hourlyArr.push(foreCastCard);
        }
        hourlyDisplay.innerHTML = hourlyArr.join(""); 
    })
    .catch(error => console.error(error));
}

function setMinMax(main)
{
    const minMax = document.getElementById('min-max-temp')

    minMax.innerHTML = `Low: ${Math.round(main.temp_min)}°F \tHi: ${Math.round(main.temp_max)}°F`

}

function setWeatherIconOW (weatherID, POD) {
    const code = Math.trunc(weatherID / 100);
    switch(code)
    {
        case 2:
            if(POD == "d")
                return `<img src="/static/images/fill/all/thunderstorms-rain.svg">`;
            else
            return `<img src="/static/images/fill/all/thunderstorms-night-rain.svg">`;
        case 3:
            return `<img src="/static/images/fill/all/drizzle.svg">`;
        case 5:
            return `<img src="/static/images/fill/all/rain.svg">`;
        case 6:
            return `<img src="/static/images/fill/all/snow.svg">`;
        case 7:
            switch(weatherID)
            {
                case 701:
                    return `<img src="/static/images/fill/all/mist.svg">`;
                case 711:
                    return `<img src="/static/images/fill/all/smoke.svg">`;
                case 721:
                    if(POD == "d") 
                        return `<img src="/static/images/fill/all/haze-day.svg">`;
                    else
                    return `<img src="/static/images/fill/all/haze-night.svg">`;
                case 731:
                    if(POD == "d")
                        return `<img src="/static/images/fill/all/dust-day.svg">`;
                    else
                    return `<img src="/static/images/fill/all/dust-night.svg">`;
                case 741:
                    if(POD == "d")
                        return `<img src="/static/images/fill/all/fog-day.svg">`;
                    else
                        return `<img src="/static/images/fill/all/fog-night.svg">`;
                case 781:
                    return `<img src="/static/images/fill/all/tornado.svg">`;
                default:
                    return `<img src="/static/images/fill/all/mist.svg">`;
            }
        case 8:
            switch(weatherID)
            {
                case 800:
                    if(POD == "d")
                        return `<img src="/static/images/fill/all/clear-day.svg">`;
                    else
                        return `<img src="/static/images/fill/all/clear-night.svg">`;
                case 801:
                case 802:
                    if(POD == "d")
                        return `<img src="/static/images/fill/all/partly-cloudy-day.svg">`;
                    else
                        return `<img src="/static/images/fill/all/partly-cloudy-night.svg">`;
                case 803:
                case 804:
                    return `<img src="/static/images/fill/all/cloudy.svg">`;

            }
            
        default:
            return "no image available";
    }
}

function setWeatherIconMeteo(imgEl, wcode, is_day)
{
    switch (wcode) {
        case 1:
        case 2:
        case 3:
            if (is_day == 0) {
                imgEl.src = '/static/images/fill/darksky/clear-night.svg';
            }
            else {
                imgEl.src = '/static/images/fill/darksky/clear-day.svg';
            }
            break;
        case 45:
        case 48:
            imgEl.src = '/static/images/fill/darksky/fog.svg';
            break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
            imgEl.src = '/static/images/fill/darksky/drizzle.svg';
            break;
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
            imgEl.src = '/static/images/fill/darksky/rain.svg';
            break;
        case 71:
        case 73:
        case 75:
        case 77:
            imgEl.src = '/static/images/fill/darksky/snow.svg';
            break;
        default:
            imgEl.src = '/static/images/fill/darksky/clear-day.svg';
    }
}

document.addEventListener('DOMContentLoaded', function() {

    // var tempEl = document.getElementById('today-temp');
    var codeEl= document.getElementById('today-code');
    var isDayEl= document.getElementById('isDay');

    // var temp = parseFloat(tempEl.textContent.trim());
    var wcode = parseInt(codeEl.textContent.trim());
    var is_day= parseInt(isDayEl.textContent.trim());

    // console.log(temp);
    console.log(wcode);
    console.log(is_day);

    var todayIMG= document.getElementById('image');
    const cityName = document.getElementById('pyCity');
    const lat = document.getElementById('latitude').textContent;
    const lon = document.getElementById('longitude').textContent;

    setWeatherIconMeteo(todayIMG, wcode, is_day);
    
    pyLoadHourly(cityName, lat, lon);
}, "false");

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var time = a.toLocaleTimeString('en-US', {timeStyle: "short"});
    return time;
  }

  function fetchAQIData(lat, lon){
    fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKEY}`)
        .then(res => res.json())
        .then(aqiData => {
            const aqi = document.getElementById("AQI");
            aqi.innerText = `AQI: ${aqiData.list[0].main.aqi}, ${AQIRelativeTerm(aqiData.list[0].main.aqi)}`;
        })
        .catch(error => console.error('Error fetching AQI data:', error));AnalyserNode
}

/**
 * @description takes the AQI number as an input and outputs a qualitative name for that level of air quality
 * @link https://openweathermap.org/api/air-pollution
 */
function AQIRelativeTerm (AQIlevel){
    switch(AQIlevel)
    {
        case 1:
            return "Good";
        case 2:
            return "Fair";
        case 3:
            return "Moderate";
        case 4:
            return "Poor";
        case 5:
            return "Very Poor";
        default:
            return "";
    }
}
