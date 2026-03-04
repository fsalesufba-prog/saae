import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';
import ImageUpload from '../../../components/admin/ImageUpload';

const CarouselEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location_text: '',
    link: '',
    active: true
  });
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response = await api.get(`/carousel/${id}`);
        const item = response.data;
        setFormData({
          title: item.title || '',
          location_text: item.location_text || '',
          link: item.link || '',
          active: item.active
        });
        setCurrentImage(item.image_path);
      } catch (err) {
        setError('Erro ao carregar item do carrossel');
      }
    };

    loadItem();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
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
      data.append('title', formData.title);
      data.append('location_text', formData.location_text);
      data.append('link', formData.link);
      data.append('active', formData.active.toString());
      if (image) {
        data.append('image', image);
      }

      await api.put(`/carousel/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/admin/carousel');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="carousel-page">
      <div className="page-header">
        <h1>Editar Item do Carrossel</h1>
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
          <label>Imagem Atual</label>
          <ImageUpload 
            onUpload={handleImageUpload} 
            currentImage={currentImage}
          />
          <small>Dimensão recomendada: 1920x1080px. Deixe em branco para manter a imagem atual.</small>
        </div>

        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título da imagem (opcional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location_text">Texto de Localização</label>
          <input
            type="text"
            id="location_text"
            name="location_text"
            value={formData.location_text}
            onChange={handleChange}
            placeholder="Ex: Captação - Rio Pequeno"
          />
        </div>

        <div className="form-group">
          <label htmlFor="link">Link (opcional)</label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://..."
          />
          <small>Ao clicar na imagem, o usuário será redirecionado para este link</small>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleCheckboxChange}
            />
            <span>Item ativo (será exibido no carrossel)</span>
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/admin/carousel')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarouselEdit;