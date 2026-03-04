import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import api from '../../services/api';

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
}

const Localizacao: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await api.get('/locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Erro ao carregar localizações:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Localização | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Atendimento', link: '/atendimento' },
          { label: 'Localização' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Nossas Unidades</h1>
          
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="locations-list">
              {locations.map(location => (
                <div key={location.id} className="location-item">
                  <h2>{location.name}</h2>
                  <p>
                    <FaMapMarkerAlt /> {location.address}
                  </p>
                  <p>
                    <FaPhone /> {location.phone}
                  </p>
                  <p>
                    <FaEnvelope /> {location.email}
                  </p>
                  
                  <div className="location-map">
                    <iframe
                      title={location.name}
                      width="100%"
                      height="300"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&q=${location.latitude},${location.longitude}`}
                      allowFullScreen
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Localizacao;