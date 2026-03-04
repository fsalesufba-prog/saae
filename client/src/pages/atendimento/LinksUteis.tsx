import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaExternalLinkAlt } from 'react-icons/fa';
import api from '../../services/api';

interface Link {
  id: number;
  title: string;
  url: string;
  description: string;
  icon: string;
}

const LinksUteis: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const response = await api.get('/useful-links');
        setLinks(response.data);
      } catch (error) {
        console.error('Erro ao carregar links:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLinks();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Links Úteis | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Atendimento', link: '/atendimento' },
          { label: 'Links Úteis' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Links Úteis</h1>
          
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="links-grid">
              {links.map(link => (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link-card"
                >
                  <span className="link-icon">{link.icon}</span>
                  <div className="link-info">
                    <h3>{link.title} <FaExternalLinkAlt /></h3>
                    <p>{link.description}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LinksUteis;