import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import api from '../../services/api';

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  opening_hours: string;
}

const OndePagar: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await api.get('/payment-locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Erro ao carregar locais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Onde Pagar sua Conta | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Serviços', link: '/servicos' },
          { label: 'Onde Pagar' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Onde Pagar sua Conta</h1>
          
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="locations-grid">
              {locations.map(location => (
                <div key={location.id} className="location-card">
                  <h3>{location.name}</h3>
                  <p>
                    <FaMapMarkerAlt /> {location.address}
                  </p>
                  <p>
                    <FaPhone /> {location.phone}
                  </p>
                  <p>
                    <FaClock /> {location.opening_hours}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OndePagar;