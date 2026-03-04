import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import api from '../../services/api';

interface Tariff {
  id: number;
  category: string;
  consumption_range: string;
  tariff_type: string;
  value: number;
}

const TabelaTarifas: React.FC = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTariffs = async () => {
      try {
        const response = await api.get('/tariffs');
        setTariffs(response.data);
      } catch (error) {
        console.error('Erro ao carregar tarifas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTariffs();
  }, []);

  const residentialWater = tariffs.filter(t => t.category === 'Residencial' && t.tariff_type === 'Água');
  const residentialSewage = tariffs.filter(t => t.category === 'Residencial' && t.tariff_type === 'Esgoto');
  const commercial = tariffs.filter(t => t.category === 'Comercial');

  return (
    <Layout>
      <Helmet>
        <title>Tabela de Tarifas | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Serviços', link: '/servicos' },
          { label: 'Tabela de Tarifas' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Tabela de Tarifas</h1>
          
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="tariffs-tables">
              <h2>Água - Residencial</h2>
              <table className="tariff-table">
                <thead>
                  <tr>
                    <th>Faixa de Consumo</th>
                    <th>Valor (m³)</th>
                  </tr>
                </thead>
                <tbody>
                  {residentialWater.map(t => (
                    <tr key={t.id}>
                      <td>{t.consumption_range}</td>
                      <td>R$ {t.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2>Esgoto - Residencial</h2>
              <table className="tariff-table">
                <thead>
                  <tr>
                    <th>Faixa de Consumo</th>
                    <th>Valor (m³)</th>
                  </tr>
                </thead>
                <tbody>
                  {residentialSewage.map(t => (
                    <tr key={t.id}>
                      <td>{t.consumption_range}</td>
                      <td>R$ {t.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2>Comercial</h2>
              <table className="tariff-table">
                <thead>
                  <tr>
                    <th>Faixa de Consumo</th>
                    <th>Tipo</th>
                    <th>Valor (m³)</th>
                  </tr>
                </thead>
                <tbody>
                  {commercial.map(t => (
                    <tr key={t.id}>
                      <td>{t.consumption_range}</td>
                      <td>{t.tariff_type}</td>
                      <td>R$ {t.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TabelaTarifas;