import './login.css'
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'

const Login = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  })
  const [err, setError] = useState(null)

  const navigate = useNavigate()

  const { login } = useContext(AuthContext)

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(inputs)
      navigate('/')
    } catch (err) {
      setError(err.response.data)
    }
    setTimeout(() => {
      setError('')
    }, 3000)
  }
  return (

    <div className='login'>
      <div className='login-container'>
        <div className='login-form-section'>
          <div className='login-header'>
            <LoginOutlinedIcon className='login-icon' />
            <h1 className='loginTitle'>Welcome Back</h1>
            <p className='login-subtitle'>Sign in to your TravelWise account</p>
          </div>
          <form className='loginForm' onSubmit={handleSubmit}>
            <div className='input-group'>
              <div className='input-wrapper'>
                <PersonIcon className='input-icon' />
                <input
                  className='loginInput'
                  required
                  type='text'
                  placeholder='Enter your username'
                  name='username'
                  value={inputs.username}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='input-group'>
              <div className='input-wrapper'>
                <LockIcon className='input-icon' />
                <input
                  className='loginInput'
                  required
                  type='password'
                  placeholder='Enter your password'
                  name='password'
                  value={inputs.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button className='loginButton' type='submit'>Sign In</button>
            {err && <p className='errormessage'>{err}</p>}
            <div className='registerlink'>
              Do not have an account?
              <Link className='linktoreg' to='/register'> Create one</Link>
            </div>
            <div className='back-link'>
              <Link className='linktohome' to='/'>← Back to Home</Link>
            </div>
          </form>
        </div>
        <div className='login-image-section'>
          <div className='image-overlay'>
            <h2>Explore the World</h2>
            <p>Discover amazing destinations and create unforgettable memories</p>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Login
