import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';

const TipsCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    tip: '',
    icon: '',
    order_num: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/consumption-tips', formData);
      navigate('/admin/tips');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar dica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tips-page">
      <div className="page-header">
        <h1>Nova Dica de Consumo</h1>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError('')}
        />
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="icon">Ícone (emoji)</label>
          <input
            type="text"
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="💧"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tip">Dica</label>
          <textarea
            id="tip"
            name="tip"
            rows={4}
            value={formData.tip}
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

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/admin/tips')}
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

export default TipsCreate;