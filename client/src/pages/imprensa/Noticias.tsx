import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
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

const Noticias: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await api.get('/news');
        setNews(response.data);
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Notícias | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Imprensa', link: '/imprensa' },
          { label: 'Notícias' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Notícias</h1>
          
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="news-list">
              {news.map(item => (
                <article key={item.id} className="news-list-item">
                  {item.image_path && (
                    <img 
                      src={item.image_path} 
                      alt={item.title} 
                      className="news-list-image"
                    />
                  )}
                  <div className="news-list-content">
                    <h2>{item.title}</h2>
                    <p>{item.summary}</p>
                    <div className="news-list-meta">
                      <span>
                        <FaUser /> {item.author}
                      </span>
                      <span>
                        <FaCalendarAlt /> {new Date(item.publish_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <Link to={`/imprensa/noticias/${item.slug}`} className="read-more">
                      Leia mais
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Noticias;