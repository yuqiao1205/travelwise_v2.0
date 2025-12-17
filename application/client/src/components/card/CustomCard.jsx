import { React } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './card.css'
import Like from '../like/Like'
import SaveToFavorites from '../favorite/Savefavorite'
import PropTypes from 'prop-types'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function CustomCard ({ id, img, title, desc, date, postUserId }) {
  const defaultImageUrl = 'https://picsum.photos/id/16/300'

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent
  }

  const formatImageUri = (uri) => {
    return uri && uri.startsWith('http') ? uri : (uri ? `../../upload/${uri}-thumbnail.jpg` : defaultImageUrl)
  }

  return (
    <div className="modern-card">
      <div className="card-image-container">
        <Link to={`/singlepost/${id}`} className="card-image-link">
          <img 
            className="card-image" 
            src={formatImageUri(img)} 
            alt={title}
          />
          <div className="card-image-overlay"></div>
        </Link>
      </div>
      
      <div className="card-content">
        <div className="card-meta">
          <span className="card-date">
            <AccessTimeIcon className="date-icon" />
            {moment(date).fromNow()}
          </span>
        </div>
        
        <Link to={`/singlepost/${id}`} className="card-title-link">
          <h3 className="card-title">{title}</h3>
        </Link>
        
        <p className="card-description">{getText(desc)}</p>
        
        <div className="card-footer">
          <div className="card-actions">
            <div className="action-item">
              <Like postId={id} />
            </div>
            <div className="action-item">
              <SaveToFavorites postId={id} postUserId={postUserId} />
            </div>
          </div>
          
          <Link to={`/singlepost/${id}`} className="card-read-more">
            <span>Read More</span>
            <ArrowForwardIcon className="arrow-icon" />
          </Link>
        </div>
      </div>
    </div>
  )
}

CustomCard.propTypes = {
  id: PropTypes.number.isRequired,
  img: PropTypes.string,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  postUserId: PropTypes.number.isRequired
}
