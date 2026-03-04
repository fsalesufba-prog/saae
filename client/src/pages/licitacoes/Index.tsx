import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaSearch, FaCalendar, FaTag, FaFilePdf } from 'react-icons/fa';
import api from '../../services/api';

interface Bid {
  id: number;
  process_number: string;
  modality: string;
  object: string;
  status: string;
  publish_date: string;
  opening_date: string;
  document_path: string;
}

const Licitacoes: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBids = async () => {
      try {
        const response = await api.get('/bids');
        setBids(response.data);
      } catch (error) {
        console.error('Erro ao carregar licitações:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBids();
  }, []);

  const filteredBids = bids.filter(bid =>
    bid.process_number.toLowerCase().includes(search.toLowerCase()) ||
    bid.object.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <Helmet>
        <title>Licitações | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Licitações' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Licitações</h1>

          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Pesquisar licitações..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="bids-list">
              {filteredBids.map(bid => (
                <div key={bid.id} className="bid-item">
                  <div className="bid-header">
                    <span className={`bid-status status-${bid.status}`}>
                      {bid.status}
                    </span>
                    <span className="bid-number">{bid.process_number}</span>
                  </div>
                  
                  <p className="bid-object">{bid.object}</p>
                  
                  <div className="bid-details">
                    <span>
                      <FaCalendar /> Publicação: {new Date(bid.publish_date).toLocaleDateString('pt-BR')}
                    </span>
                    <span>
                      <FaCalendar /> Abertura: {new Date(bid.opening_date).toLocaleString('pt-BR')}
                    </span>
                    <span>
                      <FaTag /> {bid.modality}
                    </span>
                  </div>

                  {bid.document_path && (
                    <a 
                      href={bid.document_path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      <FaFilePdf /> Download do Edital
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Licitacoes;