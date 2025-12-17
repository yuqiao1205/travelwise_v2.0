import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import CurrentWeather from '../../components/weather/CurrentWeatherBox'
import ForecastDetail from '../../components/weather/ForecastDetail' 
import WeatherSearchInput from '../../components/weather/WeatherSearchInput'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import './weatherInfo.css'

const WeatherInfo = () => {
  const [weatherData, setWeatherData] = useState({
    currentWeather: null,
    forecast: null
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleOnSearchChange = async (searchData) => {
    if (!searchData || !searchData.value) return

    setIsLoading(true)
    try {
      const [lat, lon] = searchData.value.split(' ')
      const response = await axios.get(`/weather?lat=${lat}&lon=${lon}`)
      const data = response.data

      if (data.success) {
        setWeatherData({
          currentWeather: data.currentWeather,
          forecast: data.weatherForecast
        })
      } else {
        console.error('Failed to fetch weather data:', data.error)
        setWeatherData({
          currentWeather: null,
          forecast: null
        })
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
    setIsLoading(false)
  }

  return (
    <div className="weather-page">
      {/* Weather Header Hero */}
      <div className="weather-header">
        <div className="weather-header-overlay">
          <div className="weather-header-content">
            <Link to='/' className='back-to-home'>
              <ArrowBackIcon />
              <span>Back to Home</span>
            </Link>
            
            <div className="weather-hero-info">
              <div className="weather-icon-group">
                <WbSunnyIcon className="weather-sun-icon" />
                <ThermostatIcon className="weather-temp-icon" />
              </div>
              <div className="weather-hero-text">
                <h1 className="weather-hero-title">Weather Forecast</h1>
                <p className="weather-hero-subtitle">
                  Check the weather at your travel destination before you go
                </p>
              </div>
            </div>

            <div className="weather-breadcrumb">
              <Link to='/'>Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="current-page">Weather Infomation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="weather-search-section">
        <div className="search-card">
          <div className="search-card-header">
            <LocationOnIcon className="location-icon" />
            <h2>Find Your Destination</h2>
          </div>
          <p className="search-instruction">
            Enter a city name to get current weather and 5-day forecast
          </p>
          <div className="weather-search-wrapper">
            <WeatherSearchInput onSearchChange={handleOnSearchChange} />
          </div>
        </div>
      </div>

      {/* Weather Results */}
      <div className="weather-results">
        {isLoading ? (
          <div className="weather-loading">
            <div className="loading-spinner"></div>
            <p>Fetching weather data...</p>
          </div>
        ) : (
          <>
            {weatherData.currentWeather && (
              <div className="weather-current-card">
                <CurrentWeather data={weatherData.currentWeather} />
              </div>
            )}
            {weatherData.forecast && (
              <div className="weather-forecast-card">
                <ForecastDetail data={weatherData.forecast} />
              </div>
            )}
            {!weatherData.currentWeather && !weatherData.forecast && (
              <div className="weather-placeholder">
                <WbSunnyIcon className="placeholder-icon" />
                <p>Search for a city to see weather information</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default WeatherInfo
