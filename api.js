import axios from 'axios'
import Redis from 'ioredis'
import "dotenv/config"

const redis = new Redis({
    'port':6379,
    'host': '127.0.0.1'
})
const cityEndpoint = (city) => `http://api.openweathermap.org/data/2.5/weather?q=${city}&unitsmetric&appid=${process.env.WEATHER_API_KEY}`

const getWeather = async (city) => {

    // Here we check if we have cached value of the city weather we want
    let cacheEntry = await redis.get(`weather:${city}`)
    // If we have a cache hit
    if (cacheEntry) {
        cacheEntry =  JSON.parse(cacheEntry)
          // Rerurn entry 

          return {...cacheEntry, 'source' : 'Cache'}
    }

    // we must have a cache miss
  

    // Othewise Here we are calling the API response
    let apiResponse = await axios.get(cityEndpoint(city))
    redis.set(`weather:${city}`, JSON.stringify(apiResponse.data))
    return {...apiResponse.data, 'source': 'API'}
}

const city = 'Nairobi'
const t0 = new Date().getTime()
let weather = await getWeather(city)
const t1 = new Date().getTime()
weather.responseTime = `${t1-t0}ms`
console.log(weather)