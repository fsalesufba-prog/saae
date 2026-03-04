import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import api from '../../services/api';

const Missao: React.FC = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const loadPage = async () => {
      try {
        const response = await api.get('/pages/missao');
        setContent(response.data.content);
      } catch (error) {
        console.error('Erro ao carregar missão:', error);
      }
    };

    loadPage();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Missão | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'SAAE', link: '/saae' },
          { label: 'Missão' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </Layout>
  );
};

export default Missao;