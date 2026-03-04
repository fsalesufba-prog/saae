import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Nome' },
    { key: 'email', title: 'Email' },
    { 
      key: 'role', 
      title: 'Perfil',
      render: (role: string) => (
        <span className={`badge badge-${role}`}>
          {role === 'admin' ? 'Administrador' : 
           role === 'editor' ? 'Editor' : 'Visualizador'}
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
      render: (_: any, row: User) => (
        <div className="actions">
          <Link to={`/admin/users/edit/${row.id}`} className="btn-edit">
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
    <div className="users-page">
      <div className="page-header">
        <h1>Usuários</h1>
        <Link to="/admin/users/create" className="btn-primary">
          <FaPlus /> Novo Usuário
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={users}
        loading={loading}
      />
    </div>
  );
};

export default UsersList;