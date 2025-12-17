// UserProfile.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './userProfile.css';
import Follower from '../../components/follower/Follower';
import { AuthContext } from '../../context/authContext';
import PropTypes from 'prop-types';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);
  // const { isAuthenticated, user: authUser } = useContext(AuthContext)

  const { isAuthenticated } = useContext(AuthContext);
  const DefaultUser1 = 'https://picsum.photos/id/501/100';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user profile');
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const numericUserId = Number(userId);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/usersetting/${numericUserId}`);
  };

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;


  return (
    <div className="userprofile-container">
      <div className="userprofile-card">
        <div className="profile-header">
          <h1 className="userprofile-title">Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-avatar-section">
            <div
              className="avatar-container"
              onClick={
                currentUser && currentUser.id === numericUserId
                  ? () => navigate(`/usersetting/${numericUserId}`)
                  : undefined
              }
            >
              <img
                className="profile-avatar"
                src={user.img || DefaultUser1}
                alt="Profile"
              />
              {currentUser && currentUser.id === numericUserId && (
                <div className="edit-overlay">
                  <span>Edit</span>
                </div>
              )}
            </div>
            <h2 className="profile-name">{user.username}</h2>
            <p className="profile-nickname">@{user.nickname}</p>
          </div>

          <div className="profile-details">
            <div className="profile-actions">
              {currentUser && currentUser.id === numericUserId && (
                <button className="profile-edit-btn" onClick={handleEdit}>
                  Edit Profile
                </button>
              )}
              <div className="follower-section">
                <Follower
                  userId={numericUserId}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            </div>

            <div className="profile-info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{user.fullname || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">City</span>
                <span className="info-value">{user.city || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Interests</span>
                <span className="info-value">{user.interest || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.number,
};

export default UserProfile;
