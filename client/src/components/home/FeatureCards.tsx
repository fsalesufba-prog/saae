import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaGlobe } from 'react-icons/fa';

const FeatureCards: React.FC = () => {
  return (
    <div className="feature-cards">
      <Link to="http://saaelinhares-es.portaltp.com.br/" target="_blank" className="feature-card">
        <h3>Portal da Transparência</h3>
        <p>Acesse informações sobre gestão pública, licitações, contratos e mais.</p>
        <span className="card-icon">
          <FaFileAlt />
        </span>
      </Link>

      <Link to="https://avsanegraph.com.br/av/lin" target="_blank" className="feature-card">
        <h3>Agência Virtual</h3>
        <p>Acesse sua conta, solicite serviços e acompanhe seu consumo online.</p>
        <span className="card-icon">
          <FaGlobe />
        </span>
      </Link>
    </div>
  );
};

export default FeatureCards;