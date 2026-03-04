import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Alert from '../../../components/ui/Alert';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaTimes } from 'react-icons/fa';

interface Media {
  id: number;
  title: string;
  description: string;
  file_path: string;
  thumbnail_path: string;
  type: 'image' | 'video';
  order_num: number;
}

const GalleryMedia: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState({ name: '', type: 'photo' });
  const [media, setMedia] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [galleryRes, mediaRes] = await Promise.all([
        api.get(`/galleries/${id}`),
        api.get(`/galleries/${id}/media`)
      ]);
      setGallery(galleryRes.data);
      setMedia(mediaRes.data.sort((a: Media, b: Media) => a.order_num - b.order_num));
    } catch (error) {
      setError('Erro ao carregar mídia');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    Array.from(e.target.files).forEach(file => {
      formData.append('files', file);
    });

    try {
      await api.post(`/galleries/${id}/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await loadData();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mediaId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) {
      return;
    }

    try {
      await api.delete(`/galleries/${id}/media/${mediaId}`);
      await loadData();
    } catch (error) {
      setError('Erro ao excluir item');
    }
  };

  const handleMove = async (mediaId: number, direction: 'up' | 'down') => {
    try {
      await api.post(`/galleries/${id}/media/${mediaId}/${direction}`);
      await loadData();
    } catch (error) {
      setError('Erro ao reordenar');
    }
  };

  const handleEdit = (item: Media) => {
    setEditingMedia(item);
    setEditForm({
      title: item.title || '',
      description: item.description || ''
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;

    try {
      await api.put(`/galleries/${id}/media/${editingMedia.id}`, editForm);
      setEditingMedia(null);
      await loadData();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Erro ao atualizar item');
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="gallery-media-page">
      <div className="page-header">
        <div>
          <h1>{gallery.name}</h1>
          <p className="gallery-subtitle">Gerenciar {gallery.type === 'photo' ? 'fotos' : 'vídeos'}</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/admin/galleries')}
        >
          Voltar para Galerias
        </button>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError('')}
        />
      )}

      {success && (
        <Alert 
          type="success" 
          message="Operação realizada com sucesso!" 
          onClose={() => setSuccess(false)}
        />
      )}

      <div className="upload-area">
        <label htmlFor="file-upload" className="upload-button">
          <FaPlus />
          <span>{uploading ? 'Enviando...' : 'Adicionar Mídia'}</span>
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept={gallery.type === 'photo' ? 'image/*' : 'video/*'}
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <p className="upload-info">
          {gallery.type === 'photo' 
            ? 'Formatos aceitos: JPG, PNG, GIF (máx. 10MB por arquivo)'
            : 'Formatos aceitos: MP4, WebM (máx. 50MB por arquivo)'}
        </p>
      </div>

      {editingMedia && (
        <div className="modal-overlay active" onClick={() => setEditingMedia(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditingMedia(null)}>
              <FaTimes />
            </button>
            <h2>Editar Mídia</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="edit-title">Título</label>
                <input
                  type="text"
                  id="edit-title"
                  value={editForm.title}
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-description">Descrição</label>
                <textarea
                  id="edit-description"
                  rows={3}
                  value={editForm.description}
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditingMedia(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="media-grid">
        {media.map((item, index) => (
          <div key={item.id} className="media-card">
            <div className="media-preview">
              {item.type === 'image' ? (
                <img 
                  src={item.thumbnail_path || item.file_path} 
                  alt={item.title || 'Mídia'} 
                />
              ) : (
                <video src={item.file_path} />
              )}
              
              <div className="media-overlay">
                <div className="media-order">
                  {index > 0 && (
                    <button onClick={() => handleMove(item.id, 'up')} title="Mover para cima">
                      <FaArrowUp />
                    </button>
                  )}
                  {index < media.length - 1 && (
                    <button onClick={() => handleMove(item.id, 'down')} title="Mover para baixo">
                      <FaArrowDown />
                    </button>
                  )}
                </div>
                <div className="media-actions">
                  <button onClick={() => handleEdit(item)} title="Editar">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(item.id)} title="Excluir" className="delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
            <div className="media-info">
              <h4>{item.title || 'Sem título'}</h4>
              {item.description && <p>{item.description}</p>}
            </div>
          </div>
        ))}

        {media.length === 0 && (
          <div className="empty-media">
            <p>Nenhuma mídia adicionada ainda.</p>
            <p>Clique em "Adicionar Mídia" para começar a enviar {gallery.type === 'photo' ? 'fotos' : 'vídeos'}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryMedia;