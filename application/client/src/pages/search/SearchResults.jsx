import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, Link } from 'react-router-dom'
import CustomCard from '../../components/card/CustomCard.jsx'
import './searchResultsPage.css'
import Paging from '../../components/pagination/Paging.jsx'
import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FilterListIcon from '@mui/icons-material/FilterList'

// Filter display names
const filterNames = {
  cat: 'Category',
  title: 'Title',
  desc: 'Description',
  user: 'Author'
}

const SearchResults = () => {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchTerm = queryParams.get('q')
  const filter = queryParams.get('filter')

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filter])

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`/search/?q=${encodeURIComponent(searchTerm)}&filter=${filter}&page=${currentPage}`)

        if (res.data.data && res.data.data.length > 0) {
          setPosts(res.data.data)
          setTotalPages(res.data.totalPages)
        } else {
          setPosts([])
          setTotalPages(1)
        }
      } catch (error) {
        console.log('Error fetching search results:', error)
        setPosts([])
        setTotalPages(1)
      }
      setIsLoading(false)
    }

    if (searchTerm) {
      fetchSearchResults()
    }
  }, [searchTerm, currentPage, filter])

  const capitalizeEachCharacter = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="search-results-page">
      {/* Search Header Hero Section */}
      <div className="search-header">
        <div className="search-header-overlay">
          <div className="search-header-content">
            <Link to='/' className='back-to-home'>
              <ArrowBackIcon />
              <span>Back to Home</span>
            </Link>
            
            <div className="search-info">
              <span className="search-icon-large">
                <SearchIcon />
              </span>
              <div className="search-text">
                <div className="search-label">
                  <FilterListIcon className="filter-icon" />
                  <span>Search by {filterNames[filter] || 'All'}</span>
                </div>
                <h1 className="search-term">&quot;{searchTerm ? capitalizeEachCharacter(searchTerm) : ''}&quot;</h1>
                <p className="search-results-count">
                  {isLoading ? 'Searching...' : (
                    posts.length > 0 
                      ? `Found ${posts.length} result${posts.length !== 1 ? 's' : ''}` 
                      : 'No results found'
                  )}
                </p>
              </div>
            </div>

            <div className="search-breadcrumb">
              <Link to='/'>Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="current-page">Search Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Grid */}
      <div className='search-results-container'>
        {isLoading ? (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>Searching for posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="no-results">
            <SearchIcon className="no-results-icon" />
            <h3>No results found</h3>
            <p>Try different keywords or adjust your search filter</p>
            <Link to='/' className="back-home-btn">Browse All Posts</Link>
          </div>
        ) : (
          <div className='search-posts-grid'>
            {posts.map((post) => (
              <div key={post.id} className='search-post-card'>
                <CustomCard id={post.id} {...post} postUserId={post.uid} />
              </div>
            ))}
          </div>
        )}
      </div>

      {posts.length > 0 && (
        <Paging
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

export default SearchResults
