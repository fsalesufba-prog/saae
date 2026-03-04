import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaSearch } from 'react-icons/fa';
import api from '../../services/api';

interface Term {
  term: string;
  definition: string;
}

const Dicionario: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const response = await api.get('/dictionary');
        setTerms(response.data);
      } catch (error) {
        console.error('Erro ao carregar dicionário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTerms();
  }, []);

  const filteredTerms = terms.filter(term =>
    term.term.toLowerCase().includes(search.toLowerCase()) ||
    term.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <Helmet>
        <title>Dicionário de Termos | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Serviços', link: '/servicos' },
          { label: 'Dicionário' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Dicionário de Termos</h1>
          
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Pesquisar termo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="dictionary-list">
              {filteredTerms.map((term, index) => (
                <div key={index} className="dictionary-item">
                  <h3>{term.term}</h3>
                  <p>{term.definition}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dicionario;