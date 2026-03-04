import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import api from '../../services/api';

interface Tip {
  id: number;
  title: string;
  tip: string;
  icon: string;
}

const DicasConsumo: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTips = async () => {
      try {
        const response = await api.get('/consumption-tips');
        setTips(response.data);
      } catch (error) {
        console.error('Erro ao carregar dicas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Dicas de Consumo | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Serviços', link: '/servicos' },
          { label: 'Dicas de Consumo' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Dicas de Consumo</h1>
          
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="tips-grid">
              {tips.map(tip => (
                <div key={tip.id} className="tip-card">
                  <span className="tip-icon">{tip.icon}</span>
                  <h3>{tip.title}</h3>
                  <p>{tip.tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DicasConsumo;