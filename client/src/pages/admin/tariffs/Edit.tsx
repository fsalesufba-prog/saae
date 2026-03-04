import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';

const TariffsEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    consumption_range: '',
    tariff_type: 'Água',
    value: '',
    valid_from: '',
    valid_to: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTariff = async () => {
      try {
        const response = await api.get(`/tariffs/${id}`);
        const tariff = response.data;
        setFormData({
          category: tariff.category,
          consumption_range: tariff.consumption_range,
          tariff_type: tariff.tariff_type,
          value: tariff.value.toString(),
          valid_from: tariff.valid_from.split('T')[0],
          valid_to: tariff.valid_to ? tariff.valid_to.split('T')[0] : ''
        });
      } catch (err) {
        setError('Erro ao carregar tarifa');
      }
    };

    loadTariff();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await api.put(`/tariffs/${id}`, {
        ...formData,
        value: parseFloat(formData.value)
      });
      navigate('/admin/tariffs');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar tarifa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tariffs-page">
      <div className="page-header">
        <h1>Editar Tarifa</h1>
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
            <label htmlFor="tariff_type">Tipo</label>
            <select
              id="tariff_type"
              name="tariff_type"
              value={formData.tariff_type}
              onChange={handleChange}
              required
            >
              <option value="Água">Água</option>
              <option value="Esgoto">Esgoto</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="consumption_range">Faixa de Consumo</label>
          <input
            type="text"
            id="consumption_range"
            name="consumption_range"
            value={formData.consumption_range}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="value">Valor (R$)</label>
          <input
            type="number"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="valid_from">Válido a partir de</label>
            <input
              type="date"
              id="valid_from"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="valid_to">Válido até (opcional)</label>
            <input
              type="date"
              id="valid_to"
              name="valid_to"
              value={formData.valid_to}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/admin/tariffs')}
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

export default TariffsEdit;