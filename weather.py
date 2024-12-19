import requests
import sys
from geopy import geocoders
from config import API_WEATHER_URL, GEO_CODE
from location import get_current_location
from datetime import datetime as dt
from flask import (
    Blueprint, render_template, request, url_for
)

gn = geocoders.GeoNames(username=GEO_CODE)
bp = Blueprint('weather', __name__, url_prefix='/weather')

#global city variable
loc_data = get_current_location()
lati = float(loc_data[0])
long = float(loc_data[1])
city = gn.reverse((lati, long))[0].split(',')[0]
navdate = dt.now().strftime("%m/%d/%Y")
#global data array for weather
data = {}


# TODO: Dynanic loading of card images based on weather_code.    
# {{ # url_for('static', filename='images/weather/' + weather_code + '.svg') }} 
@bp.route('/', methods=('GET', 'POST'))
def home():
    global city, lati, long, data

    if request.method == 'POST':
        city = request.form['city']
        city, lati, long = get_lat_long(city)
  
    data = get_forecast(lati, long)
    image_paths = weather_code_to_file(data)
    today_img = weather_code_to_file2(data)
    print(city, file=sys.stderr)
    if data:
        return render_template('overview.html', 
                               today=data, 
                               today_path=today_img, 
                               forecast=data['daily'], 
                               days=data['daily']['time'],
                               city=city, 
                               dow=data['daily']['day_of_week'],
                               images=image_paths,
                               navdate=navdate,
                               zip=zip)
    else:
        return "Failed toretrieve data"

def weather_code_to_file2(data):
       # 0,          # Clear sky
       # 1, 2, 3,    # Mainly clear, partly cloudy, and overcast
       # 45, 48,     # Fog and depositing rime fog
       # 51, 53, 55, # Drizzle: Light, moderate, and dense intensity
       # 56, 57,     # Freezing Drizzle: Light and dense intensity
       # 61, 63, 65, # Rain: Slight, moderate and heavy intensity
       # 66, 67,     # Freezing Rain: Light and heavy intensity
       # 71, 73, 75, # Snow fall: Slight, moderate, and heavy rain
       # 77,         # Snow grains
       # 80, 81, 82, # Rain showers: Slight, moderate, and violent
       # 85, 86,     # Snow showers slight and heavy
       # 95,         # Thunderstorm: Slight or moderate
       # 96, 99      # Thunderstorm with slight and heavy hall
    image_paths = []
    code = data['current']['weather_code']
    print(code)
    match code:
        case 0:
            image_paths.append(url_for('static', 
                                       filename='images/fill/darksky/clear-day.svg'))
        case 1 | 2 | 3:
            image_paths.append(url_for('static', 
                                       filename='images/fill/darksky/cloudy.svg'))
        case 45 | 48:
            image_paths.append(url_for('static', 
                                       filename='images/fill/darksky/fog.svg'))
        case 51 | 53 | 55 | 56 | 57:
            image_paths.append(url_for('static', 
                                       filename='images/fill/darksky/drizzle.svg'))
        case 61 | 63 | 65 | 66 | 67 | 80 | 81 | 82:
            image_paths.append(url_for('static', 
                                       filename='images/fill/darksky/rain.svg'))
        case 71 | 73 | 75 | 77 | 85 | 86:
            image_paths.append(url_for('static', 
                                       filename='images/fill/darksky/snow.svg'))
        case 95 | 96 | 99:
            image_paths.append(url_for('static', 
                                       filename='images/fill/darksky/thunderstorm.svg'))
        case _:
            image_paths.append(url_for('static', 
                                       filename='images/filli/all/not-available.svg'))

    return image_paths

