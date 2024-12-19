import requests
from config import GEO_SERVICE, OPEN_WEATHER_APIKEY

# Not paying for an API so state is indeterminant.
# I'm paying with my dignity
def get_current_location():
    """Returns current location as a list[latitude,longitude]"""
    r = requests.get(GEO_SERVICE)
    cur_loc = r.text.split(',')
    return cur_loc

#`http://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=${limit}&appid=${apiKEY}`