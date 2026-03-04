import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';

const DictionaryEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    term: '',
    definition: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTerm = async () => {
      try {
        const response = await api.get(`/dictionary/${id}`);
        setFormData(response.data);
      } catch (err) {
        setError('Erro ao carregar termo');
      }
    };

    loadTerm();
  }, [id]);

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
      await api.put(`/dictionary/${id}`, formData);
      navigate('/admin/dictionary');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar termo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dictionary-page">
      <div className="page-header">
        <h1>Editar Termo</h1>
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
          <label htmlFor="term">Termo</label>
          <input
            type="text"
            id="term"
            name="term"
            value={formData.term}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="definition">Definição</label>
          <textarea
            id="definition"
            name="definition"
            rows={5}
            value={formData.definition}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/admin/dictionary')}
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

export default DictionaryEdit;