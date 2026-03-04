import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import TopHeader from '../components/layout/TopHeader';
import MiddleHeader from '../components/layout/MiddleHeader';
import BottomHeader from '../components/layout/BottomHeader';
import Footer from '../components/layout/Footer';
import BottomFooter from '../components/layout/BottomFooter';
import AccessibilityMenu from '../components/common/AccessibilityMenu';
import BackToTop from '../components/common/BackToTop';
import Carousel from '../components/common/Carousel';
import Modal from '../components/common/Modal';
import QuickLinks from '../components/home/QuickLinks';
import LatestNews from '../components/home/LatestNews';
import FeatureCards from '../components/home/FeatureCards';
import LatestBids from '../components/home/LatestBids';
import api from '../services/api';

const Home: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const [carouselItems, setCarouselItems] = useState([]);
  const [comunicado, setComunicado] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [carouselRes, comunicadoRes] = await Promise.all([
          api.get('/carousel/active'),
          api.get('/settings/comunicado')
        ]);
        
        setCarouselItems(carouselRes.data);
        setComunicado(comunicadoRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <Helmet>
        <title>SAAE Linhares - Serviço Autônomo de Água e Esgoto</title>
        <meta name="description" content="Site oficial do Serviço Autônomo de Água e Esgoto de Linhares - ES" />
      </Helmet>

      <TopHeader />
      <MiddleHeader />
      <BottomHeader />

      <main>
        <Carousel items={carouselItems} />
        
        <div className="container">
          <QuickLinks />
          
          <div className="news-section">
            <LatestNews />
            <FeatureCards />
          </div>
          
          <LatestBids />
        </div>
      </main>

      <Footer />
      <BottomFooter />
      
      <AccessibilityMenu />
      <BackToTop />

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title="Comunicado Importante"
      >
        {comunicado ? (
          <img 
            src={comunicado.image} 
            alt="Comunicado" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        ) : (
          <p>Carregando...</p>
        )}
      </Modal>
    </>
  );
};

export default Home;