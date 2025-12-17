import { Link, useNavigate } from 'react-router-dom'
import DropdownMenu from '../settingdropdown/DropdownMenu.jsx'
import { AuthContext } from '../../context/authContext.js'
import React, { useContext, useState } from 'react'
import './navbar.css'
// import SearchInput from '../../pages/searchpage/SearchInput.jsx';
import FeaturesDropdown from '../features/FeaturesDropdown.jsx'
// import BookingDropdown from '../booking/BookingDropdown.jsx'
// import TravelDropdown from '../traveldropdown/TravelDropdown.jsx'
import SearchInputFilter from '../search/SearchInputFilter.jsx'

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleWriteClick = (e) => {
    // Check if the user is logged in
    if (!currentUser) {
      // Prevent default link behavior
      e.preventDefault()
      // If not logged in, redirect to the login page
      navigate('/login')
    }
  }

  const handleLogout = () => {
    logout()
    // Redirect to the home page
    navigate('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to='/'>
            <span className="brand-text">TravelWise</span>
          </Link>
        </div>

        <div className="navbar-search">
          <SearchInputFilter/>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <FeaturesDropdown handleWriteClick={handleWriteClick}/>

          <div className="navbar-auth">
            {currentUser ? (
              <div className="user-section">
                <DropdownMenu currentUser={currentUser} />
                <button className='logout-btn' onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to='/login' className='auth-link login-link' onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </Link>
                <Link to='/register' className='auth-link register-link' onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-user-plus"></i>
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
