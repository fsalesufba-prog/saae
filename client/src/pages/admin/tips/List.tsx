import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Tip {
  id: number;
  title: string;
  tip: string;
  icon: string;
  order_num: number;
}

const TipsList: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    try {
      const response = await api.get('/consumption-tips');
      setTips(response.data);
    } catch (error) {
      console.error('Erro ao carregar dicas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta dica?')) {
      return;
    }

    try {
      await api.delete(`/consumption-tips/${id}`);
      loadTips();
    } catch (error) {
      console.error('Erro ao excluir dica:', error);
    }
  };

  const columns = [
    { key: 'icon', title: 'Ícone' },
    { key: 'title', title: 'Título' },
    { key: 'tip', title: 'Dica' },
    { key: 'order_num', title: 'Ordem' },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: Tip) => (
        <div className="actions">
          <Link to={`/admin/tips/edit/${row.id}`} className="btn-edit">
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
    <div className="tips-page">
      <div className="page-header">
        <h1>Dicas de Consumo</h1>
        <Link to="/admin/tips/create" className="btn-primary">
          <FaPlus /> Nova Dica
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={tips}
        loading={loading}
      />
    </div>
  );
};

export default TipsList;