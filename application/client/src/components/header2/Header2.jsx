import './header2.css'
import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// Region data with display names and descriptions
const regionData = {
  Asia: {
    name: 'Asia',
    description: 'Explore ancient temples, bustling cities, and serene landscapes',
    icon: '🏯'
  },
  America: {
    name: 'America',
    description: 'Discover the diverse landscapes from coast to coast',
    icon: '🗽'
  },
  Europe: {
    name: 'Europe',
    description: 'Journey through historic cities and picturesque countryside',
    icon: '🏰'
  },
  Africa: {
    name: 'Africa',
    description: 'Experience wildlife safaris and vibrant cultures',
    icon: '🦁'
  },
  Caribbean: {
    name: 'Caribbean',
    description: 'Relax on pristine beaches and tropical paradise islands',
    icon: '🏝️'
  },
  Middleeast: {
    name: 'Middle East',
    description: 'Discover ancient wonders and modern marvels',
    icon: '🕌'
  },
  Other: {
    name: 'Other Destinations',
    description: 'Explore unique and off-the-beaten-path locations',
    icon: '🌍'
  }
}

export default function Header2 () {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const category = queryParams.get('cat')
  
  const regionInfo = regionData[category] || {
    name: 'Explore',
    description: 'Discover amazing travel destinations around the world',
    icon: '🌎'
  }

  return (
    <div className='category-header'>
      <div className='category-header-overlay'>
        <div className='category-header-content'>
          <Link to='/' className='back-to-home'>
            <ArrowBackIcon />
            <span>Back to Home</span>
          </Link>
          
          <div className='category-info'>
            <span className='category-icon'>{regionInfo.icon}</span>
            <div className='category-text'>
              <div className='category-label'>
                <PublicOutlinedIcon className='region-icon' />
                <span>Region/theme</span>
              </div>
              <h1 className='category-title'>{regionInfo.name}</h1>
              <p className='category-description'>{regionInfo.description}</p>
            </div>
          </div>

          <div className='category-breadcrumb'>
            <Link to='/'>Home</Link>
            <span className='breadcrumb-separator'>/</span>
            <span className='current-page'>{regionInfo.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
