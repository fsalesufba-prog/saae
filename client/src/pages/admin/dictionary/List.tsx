import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Term {
  id: number;
  term: string;
  definition: string;
}

const DictionaryList: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      const response = await api.get('/dictionary');
      setTerms(response.data);
    } catch (error) {
      console.error('Erro ao carregar termos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este termo?')) {
      return;
    }

    try {
      await api.delete(`/dictionary/${id}`);
      loadTerms();
    } catch (error) {
      console.error('Erro ao excluir termo:', error);
    }
  };

  const columns = [
    { key: 'term', title: 'Termo' },
    { key: 'definition', title: 'Definição' },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: Term) => (
        <div className="actions">
          <Link to={`/admin/dictionary/edit/${row.id}`} className="btn-edit">
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
    <div className="dictionary-page">
      <div className="page-header">
        <h1>Dicionário</h1>
        <Link to="/admin/dictionary/create" className="btn-primary">
          <FaPlus /> Novo Termo
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={terms}
        loading={loading}
      />
    </div>
  );
};

export default DictionaryList;