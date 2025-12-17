import React, { useState } from 'react'
import axios from 'axios'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import SendIcon from '@mui/icons-material/Send'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import './subscribeform.css'

const SubscribeForm = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const showMessage = (msg, type) => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 5000)
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    if (!email.trim()) {
      setIsSubmitting(false)
      return showMessage('Email is required.', 'error')
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setIsSubmitting(false)
      return showMessage('Invalid email format.', 'error')
    }

    try {
      await axios.post('/subscriptions/subscribe', { email })
      showMessage('Subscribed successfully! Thank you for subscribing!', 'success')
    } catch (error) {
      if (error.response && error.response.status === 409) {
        showMessage('You are already subscribed with this email.', 'error')
      } else {
        showMessage('Subscription failed. Please try again.', 'error')
      }
    } finally {
      setEmail('')
      setIsSubmitting(false)
    }
  }

  const handleCancel = (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      return showMessage('Please enter your email to unsubscribe.', 'error')
    }

    setIsSubmitting(true)
    setMessage('')

    axios.delete('/subscriptions/unsubscribe', { data: { email } })
      .then(() => {
        showMessage('Unsubscribed successfully! Thank you for being with us.', 'success')
      })
      .catch(error => {
        if (error.response) {
          showMessage(`Unsubscription failed: ${error.response.data.message}`, 'error')
        } else {
          showMessage('Unsubscription failed. Please try again.', 'error')
        }
      })
      .finally(() => {
        setEmail('')
        setIsSubmitting(false)
      })
  }

  return (
    <section className='subscribe-section'>
      <div className='subscribe-background'>
        <div className='subscribe-orb subscribe-orb-1'></div>
        <div className='subscribe-orb subscribe-orb-2'></div>
        <div className='subscribe-orb subscribe-orb-3'></div>
      </div>
      
      <div className='subscribe-content'>
        <div className='subscribe-icon-container'>
          <NotificationsActiveIcon className='subscribe-bell-icon' />
          <MailOutlineIcon className='subscribe-mail-icon' />
        </div>
        
        <h2 className='subscribe-title'>Stay in the Loop</h2>
        <p className='subscribe-subtitle'>
          Get the newest travel stories, tips, and inspiration delivered straight to your inbox
        </p>
        
        <form className='subscribe-form' onSubmit={handleSubscribe}>
          <div className='subscribe-input-group'>
            <div className='subscribe-input-wrapper'>
              <MailOutlineIcon className='input-icon' />
              <input
                type='email'
                className='subscribe-input'
                placeholder='Enter your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <button 
              className='subscribe-btn' 
              type='submit' 
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
              <SendIcon className='btn-icon' />
            </button>
          </div>
          
          <button 
            className='unsubscribe-link' 
            onClick={handleCancel} 
            disabled={isSubmitting}
            type='button'
          >
            <UnsubscribeIcon className='unsub-icon' />
            <span>Unsubscribe from newsletter</span>
          </button>
        </form>
        
        {message && (
          <div className={`subscribe-message ${messageType}`}>
            {messageType === 'success' ? (
              <CheckCircleIcon className='message-icon' />
            ) : (
              <ErrorIcon className='message-icon' />
            )}
            <span>{message}</span>
          </div>
        )}
        
        <p className='subscribe-privacy'>
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}

export default SubscribeForm
