import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface CarouselItem {
  id: number;
  title: string;
  image_path: string;
  location_text: string;
  order_num: number;
  active: boolean;
}

const CarouselList: React.FC = () => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/carousel');
      setItems(response.data);
    } catch (error) {
      console.error('Erro ao carregar carrossel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) {
      return;
    }

    try {
      await api.delete(`/carousel/${id}`);
      loadItems();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  const handleMoveUp = async (id: number, currentOrder: number) => {
    try {
      await api.post(`/carousel/${id}/move-up`);
      loadItems();
    } catch (error) {
      console.error('Erro ao mover item:', error);
    }
  };

  const handleMoveDown = async (id: number, currentOrder: number) => {
    try {
      await api.post(`/carousel/${id}/move-down`);
      loadItems();
    } catch (error) {
      console.error('Erro ao mover item:', error);
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/carousel/${id}`, { active: !currentStatus });
      loadItems();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const columns = [
    { 
      key: 'image', 
      title: 'Imagem',
      render: (_: any, row: CarouselItem) => (
        <img 
          src={row.image_path} 
          alt={row.title} 
          style={{ width: '100px', height: '50px', objectFit: 'cover' }}
        />
      )
    },
    { key: 'title', title: 'Título' },
    { key: 'location_text', title: 'Localização' },
    { key: 'order_num', title: 'Ordem' },
    {
      key: 'active',
      title: 'Ativo',
      render: (active: boolean, row: CarouselItem) => (
        <button 
          className={`status-badge ${active ? 'active' : 'inactive'}`}
          onClick={() => toggleActive(row.id, active)}
        >
          {active ? 'Sim' : 'Não'}
        </button>
      )
    },
    {
      key: 'order',
      title: 'Ordenação',
      render: (_: any, row: CarouselItem) => (
        <div className="order-buttons">
          <button 
            onClick={() => handleMoveUp(row.id, row.order_num)}
            className="btn-order"
            disabled={row.order_num === 0}
          >
            <FaArrowUp />
          </button>
          <button 
            onClick={() => handleMoveDown(row.id, row.order_num)}
            className="btn-order"
            disabled={row.order_num === items.length - 1}
          >
            <FaArrowDown />
          </button>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: CarouselItem) => (
        <div className="actions">
          <Link to={`/admin/carousel/edit/${row.id}`} className="btn-edit">
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
    <div className="carousel-page">
      <div className="page-header">
        <h1>Carrossel</h1>
        <Link to="/admin/carousel/create" className="btn-primary">
          <FaPlus /> Novo Item
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={items}
        loading={loading}
      />
    </div>
  );
};

export default CarouselList;