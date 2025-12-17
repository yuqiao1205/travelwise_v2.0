import React, { useState, useContext, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../../context/authContext'
import { themes } from '../../config/themes.js'
import './newPost.css'
import { useNavigate, useLocation } from 'react-router-dom'
// import { themeCheckboxes } from './postlib'

const NewPost = () => {
  const Navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useContext(AuthContext)
  const [isAuthenticated] = useState(!!currentUser)
  const [desc, setDesc] = useState('')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [cat, setCategory] = useState('')
  const [selectedThemes, setSelectedThemes] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [postId, setPostId] = useState(null)

  const handleThemeChange = (themeId) => {
    const themeName = themes.find(theme => theme.tid === themeId)?.name
    if (!themeName) return

    setSelectedThemes(prevThemes => {
      if (prevThemes.includes(themeName)) {
        return prevThemes.filter(name => name !== themeName)
      } else {
        return [...prevThemes, themeName]
      }
    })
  }

  // Render the checkboxes for themes
  const themeCheckboxes = themes.map(theme => (
    <div key={theme.tid} className='theme'>
      <input
        type='checkbox'
        checked={selectedThemes.includes(theme.name)}
        onChange={() => handleThemeChange(theme.tid)}
        id={`theme-${theme.tid}`}
      />
      <label htmlFor={`theme-${theme.tid}`}>{theme.name}</label>
    </div>
  ))

  const [uploadError, setUploadError] = useState('')
  const upload = async () => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/upload', formData)
      setUploadError('') // Clear any previous upload error
      return res.data
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data && err.response.data.error) {
        setUploadError(err.response.data.error || 'An error occurred while uploading the image')
      } else {
        setUploadError('Failed to upload image')
      }
    }
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const editId = queryParams.get('edit')
    if (editId && location.state) {
      setIsEdit(true)
      setPostId(editId)
      const post = location.state
      setTitle(post.title || '')
      setDesc(post.desc || '')
      setCategory(post.cat || '')
      setSelectedThemes(post.themes || [])
      // Note: file is not set for edit, as image update might be separate
    }
  }, [location])

  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => {
        setUploadError('') // Clear the error message after 3 seconds
      }, 3000)

      return () => clearTimeout(timer) // Cleanup the timer
    }
  }, [uploadError])

  function handleFileChange (e) {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setUploadError('Please select an image file.')
        setFile(null)
      } else {
        setUploadError('') // Clear previous errors
        setFile(selectedFile) // Proceed to set the file
      }
    } else {
      setFile(null) // Clear file if none is selected
    }
  }
  const [errorMessages, setErrorMessage] = useState([])

  const handlePublishClick = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      // Handle authentication error
      Navigate('/login')
    }

    if (!isEdit && !file) {
      // Set an error message indicating that a file selection is required for new posts
      setErrorMessage(['Please select an image file before submitting.'])
      setTimeout(() => {
        setErrorMessage([])
      }, 3000)
      return // Exit the function early
    }

    try {
      let img = ''
      let thumbnail = ''
      if (file) {
        const uploadResult = await upload()
        img = uploadResult?.filename || ''
        thumbnail = uploadResult?.thumbnail || ''
      }

      const postData = {
        title,
        desc,
        cat,
        ...(img && { img }),
        ...(thumbnail && { thumbnail }),
        selectedThemes
      }

      if (isEdit) {
        // Update existing post
        await axios.put(`/posts/${postId}`, postData)
        Navigate(`/post/${postId}`)
      } else {
        // Create new post
        postData.date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        await axios.post('/posts', postData)
        Navigate('/')
      }
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data && err.response.data.errors) {
        // Map each error to its message and update the state
        const errorMessages = err.response.data.errors.map(error => error.msg)
        setErrorMessage(errorMessages)
      } else {
        // Handle other errors (network issues, etc.)
        setErrorMessage(['An unexpected error occurred. Please try again.'])
      }
      setTimeout(() => {
        setErrorMessage([])
      }, 3000)
    }
  }

  return (
    <div className='update-post-container'>
      <div className='update-post-wrapper'>
        {/* Page Header */}
        <div className='update-post-header'>
          <div className='header-content'>
            <div className='header-icon'>
              <i className={isEdit ? 'fas fa-edit' : 'fas fa-plus-circle'}></i>
            </div>
            <div className='header-text'>
              <h1>{isEdit ? 'Update Your Post' : 'Share Your Travel Adventure'}</h1>
              <p>{isEdit ? 'Refine your travel experience and inspire others' : 'Create captivating content that connects travelers worldwide'}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='update-content-grid'>
          {/* Left Column - Main Form */}
          <div className='update-main-section'>
            {/* Title Section */}
            <div className='form-section'>
              <div className='section-header'>
                <i className='fas fa-heading'></i>
                <h3>Post Title</h3>
              </div>
              <input
                className='update-title-input'
                type='text'
                value={title}
                placeholder='Give your post an engaging title...'
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Content Editor Section */}
            <div className='form-section'>
              <div className='section-header'>
                <i className='fas fa-align-left'></i>
                <h3>Post Content</h3>
              </div>
              <div className='quill-editor-wrapper'>
                <ReactQuill
                  theme='snow'
                  placeholder='Share your travel experiences, tips, and memories...'
                  value={desc}
                  onChange={setDesc}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className='form-section'>
              <div className='section-header'>
                <i className='fas fa-image'></i>
                <h3>Featured Image</h3>
              </div>
              <input
                required
                style={{ display: 'none' }}
                type='file'
                name='file'
                id='file'
                onChange={handleFileChange}
              />
              <label className='file-upload-area' htmlFor='file'>
                <div className='upload-icon'>
                  <i className='fas fa-cloud-upload-alt'></i>
                </div>
                <div className='upload-text'>
                  <span className='upload-title'>Click to upload image</span>
                  <span className='upload-subtitle'>JPG, PNG up to 10MB</span>
                </div>
              </label>
              {file && (
                <div className='file-selected'>
                  <i className='fas fa-check-circle'></i>
                  <span>{file.name}</span>
                </div>
              )}
              {uploadError && (
                <div className='file-error'>
                  <i className='fas fa-exclamation-triangle'></i>
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className='update-sidebar-section'>
            {/* Region Selection */}
            <div className='sidebar-card'>
              <div className='sidebar-card-header'>
                <i className='fas fa-globe'></i>
                <h3>Select Region</h3>
              </div>
              <div className='sidebar-card-body'>
                <select
                  className='region-select'
                  value={cat}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value=''>Choose a region...</option>
                  <option value='Asia'>🌏 Asia</option>
                  <option value='America'>🇺🇸 America</option>
                  <option value='Europe'>🏰 Europe</option>
                  <option value='Africa'>🦁 Africa</option>
                  <option value='Caribbean'>🏖️ Caribbean</option>
                  <option value='Middleeast'>🕌 Middle East</option>
                  <option value='Other'>🌍 Other</option>
                </select>
              </div>
            </div>

            {/* Themes Selection */}
            <div className='sidebar-card'>
              <div className='sidebar-card-header'>
                <i className='fas fa-tags'></i>
                <h3>Select Themes</h3>
              </div>
              <div className='sidebar-card-body'>
                <div className='theme-options'>
                  {themeCheckboxes}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button className='update-submit-btn' onClick={handlePublishClick}>
              <i className={isEdit ? 'fas fa-save' : 'fas fa-rocket'}></i>
              <span>{isEdit ? 'Update Post' : 'Publish Adventure'}</span>
            </button>

            {/* Error Messages */}
            {errorMessages.length > 0 && (
              <div className='error-messages'>
                {errorMessages.map((error, index) => (
                  <div key={index} className='error-alert'>
                    <i className='fas fa-exclamation-circle'></i>
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPost
