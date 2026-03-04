import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import api from '../../services/api';

interface Phone {
  id: number;
  department: string;
  phone: string;
  email: string;
  description: string;
}

const TelefonesUteis: React.FC = () => {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhones = async () => {
      try {
        const response = await api.get('/useful-phones');
        setPhones(response.data);
      } catch (error) {
        console.error('Erro ao carregar telefones:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPhones();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Telefones Úteis | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Atendimento', link: '/atendimento' },
          { label: 'Telefones Úteis' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Telefones Úteis</h1>
          
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="phones-grid">
              {phones.map(phone => (
                <div key={phone.id} className="phone-card">
                  <h3>{phone.department}</h3>
                  <p className="phone-number">
                    <FaPhone /> {phone.phone}
                  </p>
                  {phone.email && (
                    <p className="phone-email">
                      <FaEnvelope /> {phone.email}
                    </p>
                  )}
                  <p className="phone-description">{phone.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TelefonesUteis;