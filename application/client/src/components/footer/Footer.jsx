import React from 'react'
import './footer.css'
// import SubscribeForm from '../subscribe/SubscribeForm'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <Container>
          <Row className="footer-main">
            <Col lg={4} md={6} className="footer-section">
              <div className="footer-logo">
                <h3>TravelWise</h3>
                <p className="tagline">Discover the world, one adventure at a time</p>
              </div>
              <p className="footer-description">
                Your ultimate guide to travel destinations worldwide. Find the best places to visit, stay, eat, and explore with our comprehensive travel insights.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </Col>
            <Col lg={4} md={6} className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Destinations</a></li>
                <li><a href="#">Travel Tips</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </Col>
            <Col lg={4} md={6} className="footer-section">
              <h4>Contact Info</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>San Francisco State University<br />Thornton Hall 543<br />1600 Holloway Ave<br />San Francisco, CA 94116</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>+1 (415) 123-4567</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>TravelWise@example.com</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-globe"></i>
                  <span>https://tp2024.westus3.cloudapp.azure.com</span>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="footer-bottom">
            <Col>
              <div className="footer-bottom-content">
                <p>&copy; 2024 TravelWise. All rights reserved.</p>
                <div className="footer-bottom-links">
                  <a href="#">Terms of Service</a>
                  <a href="#">Privacy Policy</a>
                  <a href="#">Cookie Policy</a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
