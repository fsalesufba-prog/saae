import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaClock, FaTag } from 'react-icons/fa';
import api from '../../services/api';

interface Bid {
  id: number;
  process_number: string;
  modality: string;
  object: string;
  status: 'aberta' | 'homologada' | 'fracassada' | 'andamento';
  publish_date: string;
  opening_date: string;
}

const LatestBids: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBids = async () => {
      try {
        const response = await api.get('/bids/latest?limit=3');
        setBids(response.data);
      } catch (error) {
        console.error('Erro ao carregar licitações:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBids();
  }, []);

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'aberta': return 'status-aberta';
      case 'homologada': return 'status-homologada';
      case 'fracassada': return 'status-fracassada';
      default: return 'status-andamento';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'aberta': return 'Aberta';
      case 'homologada': return 'Homologada';
      case 'fracassada': return 'Fracassada';
      default: return 'Em Andamento';
    }
  };

  if (loading) {
    return <div className="loading">Carregando licitações...</div>;
  }

  return (
    <section className="bids-section">
      <h2 className="section-title">Últimas Licitações</h2>
      <div className="bids-grid">
        {bids.map(bid => (
          <div key={bid.id} className="bid-card">
            <span className={`bid-status ${getStatusClass(bid.status)}`}>
              {getStatusText(bid.status)}
            </span>
            <h3 className="bid-number">{bid.process_number}</h3>
            <p className="bid-object">{bid.object}</p>
            <div className="bid-meta">
              <span>
                <FaCalendar /> Publicação: {new Date(bid.publish_date).toLocaleDateString('pt-BR')}
              </span>
              <span>
                <FaClock /> Abertura: {new Date(bid.opening_date).toLocaleString('pt-BR')}
              </span>
              <span>
                <FaTag /> {bid.modality}
              </span>
            </div>
            <Link to={`/licitacoes/${bid.id}`} className="read-more">
              Ver detalhes
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestBids;