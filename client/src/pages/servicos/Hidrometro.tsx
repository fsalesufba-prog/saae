import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import api from '../../services/api';

const Hidrometro: React.FC = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get('/hydrometers');
        setContent(response.data.content);
      } catch (error) {
        console.error('Erro ao carregar informações:', error);
      }
    };

    loadData();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Seu Hidrômetro | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Serviços', link: '/servicos' },
          { label: 'Seu Hidrômetro' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Seu Hidrômetro</h1>
          <div className="hydrometer-content">
            <p>{content}</p>
            
            <div className="hydrometer-info">
              <h2>Como ler seu hidrômetro</h2>
              <p>O hidrômetro possui um mostrador com números que indicam o consumo em metros cúbicos (m³).</p>
              
              <h2>Verificando vazamentos</h2>
              <p>Feche todas as torneiras e observe se o hidrômetro continua girando - se sim, pode haver vazamento.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Hidrometro;