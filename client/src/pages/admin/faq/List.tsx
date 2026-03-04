import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  order_num: number;
}

const FaqList: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const response = await api.get('/faq');
      setFaqs(response.data);
    } catch (error) {
      console.error('Erro ao carregar FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      return;
    }

    try {
      await api.delete(`/faq/${id}`);
      loadFaqs();
    } catch (error) {
      console.error('Erro ao excluir FAQ:', error);
    }
  };

  const columns = [
    { key: 'question', title: 'Pergunta' },
    { 
      key: 'answer', 
      title: 'Resposta',
      render: (answer: string) => (
        <div dangerouslySetInnerHTML={{ __html: answer.substring(0, 100) + '...' }} />
      )
    },
    { key: 'category', title: 'Categoria' },
    { key: 'order_num', title: 'Ordem' },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: Faq) => (
        <div className="actions">
          <Link to={`/admin/faq/edit/${row.id}`} className="btn-edit">
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
    <div className="faq-page">
      <div className="page-header">
        <h1>Perguntas Frequentes</h1>
        <Link to="/admin/faq/create" className="btn-primary">
          <FaPlus /> Nova Pergunta
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={faqs}
        loading={loading}
      />
    </div>
  );
};

export default FaqList;