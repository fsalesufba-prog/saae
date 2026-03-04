import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';

interface News {
  id: number;
  title: string;
  author: string;
  publish_date: string;
  published: boolean;
  views: number;
}

const NewsList: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta notícia?')) {
      return;
    }

    try {
      await api.delete(`/news/${id}`);
      loadNews();
    } catch (error) {
      console.error('Erro ao excluir notícia:', error);
    }
  };

  const togglePublish = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/news/${id}`, { published: !currentStatus });
      loadNews();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'title', title: 'Título' },
    { key: 'author', title: 'Autor' },
    { 
      key: 'publish_date', 
      title: 'Data',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
    {
      key: 'published',
      title: 'Status',
      render: (published: boolean, row: News) => (
        <button 
          className={`status-badge ${published ? 'published' : 'draft'}`}
          onClick={() => togglePublish(row.id, published)}
        >
          {published ? 'Publicado' : 'Rascunho'}
        </button>
      )
    },
    {
      key: 'views',
      title: 'Visualizações',
      render: (views: number) => (
        <span><FaEye /> {views}</span>
      )
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: News) => (
        <div className="actions">
          <Link to={`/imprensa/noticias/${row.id}`} target="_blank" className="btn-view">
            <FaEye />
          </Link>
          <Link to={`/admin/news/edit/${row.id}`} className="btn-edit">
            <FaEdit />
          </Link>
          <button onClick={() => handleDelete(row.id)} className="btn-delete">
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="news-page">
      <div className="page-header">
        <h1>Notícias</h1>
        <Link to="/admin/news/create" className="btn-primary">
          <FaPlus /> Nova Notícia
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={news}
        loading={loading}
      />
    </div>
  );
};

export default NewsList;