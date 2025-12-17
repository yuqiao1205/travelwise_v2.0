import React, { useState, useRef } from 'react'
import axios from 'axios' // Import Axios
import './vision.css'

const Vision = () => {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (!file) {
      setError('')
      setImage(null)
      setImageUrl('')
      return
    }

    setImage(file)

    try {
      const reader = new FileReader()
      reader.onload = () => {
        if (file.type.startsWith('image/')) {
          setImageUrl(reader.result)
          setError('')
        } else {
          setImageUrl('')
          setError('Invalid file type')
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error:', error)
      console.log('file.type:', file)
      setError('Failed to load image')
    }
  }

  const submitImage = async () => {
    if (!image) {
      setError('Please upload an image')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', image)

      const response = await axios.post('/vision', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.error) {
        throw new Error(response.data.error)
      }

      setDescription(response.data.answer)
    } catch (error) {
      console.error('Error:', error)
      setError(error.response.data.error || error.message)
    }
  }

  const refreshInput = () => {
    setImage(null)
    setImageUrl('')
    setError('')
    setDescription('') // clear the description as well
  }

  const handleSelectFile = () => {
    fileInputRef.current.click()
    console.log('fileInputRef.current:', fileInputRef.current)
  }

  return (
    <>
      <div className="vision-container">
        <div className="vision-header">
          <h1>Destination Image Analysis</h1>
          <p>Upload an image to discover where it was taken</p>
        </div>

        <div className="vision-content">
          <div className="upload-section">
            <div className="upload-card">
              <div className="upload-header">
                <h3>Upload Your Image</h3>
                <p>Select a destination photo to analyze</p>
              </div>

              <div className="upload-area">
                <input
                  type='file'
                  id='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />

                {!imageUrl ? (
                  <div className="upload-placeholder" onClick={handleSelectFile}>
                    <div className="upload-icon">
                      <span>📷</span>
                    </div>
                    <p>Click to select an image</p>
                    <small>PNG, JPG, JPEG up to 10MB</small>
                  </div>
                ) : (
                  <div className="image-preview">
                    <img src={imageUrl} alt="Preview" />
                    <button className="change-image-btn" onClick={handleSelectFile}>
                      Change Image
                    </button>
                  </div>
                )}
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="upload-actions">
                <button
                  className="analyze-btn"
                  onClick={submitImage}
                  disabled={!imageUrl}
                >
                  Analyze Location
                </button>
                <button className="reset-btn" onClick={refreshInput}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="results-section">
            <div className="results-card">
              <div className="results-header">
                <h3>Location Analysis</h3>
              </div>
              <div className="results-content">
                {description ? (
                  <div
                    className="analysis-text"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : (
                  <div className="results-placeholder">
                    <div className="placeholder-icon">🔍</div>
                    <p>{'Upload an image and click "Analyze Location" to see the results here'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Vision