def weather_code_to_file(data):
       # 0,          # Clear sky
       # 1, 2, 3,    # Mainly clear, partly cloudy, and overcast
       # 45, 48,     # Fog and depositing rime fog
       # 51, 53, 55, # Drizzle: Light, moderate, and dense intensity
       # 56, 57,     # Freezing Drizzle: Light and dense intensity
       # 61, 63, 65, # Rain: Slight, moderate and heavy intensity
       # 66, 67,     # Freezing Rain: Light and heavy intensity
       # 71, 73, 75, # Snow fall: Slight, moderate, and heavy rain
       # 77,         # Snow grains
       # 80, 81, 82, # Rain showers: Slight, moderate, and violent
       # 85, 86,     # Snow showers slight and heavy
       # 95,         # Thunderstorm: Slight or moderate
       # 96, 99      # Thunderstorm with slight and heavy hall
    image_paths = []
    for code in data['daily']['weather_code']:
        match code:
            case 0:
                image_paths.append(url_for('static', 
                                           filename='images/fill/darksky/clear-day.svg'))
            case 1 | 2 | 3:
                image_paths.append(url_for('static', 
                                           filename='images/fill/darksky/cloudy.svg'))
            case 45 | 48:
                image_paths.append(url_for('static', 
                                           filename='images/fill/darksky/fog.svg'))
            case 51 | 53 | 55 | 56 | 57:
                image_paths.append(url_for('static', 
                                           filename='images/fill/darksky/drizzle.svg'))
            case 61 | 63 | 65 | 66 | 67 | 80 | 81 | 82:
                image_paths.append(url_for('static', 
                                           filename='images/fill/darksky/rain.svg'))
            case 71 | 73 | 75 | 77 | 85 | 86:
                image_paths.append(url_for('static', 
                                           filename='images/fill/darksky/snow.svg'))
            case 95 | 96 | 99:
                image_paths.append(url_for('static', 
                                           filename='images/fill/darksky/thunderstorm.svg'))
            case _:
                image_paths.append(url_for('static', 
                                           filename='images/filli/all/not-available.svg'))

    return image_paths

@bp.route('/daily', methods=('GET', 'POST'))
def forecast():
    global lati, long, data
    if request.method == 'POST':
        city = request.form['city']
        city, lati, long = get_lat_long(city)
    
    data = get_forecast(lati, long)

    if data:
        return render_template('daily.html', forecast=data['daily'], 
                           days=data['daily']['time'], navdate=navdate, zip=zip)
    else:
        return "Failed toretrieve data"

@bp.route('/today', methods=('GET', 'POST'))
def current():
    global lati, long, data, city
    if request.method == 'POST':
        city = request.form['city']
        city, lati, long = get_lat_long(city)

    data = get_forecast(lati, long)
    
    # # Extract temperature in Celsius
    # temp_cel = data['current_weather']['temperature']

    # # Convert Celsius to Fahrenheit
    # temp_fah = temp_cel * 9/5 + 32
 
    # # Add to array
    # data['current_weather']['temperature_fahrenheit'] = temp_fah

    return render_template('today.html', today=data, city=city, navdate=navdate)

def get_forecast(latitude, longitude):
    params = {
    	"latitude":  latitude,
    	"longitude": longitude,
        "temperature_unit": "fahrenheit",
        "wind_speed_unit": "mph",
        "precipitation_unit": "inch",
        "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "precipitation", "rain", "showers", "snowfall", "weather_code", "cloud_cover", "pressure_msl", "surface_pressure", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
        "daily": ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "windspeed_10m_max", "weather_code"],
    }
    response = requests.get(API_WEATHER_URL, params=params)
    weather_data = response.json()
    convert_date(weather_data)
    add_day_of_week(weather_data)
    #print(weather_data)
    return weather_data

def convert_date(data):
    for i in range(len(data['daily']['time'])):
        og_date = data['daily']['time'][i]
        new_date = dt.strptime(og_date, "%Y-%m-%d").strftime("%m/%d/%Y")
        data['daily']['time'][i] = new_date

def add_day_of_week(data):
    data['daily']['day_of_week'] = []
    for date_str in data['daily']['time']:
        date = dt.strptime(date_str, '%m/%d/%Y')
        day_of_week = date.strftime('%A')
        data['daily']['day_of_week'].append(day_of_week)

def get_lat_long(city):
    place, (lat, long) = gn.geocode(city)
    print("Place:, " + place, file=sys.stderr)
    print("Lat:, " + str(lat), file=sys.stderr)
    print("Long:, " + str(long), file=sys.stderr)
    city = place.split(',')[0]
    # return tuple of lat and long
    return city, lat, long
