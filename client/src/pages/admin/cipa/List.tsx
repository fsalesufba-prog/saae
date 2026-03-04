import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface CipaSection {
  id: number;
  section: string;
  title: string;
  content: string;
  order_num: number;
}

const CipaList: React.FC = () => {
  const [sections, setSections] = useState<CipaSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const response = await api.get('/cipa');
      setSections(response.data);
    } catch (error) {
      console.error('Erro ao carregar CIPA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta seção?')) {
      return;
    }

    try {
      await api.delete(`/cipa/${id}`);
      loadSections();
    } catch (error) {
      console.error('Erro ao excluir seção:', error);
    }
  };

  const columns = [
    { key: 'section', title: 'Identificador' },
    { key: 'title', title: 'Título' },
    { key: 'order_num', title: 'Ordem' },
    {
      key: 'content',
      title: 'Conteúdo',
      render: (content: string) => (
        <div dangerouslySetInnerHTML={{ __html: content.substring(0, 100) + '...' }} />
      )
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: CipaSection) => (
        <div className="actions">
          <Link to={`/admin/cipa/edit/${row.id}`} className="btn-edit">
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
    <div className="cipa-page">
      <div className="page-header">
        <h1>CIPA - Seções</h1>
        <Link to="/admin/cipa/create" className="btn-primary">
          <FaPlus /> Nova Seção
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={sections}
        loading={loading}
      />
    </div>
  );
};

export default CipaList;