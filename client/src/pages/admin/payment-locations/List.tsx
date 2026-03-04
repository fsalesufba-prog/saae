import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  opening_hours: string;
}

const PaymentLocationsList: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await api.get('/payment-locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este local?')) {
      return;
    }

    try {
      await api.delete(`/payment-locations/${id}`);
      loadLocations();
    } catch (error) {
      console.error('Erro ao excluir local:', error);
    }
  };

  const columns = [
    { key: 'name', title: 'Nome' },
    { key: 'address', title: 'Endereço' },
    { key: 'phone', title: 'Telefone' },
    { key: 'opening_hours', title: 'Horário' },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: Location) => (
        <div className="actions">
          <Link to={`/admin/payment-locations/edit/${row.id}`} className="btn-edit">
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
    <div className="payment-locations-page">
      <div className="page-header">
        <h1>Locais de Pagamento</h1>
        <Link to="/admin/payment-locations/create" className="btn-primary">
          <FaPlus /> Novo Local
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={locations}
        loading={loading}
      />
    </div>
  );
};

export default PaymentLocationsList;