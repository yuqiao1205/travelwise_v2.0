import Chat from '../../components/chatbot/Chat'
import './chatPage.css'
import React from 'react'
import Aibot from '../../img/aibot.jpg'
import 'react-chatbot-kit/build/main.css'

const ChatPage = () => {
  return (
    <>
      <div className="chatbot-container">
        <div className="chat-header">
          <div className="bot-info">
            <img src={Aibot} alt="Travel Assistant" className="bot-avatar" />
            <div className="bot-details">
              <h3>Travel Assistant</h3>
              <span className="online-status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
        </div>

        <div className="chat-content">
          <Chat />
        </div>
      </div>
    </>
  )
}

export default ChatPage
