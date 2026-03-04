import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaHome } from 'react-icons/fa';

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Página não encontrada - SAAE Linhares</title>
      </Helmet>

      <div className="not-found">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Página não encontrada</h2>
          <p>A página que você está procurando não existe ou foi removida.</p>
          <Link to="/" className="btn-primary">
            <FaHome /> Voltar para o início
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;