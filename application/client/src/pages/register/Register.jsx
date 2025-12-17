import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import './register.css'


const Register = () => {
  const [inputs, setInputs] = useState({
    username: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({
    username: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const hasErrors = () => {
  // any one of the fields is not ''
    return Object.values(errors).some(err => err !== '')
  }

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputs(prev => ({
      ...prev,
      [name]: value
    }))
    // Validate inputs
    const newErrors = { ...errors }
    switch (name) {
    case 'username':
      newErrors.username = value.length < 1 ? 'Username can not be empty' : ''
      break
    case 'nickname':
      newErrors.nickname = value.length < 1 ? 'Nickname can not be empty' : ''
      break
    case 'email':
      newErrors.email = !/^\S+@\S+\.\S+$/.test(value) ? 'Invalid email address' : ''
      break
    case 'password':
      newErrors.password = value.length < 6 ? 'Password must be at least 6 characters long' : ''
      break
    case 'confirmPassword':
      newErrors.confirmPassword = value !== inputs.password ? 'Passwords do not match' : ''
      break
    default:
      break
    }
    setErrors(newErrors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (hasErrors()) {
      return
    }

    try {
      await axios.post('/auth/register', inputs)
      navigate('/login')
    } catch (err) {
      console.log(err)
      let otherErrorMessages = ''

      if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
        otherErrorMessages = err.response.data.errors.map(error => error.msg).join('\n')
      } else {
        otherErrorMessages = err.response.data || 'An error occurred'
      }
      setErrors(prev => ({
        ...prev,
        general: otherErrorMessages
      }))
      setTimeout(() => {
        setErrors(prev => ({
          ...prev,
          general: ''
        }))
      }, 3000)
    }
  }

  return (
    <div className='register'>
      <div className='register-container'>
        <div className='register-form-section'>
          <div className='register-header'>
            <PersonAddIcon className='register-icon' />
            <h1 className='registerTitle'>Join TravelWise</h1>
            <p className='register-subtitle'>Create your account to start your journey</p>
          </div>
          <form className='registerForm' onSubmit={handleSubmit}>
            <div className='input-group'>
              <div className='input-wrapper'>
                <PersonIcon className='input-icon' />
                <input
                  className='registerInput'
                  required
                  type='text'
                  placeholder='Enter your username'
                  name='username'
                  value={inputs.username}
                  onChange={handleChange}
                />
              </div>
              {errors.username && <p className='errorMessage'>{errors.username}</p>}
            </div>
            <div className='input-group'>
              <div className='input-wrapper'>
                <PersonIcon className='input-icon' />
                <input
                  className='registerInput'
                  required
                  type='text'
                  placeholder='Enter your nickname'
                  name='nickname'
                  value={inputs.nickname}
                  onChange={handleChange}
                />
              </div>
              {errors.nickname && <p className='errorMessage'>{errors.nickname}</p>}
            </div>
            <div className='input-group'>
              <div className='input-wrapper'>
                <EmailIcon className='input-icon' />
                <input
                  className='registerInput'
                  required
                  type='email'
                  placeholder='Enter your email'
                  name='email'
                  value={inputs.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className='errorMessage'>{errors.email}</p>}
            </div>
            <div className='input-group'>
              <div className='input-wrapper'>
                <LockIcon className='input-icon' />
                <input
                  className='registerInput'
                  required
                  type='password'
                  placeholder='Enter your password'
                  name='password'
                  value={inputs.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className='errorMessage'>{errors.password}</p>}
            </div>
            <div className='input-group'>
              <div className='input-wrapper'>
                <LockIcon className='input-icon' />
                <input
                  className='registerInput'
                  required
                  type='password'
                  placeholder='Confirm your password'
                  name='confirmPassword'
                  value={inputs.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && <p className='errorMessage'>{errors.confirmPassword}</p>}
            </div>
            <button className='registerButton' type='submit'>Create Account</button>
            {errors.general && <p className='errorMessage'>{errors.general}</p>}
            <div className='login-link'>
              Already have an account?
              <Link className='linktologin' to='/login'> Sign in</Link>
            </div>
            <div className='back-link'>
              <Link className='linktohome' to='/'>← Back to Home</Link>
            </div>
          </form>
        </div>
        <div className='register-image-section'>
          <div className='image-overlay'>
            <h2>Start Your Adventure</h2>
            <p>Join thousands of travelers sharing their experiences and discovering new destinations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
