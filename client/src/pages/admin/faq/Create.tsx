import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';
import RichTextEditor from '../../../components/admin/RichTextEditor';

const FaqCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order_num: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      await api.post('/faq', formData);
      navigate('/admin/faq');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar pergunta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faq-page">
      <div className="page-header">
        <h1>Nova Pergunta Frequente</h1>
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
              placeholder="Geral, Contas, Serviços, etc"
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

export default FaqCreate;