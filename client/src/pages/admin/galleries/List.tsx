import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus, FaImages, FaVideo } from 'react-icons/fa';

interface Gallery {
  id: number;
  name: string;
  description: string;
  type: 'photo' | 'video';
  cover_image: string;
  created_at: string;
}

const GalleriesList: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      const response = await api.get('/galleries');
      setGalleries(response.data);
    } catch (error) {
      console.error('Erro ao carregar galerias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta galeria?')) {
      return;
    }

    try {
      await api.delete(`/galleries/${id}`);
      loadGalleries();
    } catch (error) {
      console.error('Erro ao excluir galeria:', error);
    }
  };

  const columns = [
    { 
      key: 'cover', 
      title: 'Capa',
      render: (_: any, row: Gallery) => (
        <img 
          src={row.cover_image || '/images/default-gallery.jpg'} 
          alt={row.name}
          style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
        />
      )
    },
    { key: 'name', title: 'Nome' },
    { key: 'description', title: 'Descrição' },
    { 
      key: 'type', 
      title: 'Tipo',
      render: (type: string) => (
        <span className={`gallery-type ${type}`}>
          {type === 'photo' ? <FaImages /> : <FaVideo />}
          {type === 'photo' ? ' Fotos' : ' Vídeos'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      title: 'Criado em',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: Gallery) => (
        <div className="actions">
          <Link to={`/admin/galleries/media/${row.id}`} className="btn-images" title="Gerenciar mídia">
            <FaImages />
          </Link>
          <Link to={`/admin/galleries/edit/${row.id}`} className="btn-edit">
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
    <div className="galleries-page">
      <div className="page-header">
        <h1>Galerias</h1>
        <Link to="/admin/galleries/create" className="btn-primary">
          <FaPlus /> Nova Galeria
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={galleries}
        loading={loading}
      />
    </div>
  );
};

export default GalleriesList;