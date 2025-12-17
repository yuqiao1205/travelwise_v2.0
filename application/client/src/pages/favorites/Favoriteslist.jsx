import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/authContext'
import { Link } from 'react-router-dom'
import Paging from '../../components/pagination/Paging'
import './favoriteslist.css'

// import moment from 'moment';

const FavoritesList = () => {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1) // Current page
  const [totalPages, setTotalPages] = useState(0) // Total pages
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          // Adjusted to include currentPage in the request
          const res = await axios.get(`/favorites/${currentUser.id}?page=${currentPage}`)
          setPosts(res.data.posts) // Assuming the API returns an object with posts and totalPages
          setTotalPages(res.data.totalPages)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [currentUser?.id, currentPage]) // Depend on currentPage as well

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/favorites?postId=${postId}`)
      // Optionally, refetch favorites to reflect changes or simply filter out the deleted post
      const updatedPosts = posts.filter(post => post.id !== postId)
      setPosts(updatedPosts)
    } catch (err) {
      console.error('Error deleting post:', err)
    }
  }

  return (
    <div className="favorites-container">
      <div className="favorites-wrapper">
        {/* Header Section */}
        <div className="favorites-header">
          <div className="header-content-fav">
            <div className="header-icon-fav">
              <i className="fas fa-heart"></i>
            </div>
            <div className="header-text-fav">
              <h1>My Favorite Posts</h1>
              <p className="posts-count">
                <i className="fas fa-bookmark"></i>
                {posts.length} {posts.length === 1 ? 'favorite post' : 'favorite posts'} saved
              </p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="favorites-grid">
            {posts.map((post, index) => (
              <div key={`${post.id}-${index}`} className="favorite-card">
                <div className="card-image">
                  {post.thumbnail ? (
                    <Link to={`/singlepost/${post.id}`}>
                      <img src={`/upload/${post.thumbnail}`} alt={post.title} />
                    </Link>
                  ) : (
                    <div className="no-image">
                      <i className="fas fa-image"></i>
                      <span>No Image</span>
                    </div>
                  )}
                  <button className="remove-favorite-btn" onClick={() => handleDelete(post.id)} title="Remove from favorites">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="card-content-fav">
                  <h3 className="card-title-fav">
                    <Link to={`/singlepost/${post.id}`}>{post.title}</Link>
                  </h3>
                  <div className="card-meta">
                    <div className="meta-item">
                      <i className="fas fa-user"></i>
                      <Link to={`/user/${post.userId}`} className="author-link">{post.username}</Link>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span className="date-text">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <Link to={`/singlepost/${post.id}`} className="read-more-btn">
                    Read Post
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <div className="empty-icon">
              <i className="fas fa-heart-broken"></i>
            </div>
            <h2>No Favorites Yet</h2>
            <p>Start exploring and save your favorite travel stories!</p>
            <Link to="/" className="browse-btn">
              <i className="fas fa-compass"></i>
              Browse Posts
            </Link>
          </div>
        )}

        {/* Pagination */}
        {posts.length > 0 && (
          <div className='favorites-paging'>
            <Paging
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesList
