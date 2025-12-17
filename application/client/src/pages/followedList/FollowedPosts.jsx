import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../../context/authContext'
// import Header2 from '../../components/header2/Header2'
import Paging from '../../components/pagination/Paging'
import './followedPosts.css'

const FollowedPost = () => {
  const { currentUser } = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1) // Current page
  const [totalPages, setTotalPages] = useState(0) // Total pages

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          // Include currentPage in the API request
          const res = await axios.get(`/posts/followed/${currentUser.id}?page=${currentPage}`)
          setPosts(res.data.posts)
          setTotalPages(res.data.totalPages) // Assume the backend sends this data
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [currentUser?.id, currentPage]) // Depend on currentUser.id and currentPage

  return (
    <>
  
      <div className="followed-container">
        <div className="followed-header">
          <h2>Your Followed Users Posts</h2>
          <p className="posts-count">Posts from users you follow: {posts.length}</p>
        </div>
        <div className="posts-table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="post-row">
                  <td className="image-cell">
                    <div className="post-thumbnail">
                      {post.thumbnail ? (
                        <img src={`/upload/${post.thumbnail}`} alt={post.title} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                  </td>
                  <td className="title-cell">
                    <Link to={`/singlepost/${post.id}`}>{post.title}</Link>
                  </td>
                  <td className="author-cell">
                    <Link to={`/user/${post.uid}`}>{post.username}</Link>
                  </td>
                  <td className="date-cell">
                    {moment(post.date).fromNow()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='followed-paging'>
          <Paging
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  )
}

export default FollowedPost
