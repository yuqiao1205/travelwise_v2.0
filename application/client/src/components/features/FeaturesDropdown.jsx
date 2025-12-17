import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { themes } from '../../config/themes.js'
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import BuildIcon from '@mui/icons-material/Build'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import './featuresdropdown.css'

const FeaturesDropdown = ({ handleWriteClick }) => {
  return (
    <div className="nav-features">
      {/* Theme Dropdown */}
      <div className="nav-dropdown">
        <button className="nav-dropdown-btn">
          <ColorLensOutlinedIcon className="nav-dropdown-icon" />
          <span>Theme</span>
        </button>
        <div className="nav-dropdown-content">
          {themes.map(theme => (
            <Link key={theme.tid} to={`/posts/tag/${theme.tid}`}>{theme.name}</Link>
          ))}
        </div>
      </div>

      {/* Region Dropdown */}
      <div className="nav-dropdown">
        <button className="nav-dropdown-btn">
          <PublicOutlinedIcon className="nav-dropdown-icon" />
          <span>Region</span>
        </button>
        <div className="nav-dropdown-content">
          <Link to='/?cat=Asia'>Asia</Link>
          <Link to='/?cat=America'>America</Link>
          <Link to='/?cat=Europe'>Europe</Link>
          <Link to='/?cat=Africa'>Africa</Link>
          <Link to='/?cat=Caribbean'>Caribbean</Link>
          <Link to='/?cat=Middleeast'>Middle East</Link>
          <Link to='/?cat=Other'>Other</Link>
        </div>
      </div>

      {/* Tools Dropdown */}
      <div className="nav-dropdown">
        <button className="nav-dropdown-btn">
          <BuildIcon className="nav-dropdown-icon" />
          <span>Tools</span>
        </button>
        <div className="nav-dropdown-content">
          <Link to='/weather_info'>Weather Check</Link>
          <Link to='/yelpsearch'>Yelp Search</Link>
          <Link to='/information'>Country Info</Link>
        </div>
      </div>

      {/* Create Post Button */}
      <Link to='/write' className="nav-create-post-btn" onClick={handleWriteClick}>
        <AddCircleOutlineIcon className="nav-dropdown-icon" />
        <span>AddPost</span>
      </Link>
    </div>
  )
}

FeaturesDropdown.propTypes = {
  handleWriteClick: PropTypes.func.isRequired
}

export default FeaturesDropdown
