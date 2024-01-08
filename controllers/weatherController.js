const axios = require('axios');

exports.getWeather = async (req, res) => {
    const {lat, lon} = req.body;
    try{
        const openWeatherMapKey = process.env.WEATHER_API_KEY;
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherMapKey}`);
        const data = weatherResponse.data;
        //console.log(`weather data~~ : ${data}`);
        res.json(data);

    } catch (error) {
        console.error('Error in fetch Weather', error);
    }
}