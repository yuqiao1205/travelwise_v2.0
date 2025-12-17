import './paging.css'
import PropTypes from 'prop-types'
import React from 'react'

const Paging = ({ currentPage, totalPages, onPageChange }) => {
  console.log('totalPages:', totalPages)

  const getPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  if (totalPages === 0) {
    return null // Return null to hide pagination when totalPages is 0
  }

  return (
    <div className='pagination-container'>
      {/* Pagination controls */}
      <button
        className='pagination-control'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      {/* Page number area */}
      {getPageNumbers().map(pageNumber => (
        <button
          key={pageNumber}
          className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
          onClick={() => onPageChange(pageNumber)}
          disabled={currentPage === pageNumber}
        >
          {pageNumber}
        </button>
      ))}

      <button
        className='pagination-control'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  )
}

Paging.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
}

export default Paging
