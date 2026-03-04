import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';
import ImageUpload from '../../../components/admin/ImageUpload';
import RichTextEditor from '../../../components/admin/RichTextEditor';

const NewsEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    author: '',
    published: false,
    publish_date: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        const news = response.data;
        setFormData({
          title: news.title,
          summary: news.summary,
          content: news.content,
          author: news.author,
          published: news.published,
          publish_date: news.publish_date.split('T')[0]
        });
        setCurrentImage(news.image_path);
      } catch (err) {
        setError('Erro ao carregar notícia');
      }
    };

    loadNews();
  }, [id]);

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

      await api.put(`/news/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/admin/news');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar notícia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-page">
      <div className="page-header">
        <h1>Editar Notícia</h1>
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
          <ImageUpload 
            onUpload={handleImageUpload} 
            currentImage={currentImage}
          />
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
              Publicado
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

export default NewsEdit;