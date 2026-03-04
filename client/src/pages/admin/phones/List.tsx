import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Phone {
  id: number;
  department: string;
  phone: string;
  email: string;
  description: string;
}

const PhonesList: React.FC = () => {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhones();
  }, []);

  const loadPhones = async () => {
    try {
      const response = await api.get('/useful-phones');
      setPhones(response.data);
    } catch (error) {
      console.error('Erro ao carregar telefones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este telefone?')) {
      return;
    }

    try {
      await api.delete(`/useful-phones/${id}`);
      loadPhones();
    } catch (error) {
      console.error('Erro ao excluir telefone:', error);
    }
  };

  const columns = [
    { key: 'department', title: 'Departamento' },
    { key: 'phone', title: 'Telefone' },
    { key: 'email', title: 'Email' },
    { key: 'description', title: 'Descrição' },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: Phone) => (
        <div className="actions">
          <Link to={`/admin/phones/edit/${row.id}`} className="btn-edit">
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
    <div className="phones-page">
      <div className="page-header">
        <h1>Telefones Úteis</h1>
        <Link to="/admin/phones/create" className="btn-primary">
          <FaPlus /> Novo Telefone
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={phones}
        loading={loading}
      />
    </div>
  );
};

export default PhonesList;