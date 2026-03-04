import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaPlus, FaEye } from 'react-icons/fa';

interface Page {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  updated_at: string;
}

const PagesList: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const response = await api.get('/pages');
      setPages(response.data);
    } catch (error) {
      console.error('Erro ao carregar páginas:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/pages/${id}`, { published: !currentStatus });
      loadPages();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'title', title: 'Título' },
    { key: 'slug', title: 'URL' },
    {
      key: 'published',
      title: 'Publicado',
      render: (published: boolean, row: Page) => (
        <button 
          className={`status-badge ${published ? 'published' : 'draft'}`}
          onClick={() => togglePublish(row.id, published)}
        >
          {published ? 'Sim' : 'Não'}
        </button>
      )
    },
    { 
      key: 'updated_at', 
      title: 'Última atualização',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: Page) => (
        <div className="actions">
          <a href={`/${row.slug}`} target="_blank" rel="noopener noreferrer" className="btn-view">
            <FaEye />
          </a>
          <Link to={`/admin/pages/edit/${row.id}`} className="btn-edit">
            <FaEdit />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="pages-page">
      <div className="page-header">
        <h1>Páginas</h1>
        <Link to="/admin/pages/create" className="btn-primary">
          <FaPlus /> Nova Página
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={pages}
        loading={loading}
      />
    </div>
  );
};

export default PagesList;