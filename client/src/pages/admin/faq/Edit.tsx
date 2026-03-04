import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';
import RichTextEditor from '../../../components/admin/RichTextEditor';

const FaqEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order_num: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFaq = async () => {
      try {
        const response = await api.get(`/faq/${id}`);
        setFormData(response.data);
      } catch (err) {
        setError('Erro ao carregar FAQ');
      }
    };

    loadFaq();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAnswerChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      answer: content
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/faq/${id}`, formData);
      navigate('/admin/faq');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faq-page">
      <div className="page-header">
        <h1>Editar Pergunta Frequente</h1>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError('')}
        />
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="order_num">Ordem</label>
            <input
              type="number"
              id="order_num"
              name="order_num"
              value={formData.order_num}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="question">Pergunta</label>
          <input
            type="text"
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Resposta</label>
          <RichTextEditor
            value={formData.answer}
            onChange={handleAnswerChange}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/admin/faq')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FaqEdit;