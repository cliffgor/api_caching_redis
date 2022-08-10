import axios from 'axios'
import "dotenv/config"

const cityEndpoint = (city) => `http://api.openweathermap.org/data/2.5/weather?q=${city}&unitsmetric&appid=${process.env.WEATHER_API_KEY}`

const getWeather = async (city) => {
    let apiResponse = await axios.get(cityEndpoint(city))

    return {...apiResponse.data, 'source': 'API'}
}

const city = 'Nairobi'
const t0 = new Date().getTime()
let weather = await getWeather(city)
const t1 = new Date().getTime()
weather.responseTime = `${t1-t0}ms`
console.log(weather)