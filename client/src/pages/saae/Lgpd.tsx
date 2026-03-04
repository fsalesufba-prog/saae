import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import api from '../../services/api';

const Lgpd: React.FC = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const loadPage = async () => {
      try {
        const response = await api.get('/pages/lgpd');
        setContent(response.data.content);
      } catch (error) {
        console.error('Erro ao carregar LGPD:', error);
      }
    };

    loadPage();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>LGPD - Lei Geral de Proteção de Dados | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'SAAE', link: '/saae' },
          { label: 'LGPD' }
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

export default Lgpd;