import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import api from '../../services/api';

interface News {
  id: number;
  title: string;
  summary: string;
  image_path: string;
  author: string;
  publish_date: string;
  slug: string;
}

const LatestNews: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await api.get('/news/latest?limit=3');
        setNews(response.data);
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  if (loading) {
    return <div className="loading">Carregando notícias...</div>;
  }

  return (
    <div className="latest-news">
      <h2 className="section-title">Últimas Notícias</h2>
      <div className="news-grid">
        {news.map(item => (
          <article key={item.id} className="news-card">
            {item.image_path && (
              <img 
                src={item.image_path} 
                alt={item.title} 
                className="news-image"
              />
            )}
            <div className="news-content">
              <h3 className="news-title">{item.title}</h3>
              <p className="news-summary">{item.summary}</p>
              <div className="news-meta">
                <span>
                  <FaUser /> {item.author}
                </span>
                <span>
                  <FaCalendarAlt /> {new Date(item.publish_date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <Link to={`/imprensa/noticias/${item.slug}`} className="read-more">
                Leia mais <FaArrowRight />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default LatestNews;