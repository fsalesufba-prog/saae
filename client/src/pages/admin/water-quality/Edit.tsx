import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';

const WaterQualityEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    report_name: '',
    report_date: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      try {
        const response = await api.get(`/water-quality/${id}`);
        const report = response.data;
        setFormData({
          report_name: report.report_name,
          report_date: report.report_date.split('T')[0]
        });
        setCurrentFile(report.report_file);
      } catch (err) {
        setError('Erro ao carregar relatório');
      }
    };

    loadReport();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('report_name', formData.report_name);
      data.append('report_date', formData.report_date);
      if (file) {
        data.append('file', file);
      }

      await api.put(`/water-quality/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/admin/water-quality');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar relatório');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="water-quality-page">
      <div className="page-header">
        <h1>Editar Relatório de Qualidade da Água</h1>
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
          <label htmlFor="report_name">Nome do Relatório</label>
          <input
            type="text"
            id="report_name"
            name="report_name"
            value={formData.report_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="report_date">Data do Relatório</label>
          <input
            type="date"
            id="report_date"
            name="report_date"
            value={formData.report_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Arquivo (PDF)</label>
          <input
            type="file"
            id="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
          {currentFile && (
            <p className="file-info">
              Arquivo atual: <a href={currentFile} target="_blank" rel="noopener noreferrer">Visualizar</a>
            </p>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/admin/water-quality')}
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

export default WaterQualityEdit;