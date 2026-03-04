import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import api from '../../services/api';

interface Media {
  id: number;
  title: string;
  file_path: string;
  type: 'image' | 'video';
}

interface Gallery {
  id: number;
  name: string;
  description: string;
}

const AlbumDetalhe: React.FC = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [galleryRes, mediaRes] = await Promise.all([
          api.get(`/galleries/${id}`),
          api.get(`/galleries/${id}/media`)
        ]);
        setGallery(galleryRes.data);
        setMedia(mediaRes.data);
      } catch (error) {
        console.error('Erro ao carregar álbum:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="loading">Carregando...</div>
      </Layout>
    );
  }

  if (!gallery) {
    return (
      <Layout>
        <div className="not-found">Álbum não encontrado</div>
      </Layout>
    );
  }

  const images = media.filter(m => m.type === 'image');
  const videos = media.filter(m => m.type === 'video');

  return (
    <Layout>
      <Helmet>
        <title>{gallery.name} | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Imprensa', link: '/imprensa' },
          { label: 'Galeria de Fotos', link: '/imprensa/galeria-fotos' },
          { label: gallery.name }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>{gallery.name}</h1>
          <p className="gallery-description">{gallery.description}</p>

          <div className="media-grid">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="media-item"
                onClick={() => {
                  setPhotoIndex(index);
                  setLightboxOpen(true);
                }}
              >
                <img src={image.file_path} alt={image.title} />
              </div>
            ))}

            {videos.map(video => (
              <div key={video.id} className="media-item video">
                <video controls>
                  <source src={video.file_path} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>

          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={photoIndex}
            slides={images.map(img => ({ src: img.file_path }))}
            on={{ view: ({ index }) => setPhotoIndex(index) }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AlbumDetalhe;
