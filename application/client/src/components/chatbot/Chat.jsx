import React, { useState, useRef } from 'react'
import Conversation from './Conversation'
import { SSE } from 'sse.js'
import './chat.css'
import { useLocation } from 'react-router-dom'

function Chat () {
  const location = useLocation()
  console.log(location.pathname) // result: '/secondpage'

  // Extract base URL using window.location
  const baseURL = window.location.origin
  console.log(baseURL)

  const [messages, setMessages] = useState([
    { content: 'Hello! How can I help you today?', role: 'assistant' }
  ])

  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)
  const inputRef = useRef(null)

  const handleSendMessage = async (newMessage) => {
    setIsTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    // Add the new message to the messages state
    const newMessages = [...messages, { content: newMessage, role: 'user' }, { content: '...', role: 'assistant' }]
    setMessages(newMessages)

    return new Promise((resolve, reject) => {
      try {
        const payload = {
          messages: newMessages
        }

        // JSON payload of messages
        const source = new SSE(baseURL + '/chat',
          {
            headers: { 'Content-Type': 'application/json' },
            payload: JSON.stringify(payload),
            method: 'POST',
            start: false,
            debug: true
          })

        source.addEventListener('message', (event) => {
          // extract json from event.data
          const botUpdate = JSON.parse(event.data)
          // append the new datetime to the existing datetimes array

          // message is the same as before, but the content of the last message
          // is updated to concatenate botUpdate.content
          // consume stream of SSE events and update the messages state
          const updatedMessages = [...newMessages]
          updatedMessages[updatedMessages.length - 1].content += botUpdate.content
          setMessages(updatedMessages)
          console.log('message:', botUpdate.content)

          // Clear previous timeout and set new one
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
          }
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false)
          }, 1000) // 1 second after last message
        })

        source.addEventListener('error', (event) => {
          console.log('SSE error:', event)
          source.close() // Ensure to close the connection if not done automatically
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
          }
          setIsTyping(false)
          reject(new Error('SSE connection error'))
        })

        source.addEventListener('close', () => {
          console.log('SSE connection closed')
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
          }
          setIsTyping(false)
          resolve()
        })

        source.stream()
      } catch (error) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        setIsTyping(false)
        reject(error)
      }
    }).then(() => {
    // This part will execute after the promise is resolved, i.e., after the connection closes
      console.log('All messages have been received')
    }).catch((error) => {
      console.error('An error occurred:', error)
    })
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e.target.value)
      e.target.value = '' // Clear the input field
    }
  }

  const handleSendClick = () => {
    if (inputRef.current && inputRef.current.value.trim()) {
      handleSendMessage(inputRef.current.value)
      inputRef.current.value = '' // Clear the input field
    }
  }

  return (
    <>
      {/* <RightBar/> */}
      <div className="chat-container">
        <div className="sender-name">
          <Conversation messages={messages} isTyping={isTyping} />
        </div>
        <div className="input-container">
          <input ref={inputRef} className='chat-input'
            type="text"
            placeholder="Type your message..."
            onKeyDown={handleInputKeyDown}
            aria-label="Type your message"
          />
          <button className="emoji-button" onClick={() => {
            if (inputRef.current) inputRef.current.value += '😊'
          }} aria-label="Add emoji">
            😀
          </button>
          <button className="send-button" onClick={handleSendClick} aria-label="Send message">
            Send
          </button>
        </div>
      </div>
    </>
  )
}

export default Chat
