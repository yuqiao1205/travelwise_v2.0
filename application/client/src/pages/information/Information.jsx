import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import axios from 'axios'
import './information.css'
import { countries } from '../../config/countries.js'
import PublicIcon from '@mui/icons-material/Public'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoIcon from '@mui/icons-material/Info'
import PlaceIcon from '@mui/icons-material/Place'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TranslateIcon from '@mui/icons-material/Translate'
import PhoneIcon from '@mui/icons-material/Phone'
import FlagIcon from '@mui/icons-material/Flag'

const Information = () => {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [callingCode, setCallingCode] = useState('')
  const [countryName, setCountryName] = useState('')
  const [officialName, setOfficialName] = useState('')
  const [capital, setCapital] = useState('')
  const [region, setRegion] = useState('')
  const [subregion, setSubregion] = useState('')
  const [population, setPopulation] = useState('')
  const [flagURL, setFlagURL] = useState('')
  const [timezones, setTimezones] = useState([])
  const [currency, setCurrency] = useState('')
  const [languages, setLanguages] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [hasData, setHasData] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (selectedCountry) {
      fetchCountryDetails(selectedCountry.value)
    } else {
      clearCountryData()
    }
  }, [selectedCountry])

  const clearCountryData = () => {
    setCallingCode('')
    setCountryName('')
    setOfficialName('')
    setCapital('')
    setRegion('')
    setSubregion('')
    setPopulation('')
    setFlagURL('')
    setCurrency('')
    setTimezones([])
    setLanguages({})
    setHasData(false)
    setError('')
  }

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption)
  }

  const getFirstKey = (jsonObj) => {
    const keys = Object.keys(jsonObj)
    return keys.length > 0 ? keys[0] : null
  }

  const extractCountryInfo = (countryData) => {
    const root = getFirstKey(countryData)
    const countryInfo = countryData[root]
    return {
      name: countryInfo.name,
      officialName: countryInfo.official_name,
      callingCode: countryInfo.callingCode,
      capital: countryInfo.capital,
      region: countryInfo.region,
      subregion: countryInfo.subregion,
      population: countryInfo.population,
      timezones: countryInfo.timezones,
      currencies: countryInfo.currencies,
      languages: countryInfo.languages,
      flagURL: countryInfo.flag ? countryInfo.flag.large : ''
    }
  }

  const transformCurrencyInfo = (currencyData) => {
    const firstKey = getFirstKey(currencyData)
    const currency = currencyData[firstKey]
    return `${currency.name} (${currency.symbol})`
  }

  const formatPopulation = (pop) => {
    return new Intl.NumberFormat().format(pop)
  }

  const fetchCountryDetails = (countryNameParam) => {
    setIsLoading(true)
    setError('')
    axios
      .get(`/country?selectedCountry=${countryNameParam}`)
      .then((response) => {
        const countryData = response.data.countryDetails
        const countryInfo = extractCountryInfo(countryData)
        setCallingCode(countryInfo.callingCode || '')
        setCountryName(countryInfo.name || '')
        setOfficialName(countryInfo.officialName || '')
        setCapital(countryInfo.capital || '')
        setRegion(countryInfo.region || '')
        setSubregion(countryInfo.subregion || '')
        setPopulation(countryInfo.population || '')
        setTimezones(countryInfo.timezones || [])
        if (countryInfo.currencies) {
          setCurrency(transformCurrencyInfo(countryInfo.currencies))
        } else {
          setCurrency('')
        }
        setLanguages(countryInfo.languages || {})
        setFlagURL(countryInfo.flagURL || '')
        setHasData(true)
      })
      .catch((err) => {
        console.error('Error fetching country details:', err)
        setError('Failed to load country information. Please try again.')
        setHasData(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="info-page">
      {/* Hero Header */}
      <div className="info-header">
        <div className="info-header-overlay">
          <div className="info-header-content">
            <Link to='/' className='back-to-home'>
              <ArrowBackIcon />
              <span>Back to Home</span>
            </Link>
            
            <div className="info-hero-info">
              <div className="info-icon-group">
                <PublicIcon className="info-globe-icon" />
              </div>
              <div className="info-hero-text">
                <h1 className="info-hero-title">Country Information</h1>
                <p className="info-hero-subtitle">
                  Explore detailed information about countries around the world
                </p>
              </div>
            </div>

            <div className="info-breadcrumb">
              <Link to='/'>Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="current-page">Country Info</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="info-search-section">
        <div className="info-search-card">
          <div className="info-search-header">
            <InfoIcon className="search-header-icon" />
            <h2>Select a Country</h2>
          </div>
          <p className="info-search-instruction">
            Choose a country from the dropdown to view detailed information
          </p>
          <div className="info-select-wrapper">
            <Select
              options={countries}
              isSearchable={true}
              placeholder='Search or select a country...'
              onChange={handleCountryChange}
              className='info-select'
              classNamePrefix='info-select'
            />
          </div>
        </div>
      </div>

      {/* Country Info Display */}
      <div className="info-results-section">
        {isLoading ? (
          <div className="info-loading">
            <div className="loading-spinner"></div>
            <p>Loading country information...</p>
          </div>
        ) : error ? (
          <div className="info-error">
            <PublicIcon className="placeholder-icon" />
            <p>{error}</p>
          </div>
        ) : hasData ? (
          <div className="country-card">
            {/* Flag Section */}
            {flagURL && (
              <div className="country-flag-section">
                <img src={flagURL} alt={`${countryName} flag`} className="country-flag" />
              </div>
            )}
            
            {/* Info Grid */}
            <div className="country-info-grid">
              <div className="info-item">
                <div className="info-item-icon">
                  <FlagIcon />
                </div>
                <div className="info-item-content">
                  <span className="info-label">Country Name</span>
                  <span className="info-value">{countryName}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon">
                  <InfoIcon />
                </div>
                <div className="info-item-content">
                  <span className="info-label">Official Name</span>
                  <span className="info-value">{officialName || 'N/A'}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon">
                  <PlaceIcon />
                </div>
                <div className="info-item-content">
                  <span className="info-label">Capital</span>
                  <span className="info-value">{capital || 'N/A'}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon">
                  <PublicIcon />
                </div>
                <div className="info-item-content">
                  <span className="info-label">Region</span>
                  <span className="info-value">{region} {subregion ? `/ ${subregion}` : ''}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon">
                  <PeopleIcon />
                </div>
                <div className="info-item-content">
                  <span className="info-label">Population</span>
                  <span className="info-value">{formatPopulation(population)}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon">
                  <PhoneIcon />
                </div>
                <div className="info-item-content">
                  <span className="info-label">Calling Code</span>
                  <span className="info-value">{callingCode || 'N/A'}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon">
                  <AttachMoneyIcon />
                </div>
                <div className="info-item-content">
                  <span className="info-label">Currency</span>
                  <span className="info-value">{currency || 'N/A'}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon">
                  <AccessTimeIcon />
                </div>
                <div className="info-item-content">
                  <span className="info-label">Timezones</span>
                  <span className="info-value timezone-value">
                    {Array.isArray(timezones) ? timezones.join(', ') : timezones}
                  </span>
                </div>
              </div>

              <div className="info-item full-width">
                <div className="info-item-icon">
                  <TranslateIcon />
                </div>
                <div className="info-item-content">
                  <span className="info-label">Languages</span>
                  <div className="languages-list">
                    {Object.entries(languages).map(([code, name]) => (
                      <span key={code} className="language-tag">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="info-placeholder">
            <PublicIcon className="placeholder-icon" />
            <p>Select a country to view detailed information</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Information
