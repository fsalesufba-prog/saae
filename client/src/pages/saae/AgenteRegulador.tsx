import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';

const AgenteRegulador: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Agente Regulador - ARIES | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'SAAE', link: '/saae' },
          { label: 'Agente Regulador - ARIES' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>CONTRATO | Agente Regulador – Aries</h1>
          
          <div className="contract-content">
            <h2>CONTRATO Nº 27/2022 | CONTRATO DE PROGRAMA PARA O EXERCÍCIO DE ATIVIDADE DE REGULAÇÃO</h2>
            
            <p>Texto do contrato será inserido aqui...</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgenteRegulador;