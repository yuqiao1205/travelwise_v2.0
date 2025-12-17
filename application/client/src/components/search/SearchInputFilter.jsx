import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import './searchInputFilter.css'

const SearchInputFilter = () => {
  const [searchFilter, setSearchFilter] = useState('')
  const [searchText, setSearchText] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const navigate = useNavigate()
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText)}&filter=${searchFilter}`)
      setSearchText('') // Optionally clear the search input after navigating
    }
  }

  const handleFilterSelect = (value) => {
    setSearchFilter(value)
    setIsFilterOpen(false)
  }

  const getFilterLabel = () => {
    switch (searchFilter) {
    case '': return 'All'
    case 'cat': return 'Region'
    case 'title': return 'Title'
    case 'username': return 'Author'
    default: return 'Filter'
    }
  }

  const handleKeyPress = (e) => {
    console.log('key pressed', e.key)
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className='search-container'>
      <div className='search-input-wrapper'>
        <SearchOutlinedIcon className='search-icon' onClick={handleSearch} />
        <input
          type='text'
          placeholder='Search posts...'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyPress}
          className='search-input'
        />
        <div className='custom-filter' ref={filterRef}>
          <button
            className='filter-button'
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            {getFilterLabel()}
            <KeyboardArrowDownIcon className={`arrow-icon ${isFilterOpen ? 'open' : ''}`} />
          </button>
          {isFilterOpen && (
            <div className='filter-dropdown'>
              <div className='filter-option' onClick={() => handleFilterSelect('')}>All</div>
              <div className='filter-option' onClick={() => handleFilterSelect('cat')}>Region</div>
              <div className='filter-option' onClick={() => handleFilterSelect('title')}>Title</div>
              <div className='filter-option' onClick={() => handleFilterSelect('username')}>Author</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchInputFilter
