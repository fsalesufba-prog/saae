import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';

const ContractsEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contract_number: '',
    process_number: '',
    modality: '',
    object: '',
    status: '',
    year: new Date().getFullYear(),
    published_at: '',
    opening_date: ''
  });
  const [document, setDocument] = useState<File | null>(null);
  const [currentDocument, setCurrentDocument] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadContract = async () => {
      try {
        const response = await api.get(`/contracts/${id}`);
        const contract = response.data;
        setFormData({
          contract_number: contract.contract_number,
          process_number: contract.process_number,
          modality: contract.modality,
          object: contract.object,
          status: contract.status,
          year: contract.year,
          published_at: contract.published_at.split('T')[0],
          opening_date: contract.opening_date.split('T')[0]
        });
        setCurrentDocument(contract.document_path);
      } catch (err) {
        setError('Erro ao carregar contrato');
      }
    };

    loadContract();
  }, [id]);

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

      await api.put(`/contracts/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/admin/contracts');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar contrato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contracts-page">
      <div className="page-header">
        <h1>Editar Contrato</h1>
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
            <label htmlFor="contract_number">Número do Contrato</label>
            <input
              type="text"
              id="contract_number"
              name="contract_number"
              value={formData.contract_number}
              onChange={handleChange}
              required
            />
          </div>

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
        </div>

        <div className="form-row">
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

          <div className="form-group">
            <label htmlFor="modality">Modalidade</label>
            <input
              type="text"
              id="modality"
              name="modality"
              value={formData.modality}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="published_at">Data de Publicação</label>
            <input
              type="date"
              id="published_at"
              name="published_at"
              value={formData.published_at}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="opening_date">Data de Abertura</label>
            <input
              type="date"
              id="opening_date"
              name="opening_date"
              value={formData.opening_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <input
            type="text"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          />
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
          <label htmlFor="document">Documento (PDF)</label>
          <input
            type="file"
            id="document"
            accept=".pdf"
            onChange={handleFileChange}
          />
          {currentDocument && (
            <p className="file-info">
              Arquivo atual: <a href={currentDocument} target="_blank" rel="noopener noreferrer">Visualizar</a>
            </p>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/admin/contracts')}
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

export default ContractsEdit;