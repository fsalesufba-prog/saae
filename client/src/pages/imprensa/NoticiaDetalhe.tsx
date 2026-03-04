import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaCalendarAlt, FaUser, FaEye } from 'react-icons/fa';
import api from '../../services/api';

interface NewsDetail {
  id: number;
  title: string;
  content: string;
  image_path: string;
  author: string;
  publish_date: string;
  views: number;
}

const NoticiaDetalhe: React.FC = () => {
  const { slug } = useParams();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await api.get(`/news/${slug}`);
        setNews(response.data);
      } catch (error) {
        console.error('Erro ao carregar notícia:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="loading">Carregando...</div>
      </Layout>
    );
  }

  if (!news) {
    return (
      <Layout>
        <div className="not-found">Notícia não encontrada</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{news.title} | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Imprensa', link: '/imprensa' },
          { label: 'Notícias', link: '/imprensa/noticias' },
          { label: news.title }
        ]}
      />

      <article className="news-detail">
        <div className="container">
          <h1>{news.title}</h1>
          
          <div className="news-detail-meta">
            <span><FaUser /> {news.author}</span>
            <span><FaCalendarAlt /> {new Date(news.publish_date).toLocaleDateString('pt-BR')}</span>
            <span><FaEye /> {news.views} visualizações</span>
          </div>

          {news.image_path && (
            <img 
              src={news.image_path} 
              alt={news.title} 
              className="news-detail-image"
            />
          )}

          <div 
            className="news-detail-content"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </article>
    </Layout>
  );
};

export default NoticiaDetalhe;