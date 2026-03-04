import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Tabs from '../../components/ui/Tabs';
import api from '../../services/api';

interface CipaSection {
  section: string;
  title: string;
  content: string;
}

const Cipa: React.FC = () => {
  const [sections, setSections] = useState<CipaSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCipa = async () => {
      try {
        const response = await api.get('/cipa');
        setSections(response.data);
      } catch (error) {
        console.error('Erro ao carregar CIPA:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCipa();
  }, []);

  const tabs = sections.map(section => ({
    id: section.section,
    label: section.title,
    content: <div dangerouslySetInnerHTML={{ __html: section.content }} />
  }));

  return (
    <Layout>
      <Helmet>
        <title>CIPA - Comissão Interna de Prevenção de Acidentes | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'SAAE', link: '/saae' },
          { label: 'CIPA' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>CIPA – Comissão Interna de Prevenção de Acidentes</h1>
          
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <Tabs tabs={tabs} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cipa;