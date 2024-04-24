import axios from 'axios';
import { object, string, number, Output, parse } from 'valibot';
import { SearchType } from '../types';
import { useMemo, useState } from 'react';

const WeatherSchema = object({
  name: string(),
  main: object({
    temp: number(),
    temp_max: number(),
    temp_min: number()
  })
})
export type Weather = Output<typeof WeatherSchema>

const initialState = {
  name: '',
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0
  }
}

export default function useWeather() {

  const [weather, setWeather] = useState<Weather>(initialState)
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [alert, setAlert] = useState('');

  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY
    setLoading(true);
    setWeather(initialState)
    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}` 
      
      const {data} = await axios(geoUrl)

      if(!data[0]) {
        setNotFound(true);
        return
      }
      setNotFound(false);
      setAlert('');

      const lat = data[0].lat
      const lon = data[0].lon
      
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`
      const {data: weatherResult} = await axios(weatherUrl)
      const result = parse(WeatherSchema, weatherResult)

      if(result) {
        setWeather(result)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const hasWeatherData = useMemo(() => weather.name, [weather])
  return {
    weather,
    loading,
    notFound,
    alert,
    setAlert,
    fetchWeather,
    hasWeatherData
  }
}