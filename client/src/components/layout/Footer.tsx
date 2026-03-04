import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <div className="footer-logo">
              <img src="/images/logo-white.png" alt="SAAE Linhares" />
            </div>
            <div className="footer-social">
              <a href="https://www.facebook.com/p/SAAE-Linhares-100089921157025/" target="_blank">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/saaelinhares/" target="_blank">
                <FaInstagram />
              </a>
            </div>
          </div>
          
          <div className="footer-info">
            <h4>Atendimento</h4>
            <p>
              <FaClock /> Segunda a sexta, das 07:30 às 16:30
            </p>
          </div>
          
          <div className="footer-info">
            <h4>Endereço</h4>
            <p>
              <FaMapMarkerAlt /> Avenida Barra de São Francisco, 1137
              <br />Colina, Linhares/ES
            </p>
          </div>
          
          <div className="footer-info">
            <h4>Contato</h4>
            <p>
              <FaPhone /> (27) 2103-1311
            </p>
            <p>
              <FaEnvelope /> atendimento@saaelinhares.com.br
            </p>
            <Link to="/atendimento/contato" className="footer-link">
              Fale conosco
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;