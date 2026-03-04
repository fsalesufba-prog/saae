import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { 
  FaUsers, 
  FaNewspaper, 
  FaImages, 
  FaGavel,
  FaFileAlt,
  FaEye 
} from 'react-icons/fa';

interface Stats {
  users: number;
  news: number;
  galleries: number;
  bids: number;
  pages: number;
  views: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    news: 0,
    galleries: 0,
    bids: 0,
    pages: 0,
    views: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.users}</span>
            <span className="stat-label">Usuários</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaNewspaper />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.news}</span>
            <span className="stat-label">Notícias</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaImages />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.galleries}</span>
            <span className="stat-label">Galerias</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaGavel />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.bids}</span>
            <span className="stat-label">Licitações</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaFileAlt />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.pages}</span>
            <span className="stat-label">Páginas</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaEye />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.views}</span>
            <span className="stat-label">Visualizações</span>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Atividade Recente</h2>
        {/* Lista de atividades recentes */}
      </div>
    </div>
  );
};

export default Dashboard;