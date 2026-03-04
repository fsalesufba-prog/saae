import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Accordion from '../../components/ui/Accordion';
import api from '../../services/api';

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const PerguntasFrequentes: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const response = await api.get('/faq');
        setFaqs(response.data);
        
        const cats = Array.from(new Set(response.data.map((f: Faq) => f.category))) as string[];
        setCategories(cats);
      } catch (error) {
        console.error('Erro ao carregar FAQ:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, []);

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === selectedCategory);

  const accordionItems = filteredFaqs.map(faq => ({
    title: faq.question,
    content: <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
  }));

  return (
    <Layout>
      <Helmet>
        <title>Perguntas Frequentes | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Atendimento', link: '/atendimento' },
          { label: 'Perguntas Frequentes' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Perguntas Frequentes</h1>

          <div className="faq-categories">
            <button 
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Todas
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="faq-list">
              <Accordion items={accordionItems} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PerguntasFrequentes;