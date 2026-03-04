import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import api from '../../services/api';

interface Gallery {
  id: number;
  name: string;
  description: string;
  cover_image: string;
}

const GaleriaFotos: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        const response = await api.get('/galleries?type=photo');
        setGalleries(response.data);
      } catch (error) {
        console.error('Erro ao carregar galerias:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGalleries();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Galeria de Fotos | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Imprensa', link: '/imprensa' },
          { label: 'Galeria de Fotos' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Galeria de Fotos</h1>
          
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="galleries-grid">
              {galleries.map(gallery => (
                <Link 
                  key={gallery.id} 
                  to={`/imprensa/galeria/${gallery.id}`}
                  className="gallery-card"
                >
                  <div className="gallery-cover">
                    <img src={gallery.cover_image} alt={gallery.name} />
                  </div>
                  <div className="gallery-info">
                    <h3>{gallery.name}</h3>
                    <p>{gallery.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GaleriaFotos;