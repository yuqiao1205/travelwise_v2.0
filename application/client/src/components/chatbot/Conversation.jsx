import React, { useEffect, useRef } from 'react'
import './conversation.css' // Import the conversation.css file
import PropTypes from 'prop-types'
import Aibot from '../../img/aibot.jpg'

function Conversation ({ messages, isTyping }) {
  // Create a ref for the latest message
  const endOfMessagesRef = useRef(null)
  // Create a ref for the messages container
  const messagesContainerRef = useRef(null)

  // Scroll into view whenever messages update, but only if user is near bottom
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container && endOfMessagesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100 // 100px threshold

      if (isNearBottom) {
        endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [messages])

  return (
    <div className='chatbot-body' ref={messagesContainerRef}>
      {messages.map((message, index) => {
        // Determine if the message was received or sent
        const isReceivedMessage = message.role === 'assistant'
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        return (
          <div key={index} className={isReceivedMessage ? 'message-received-wrapper message-wrapper' : 'message-sent-wrapper message-wrapper'}>
            {isReceivedMessage ? (
              <img src={Aibot} alt="Bot" className="message-avatar" />
            ) : (
              <div className="message-avatar user-avatar">👤</div>
            )}
            <div className={isReceivedMessage ? 'message-received' : 'message-sent'}>
              <p className='conversation-message'>
                {message.content}
              </p>
              <span className="message-timestamp">{timestamp}</span>
            </div>
          </div>
        )
      })}
      {isTyping && (
        <div className="message-received-wrapper message-wrapper">
          <img src={Aibot} alt="Bot" className="message-avatar" />
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      {/* Add a ref to the last element */}
      <div ref={endOfMessagesRef} />
    </div>
  )
}

Conversation.propTypes = {
  messages: PropTypes.array.isRequired,
  isTyping: PropTypes.bool
}

export default Conversation
