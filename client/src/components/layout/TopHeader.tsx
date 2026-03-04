import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaClock, FaFileAlt, FaEnvelope, FaSitemap } from 'react-icons/fa';

const TopHeader: React.FC = () => {
  return (
    <header className="top-header">
      <div className="container">
        <div className="top-info">
          <span>
            <FaClock /> Segunda a sexta das 07:30 às 16:30
          </span>
          <span>
            <FaPhone /> (27) 2103-1311
          </span>
        </div>
        <div className="top-links">
          <a 
            href="http://saaelinhares-es.portaltp.com.br/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaFileAlt /> Portal da Transparência
          </a>
          <Link to="/ouvidoria">
            <FaEnvelope /> Ouvidoria
          </Link>
          <Link to="/mapa-do-site">
            <FaSitemap /> Mapa do site
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;