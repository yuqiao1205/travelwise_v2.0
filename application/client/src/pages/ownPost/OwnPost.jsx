import Edit from '../../img/edit.png'
import Del from '../../img/del.png'
// import Header2 from '../../components/header2/Header2'
import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
// import moment from 'moment'
import { AuthContext } from '../../context/authContext'
import './ownpost.css'
import Paging from '../../components/pagination/Paging'

const OwnPost = () => {
  const { currentUser } = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1) // Current page
  const [totalPages, setTotalPages] = useState(0) // Total pages

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if currentUser is available before making the request
        if (currentUser) {
          const res = await axios.get(
            `/posts/user/${currentUser.id}?page=${currentPage}`
          )
          setPosts(res.data.posts)
          setTotalPages(res.data.totalPages)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [currentUser?.id, currentPage])

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/posts/${postId}`)
      // Remove the deleted post from the state to update the UI
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
      // Refetch the posts to stay on the same page
      const res = await axios.get(`/posts/user/${currentUser?.id || ''}`)
      setPosts(res.data.posts)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
     
      <div className="ownpost-container">
        <div className="ownpost-header">
          <h2>Manage Your Posts</h2>
          <p className="posts-count">Total posts: {posts.length}</p>
        </div>
        <div className="posts-table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Date</th>
                <th>Actions</th>
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
                  <td className="date-cell">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="actions-cell">
                    {currentUser?.id === post.userId && (
                      <div className="action-buttons">
                        <Link to={`/update?edit=${post.id}`} state={post} className="action-btn edit-btn">
                          <img src={Edit} alt="Edit" />
                        </Link>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(post.id)}>
                          <img src={Del} alt="Delete" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='ownpost-paging'>
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

// return (
//   <>
//     <Header2 />
//     <div className="ownpost">
//       <table>
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Date</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {posts.map((post) => (
//             <tr key={post.id}>
//               <td>
//                 <Link to={`/singlepost/${post.id}`}>{post.title}</Link>
//               </td>
//               {/* <td>{moment(post.date).fromNow()}</td> */}
//               <td>{new Date(post.date).toLocaleString()}</td>
//               <td>
//                 {currentUser?.id === post.userId && ( // Update the check
//                   <div className="edit">
//                     <Link to={`/write?edit=${post.id}`} state={post}>
//                       <img src={Edit} alt="Edit" />
//                     </Link>

//                     <img
//                       src={Del}
//                       alt="Delete"
//                       onClick={() => handleDelete(post.id)}
//                     />
//                   </div>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {/* Pagination buttons */}
//       {/* Pagination buttons */}

//       <div className="paging">
//         <Paging
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={setCurrentPage}
//         />
//       </div>
//     </div>
//   </>
// )
// }

export default OwnPost

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       // Check if currentUser is available before making the request
//       if (currentUser) {
//         const res = await axios.get(`/posts/user/${currentUser.id}`)
//         setPosts(res.data)
//       }
//     } catch (err) {
//       console.log(err)
//     }
//   }
//   fetchData()
// }, [currentUser?.id]) // Update the dependency array
