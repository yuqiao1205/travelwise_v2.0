import React, { useState, useEffect, useContext } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { AuthContext } from '../../context/authContext'
import './newPost.css'
import { themes } from '../../config/themes.js'
import { themeCheckboxes } from './postlib'

const UpdatePost = () => {
  console.log('post component is rendering')
  const [state, setState] = useState(useLocation().state)
  console.log(state)

  const postId = new URLSearchParams(useLocation().search).get('edit')

  const [previousFilename, setPreviousFilename] = useState('')
  const [previousThumbnail, setPreviousThumbnail] = useState('')

  useEffect(() => {
    if (state) {
      setPreviousFilename(state.img)
      setPreviousThumbnail(state.thumbnail)
    }
  }, [state])

  useEffect(() => {
    if (postId) {
      // Fetch the post from the server
      const fetchPost = async () => {
        try {
          const res = await axios.get(`/posts/${postId}`)
          console.log('Fetched post:', res.data)
          // Set the state with the fetched post
          setState(res.data)
        } catch (err) {
          console.error('Error fetching post:', err)
          // Handle error if needed
        }
      }
      fetchPost()
    }
  }, [postId])

  const tagsToThemes = (state) => {
    console.log('state:', state)
    const tags = state?.tags
    // tags is a comma separated string of theme ids, e.g '1, 3, 7'
    // output should list of theme names ['Urban', 'Nature', 'Food']
    // use the themes array from the config file to translate the ids to names
    console.log('tags:', tags)
    if (!tags) return []
    const ids = tags.split(',').map(Number)
    console.log('ids:', ids)
    const selectedThemes = ids.map(id => themes.find(theme => theme.tid === id).name)
    console.log('selectedThemes:', selectedThemes)
    return selectedThemes
  }

  // if state is not null then use state.title else use empty string means needs add new post
  const [desc, setDesc] = useState(state?.desc || '')
  const [title, setTitle] = useState(state?.title || '')
  const [file, setFile] = useState(state?.img || null)
  const [cat, setCategory] = useState(state?.cat || '')
  const [selectedThemes, setSelectedThemes] = useState(state !== undefined ? tagsToThemes(state) : []) // Add selected themes

  const { currentUser } = useContext(AuthContext)

  // Add authentication state
  const [isAuthenticated] = useState(!!currentUser)

  const defaultImageUrl = 'https://picsum.photos/id/16/300'
  // const [error, setError] = useState('');

  const navigate = useNavigate()

  const parseToIntArray = (str) => {
    // Check if str is a string and not empty
    if (typeof str === 'string' && str.trim() !== '') {
      // Split the input string by commas (,) to create an array of substrings
      const substrings = str.split(',')

      // Use the map function to convert each substring into an integer
      const intArray = substrings.map(function (substring) {
        return parseInt(substring, 10) // Use parseInt to parse each substring as an integer
      })

      return intArray
    } else {
      // If str is not a string or is empty, return an empty array
      return []
    }
  }

  useEffect(() => {
    // Check if state has selectedThemes and if it's an array
    console.log('Current State1:', state)
    console.log('Current State2:', state?.tags)
    const tags = parseToIntArray(state?.tags)
    console.log('Current State3:', Array.isArray(tags))
    if (tags && Array.isArray(tags)) {
      console.log('Selected Themes:', tags)
      // Convert theme IDs to theme names
      const loadedThemes = tags.map(tid =>
        themes.find(theme => theme.tid === tid)?.name
      ).filter(Boolean) // Remove any undefined entries
      console.log('Loaded themes:', loadedThemes)
      setSelectedThemes(loadedThemes)
    }
  }, [state])

  const handleThemeChange = (themeId) => {
    const themeName = themes.find(theme => theme.tid === themeId)?.name
    if (!themeName) return // Theme not found

    setSelectedThemes(prevThemes => {
      if (prevThemes.includes(themeName)) {
        return prevThemes.filter(name => name !== themeName)
      } else {
        return [...prevThemes, themeName]
      }
    })
  }

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
    if (uploadError) {
      const timer = setTimeout(() => {
        setUploadError('') // Clear the error message after 3 seconds
      }, 3000)

      return () => clearTimeout(timer) // Cleanup the timer
    }
  }, [uploadError])

  const [errorMessages, setErrorMessage] = useState([])

  const handlePublishClick = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Check if a file has been selected
    if (!file) {
    // Set an error message indicating that a file selection is required
      setErrorMessage(['Please select an image file before submitting.'])
      setTimeout(() => {
        setErrorMessage([])
      }, 3000)
      return // Exit the function early
    }

    const isNotNewFile = !(file && file !== previousFilename)
    // if file is null then upload file and get url else use default image url

    const uploadFunc = async () => {
      if (isNotNewFile) {
        return [previousFilename, previousThumbnail]
      } else {
        const uploadResult = await upload()
        return [uploadResult?.filename || defaultImageUrl, uploadResult?.thumbnail || defaultImageUrl]
      }
    }

    const [imgUrl, thumbnailUrl] = await uploadFunc()

    const postData = {
      title,
      desc,
      cat,
      img: isNotNewFile ? previousFilename : imgUrl || file || '',
      thumbnail: isNotNewFile ? previousThumbnail : thumbnailUrl || file || '',

      // img: imgUrl || file || '',
      // thumbnail: thumbnailUrl || file || '',
      date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      selectedThemes // Add selected themes
    }

    try {
      if (state) {
        // Update existing post
        await axios.put(`/posts/${state.id}`, postData)

        navigate(`/singlepost/${state.id}`)
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

  return (
    <div className='update-post-container'>
      <div className='update-post-wrapper'>
        {/* Page Header */}
        <div className='update-post-header'>
          <div className='header-content'>
            <div className='header-icon'>
              <i className='fas fa-edit'></i>
            </div>
            <div className='header-text'>
              <h1>Update Your Post</h1>
              <p>Refine your travel story and share your experience with the world</p>
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
                placeholder='Enter a captivating title for your post'
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
                  placeholder='Share your travel experiences, memorable moments, and helpful tips...'
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
                  <span className='upload-subtitle'>PNG, JPG, JPEG (Max 5MB)</span>
                </div>
              </label>
              {file && (
                <div className='file-selected'>
                  <i className='fas fa-check-circle'></i>
                  <span>{typeof file === 'string' ? file : file.name}</span>
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
                  {themeCheckboxes(themes, selectedThemes, handleThemeChange)}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button className='update-submit-btn' onClick={handlePublishClick}>
              <i className='fas fa-paper-plane'></i>
              <span>Update Post</span>
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

export default UpdatePost
