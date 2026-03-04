import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';
import ImageUpload from '../../../components/admin/ImageUpload';
import RichTextEditor from '../../../components/admin/RichTextEditor';

const NewsCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    author: '',
    published: false,
    publish_date: new Date().toISOString().split('T')[0]
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (file: File) => {
    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value as string);
      });
      if (image) {
        data.append('image', image);
      }

      await api.post('/news', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/admin/news');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar notícia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-page">
      <div className="page-header">
        <h1>Nova Notícia</h1>
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
          <label htmlFor="summary">Resumo</label>
          <textarea
            id="summary"
            name="summary"
            rows={3}
            value={formData.summary}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Imagem de Destaque</label>
          <ImageUpload onUpload={handleImageUpload} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="author">Autor</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

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
            <label>
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={(e) => setFormData({...formData, published: e.target.checked})}
              />
              Publicar imediatamente
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Conteúdo</label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData({...formData, content})}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/admin/news')}
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

export default NewsCreate;