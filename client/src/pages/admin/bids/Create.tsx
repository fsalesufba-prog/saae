import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';

const BidsCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    process_number: '',
    modality: '',
    object: '',
    status: 'andamento',
    publish_date: '',
    opening_date: '',
    year: new Date().getFullYear()
  });
  const [document, setDocument] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.toString());
      });
      if (document) {
        data.append('document', document);
      }

      await api.post('/bids', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/admin/bids');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar licitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bids-page">
      <div className="page-header">
        <h1>Nova Licitação</h1>
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
            <label htmlFor="process_number">Número do Processo</label>
            <input
              type="text"
              id="process_number"
              name="process_number"
              value={formData.process_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Ano</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="2000"
              max="2100"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="modality">Modalidade</label>
            <select
              id="modality"
              name="modality"
              value={formData.modality}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="Pregão Presencial">Pregão Presencial</option>
              <option value="Pregão Eletrônico">Pregão Eletrônico</option>
              <option value="Concorrência">Concorrência</option>
              <option value="Tomada de Preços">Tomada de Preços</option>
              <option value="Convite">Convite</option>
              <option value="Leilão">Leilão</option>
              <option value="Concurso">Concurso</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="andamento">Em Andamento</option>
              <option value="aberta">Aberta</option>
              <option value="homologada">Homologada</option>
              <option value="fracassada">Fracassada</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="publish_date">Data de Publicação</label>
            <input
              type="date"
              id="publish_date"
              name="publish_date"
              value={formData.publish_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="opening_date">Data de Abertura</label>
            <input
              type="datetime-local"
              id="opening_date"
              name="opening_date"
              value={formData.opening_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="object">Objeto</label>
          <textarea
            id="object"
            name="object"
            rows={4}
            value={formData.object}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="document">Edital (PDF)</label>
          <input
            type="file"
            id="document"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/admin/bids')}
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

export default BidsCreate;