import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import YelpSearchResultsList from './YelpSearchResultsList'
import Paging from '../pagination/Paging'
import StorefrontIcon from '@mui/icons-material/Storefront'
import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import './yelpSearchBar.css'

function YelpInfoPage () {
  const [businesses, setBusinesses] = useState([])
  const [inputTerm, setInputTerm] = useState('')
  const [inputLocation, setInputLocation] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async (term, location, page) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/yelpsearch?term=${term}&location=${location}&page=${page}`)
      setBusinesses(response.data.businesses)
      setTotalPages(response.data.totalPages)
      setError('')
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError(error.response.data.error)
        } else {
          setError('An error occurred while fetching businesses.')
        }
      } else {
        setError('An error occurred while updating businesses.')
      }
    }
    setIsLoading(false)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!inputTerm || !inputLocation) {
      setError('Both search term and location are required.')
      return
    }
    setError('')
    setSearchTerm(inputTerm)
    setSearchLocation(inputLocation)
    setCurrentPage(1)
    fetchData(inputTerm, inputLocation, 1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (searchTerm && searchLocation) {
      fetchData(searchTerm, searchLocation, page)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <div className="yelp-page">
      {/* Hero Header */}
      <div className="yelp-header">
        <div className="yelp-header-overlay">
          <div className="yelp-header-content">
            <Link to='/' className='back-to-home'>
              <ArrowBackIcon />
              <span>Back to Home</span>
            </Link>
            
            <div className="yelp-hero-info">
              <div className="yelp-icon-group">
                <StorefrontIcon className="yelp-store-icon" />
                <RestaurantIcon className="yelp-food-icon" />
              </div>
              <div className="yelp-hero-text">
                <h1 className="yelp-hero-title">Business Finder</h1>
                <p className="yelp-hero-subtitle">
                  Discover restaurants, shops, and services near your destination
                </p>
              </div>
            </div>

            <div className="yelp-breadcrumb">
              <Link to='/'>Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="current-page">Yelp Search</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="yelp-search-section">
        <div className="yelp-search-card">
          <div className="yelp-search-header">
            <SearchIcon className="search-header-icon" />
            <h2>Find Local Businesses</h2>
          </div>
          
          <form className="yelp-search-form" onSubmit={handleSearch}>
            <div className="yelp-search-fields">
              <div className="yelp-input-group">
                <label>
                  <RestaurantIcon className="input-label-icon" />
                  <span>What are you looking for?</span>
                </label>
                <input
                  type="text"
                  value={inputTerm}
                  onChange={(e) => setInputTerm(e.target.value)}
                  placeholder="e.g., sushi, coffee, pizza"
                  onKeyDown={handleKeyDown}
                  className="yelp-input"
                />
              </div>
              
              <div className="yelp-input-group">
                <label>
                  <LocationOnIcon className="input-label-icon" />
                  <span>Location</span>
                </label>
                <input
                  type="text"
                  value={inputLocation}
                  onChange={(e) => setInputLocation(e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                  onKeyDown={handleKeyDown}
                  className="yelp-input"
                />
              </div>
              
              <button type="submit" className="yelp-search-btn" disabled={isLoading}>
                <SearchIcon />
                <span>{isLoading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
            
            {error && <p className="yelp-error">{error}</p>}
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="yelp-results-section">
        {isLoading ? (
          <div className="yelp-loading">
            <div className="loading-spinner"></div>
            <p>Searching for businesses...</p>
          </div>
        ) : businesses.length > 0 ? (
          <>
            <div className="yelp-results-header">
              <h3>Found {businesses.length} businesses</h3>
            </div>
            <YelpSearchResultsList businesses={businesses} />
            <div className="yelp-pagination">
              <Paging
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : searchTerm && searchLocation && !isLoading ? (
          <div className="yelp-no-results">
            <StorefrontIcon className="no-results-icon" />
            <h3>No businesses found</h3>
            <p>Try different search terms or location</p>
          </div>
        ) : (
          <div className="yelp-placeholder">
            <StorefrontIcon className="placeholder-icon" />
            <p>Enter a search term and location to find businesses</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default YelpInfoPage
