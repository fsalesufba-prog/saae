import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const MiddleHeader: React.FC = () => {
  return (
    <header className="middle-header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="SAAE Linhares" />
        </Link>
        <div className="social-links">
          <a 
            href="https://www.facebook.com/p/SAAE-Linhares-100089921157025/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <FaFacebook />
          </a>
          <a 
            href="https://www.instagram.com/saaelinhares/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </header>
  );
};

export default MiddleHeader;