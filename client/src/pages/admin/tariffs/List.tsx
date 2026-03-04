import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Tariff {
  id: number;
  category: string;
  consumption_range: string;
  tariff_type: string;
  value: number;
  valid_from: string;
  valid_to: string;
}

const TariffsList: React.FC = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTariffs();
  }, []);

  const loadTariffs = async () => {
    try {
      const response = await api.get('/tariffs');
      setTariffs(response.data);
    } catch (error) {
      console.error('Erro ao carregar tarifas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarifa?')) {
      return;
    }

    try {
      await api.delete(`/tariffs/${id}`);
      loadTariffs();
    } catch (error) {
      console.error('Erro ao excluir tarifa:', error);
    }
  };

  const columns = [
    { key: 'category', title: 'Categoria' },
    { key: 'consumption_range', title: 'Faixa de Consumo' },
    { key: 'tariff_type', title: 'Tipo' },
    { 
      key: 'value', 
      title: 'Valor',
      render: (value: number) => `R$ ${value.toFixed(2)}`
    },
    { 
      key: 'valid_from', 
      title: 'Válido de',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
    { 
      key: 'valid_to', 
      title: 'Válido até',
      render: (date: string) => date ? new Date(date).toLocaleDateString('pt-BR') : 'Indeterminado'
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: Tariff) => (
        <div className="actions">
          <Link to={`/admin/tariffs/edit/${row.id}`} className="btn-edit">
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
    <div className="tariffs-page">
      <div className="page-header">
        <h1>Tarifas</h1>
        <Link to="/admin/tariffs/create" className="btn-primary">
          <FaPlus /> Nova Tarifa
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={tariffs}
        loading={loading}
      />
    </div>
  );
};

export default TariffsList;