import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Contextos
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ModalProvider } from './contexts/ModalContext';

// Páginas Públicas
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Layout Admin
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import UsersList from './pages/admin/users/List';
import UsersCreate from './pages/admin/users/Create';
import UsersEdit from './pages/admin/users/Edit';
import NewsList from './pages/admin/news/List';
import NewsCreate from './pages/admin/news/Create';
import NewsEdit from './pages/admin/news/Edit';
import CarouselList from './pages/admin/carousel/List';
import CarouselCreate from './pages/admin/carousel/Create';
import CarouselEdit from './pages/admin/carousel/Edit';
import GalleryList from './pages/admin/galleries/List';
import GalleryCreate from './pages/admin/galleries/Create';
import GalleryEdit from './pages/admin/galleries/Edit';
import GalleryMedia from './pages/admin/galleries/Media';
import BidsList from './pages/admin/bids/List';
import BidsCreate from './pages/admin/bids/Create';
import BidsEdit from './pages/admin/bids/Edit';
import ContractsList from './pages/admin/contracts/List';
import ContractsCreate from './pages/admin/contracts/Create';
import ContractsEdit from './pages/admin/contracts/Edit';
import CipaList from './pages/admin/cipa/List';
import CipaCreate from './pages/admin/cipa/Create';
import CipaEdit from './pages/admin/cipa/Edit';
import WaterQualityList from './pages/admin/water-quality/List';
import WaterQualityCreate from './pages/admin/water-quality/Create';
import WaterQualityEdit from './pages/admin/water-quality/Edit';
import PagesList from './pages/admin/pages/List';
import PagesCreate from './pages/admin/pages/Create';
import PagesEdit from './pages/admin/pages/Edit';
import DictionaryList from './pages/admin/dictionary/List';
import DictionaryCreate from './pages/admin/dictionary/Create';
import DictionaryEdit from './pages/admin/dictionary/Edit';
import TipsList from './pages/admin/tips/List';
import TipsCreate from './pages/admin/tips/Create';
import TipsEdit from './pages/admin/tips/Edit';
import TariffsList from './pages/admin/tariffs/List';
import TariffsCreate from './pages/admin/tariffs/Create';
import TariffsEdit from './pages/admin/tariffs/Edit';
import PaymentLocationsList from './pages/admin/payment-locations/List';
import PaymentLocationsCreate from './pages/admin/payment-locations/Create';
import PaymentLocationsEdit from './pages/admin/payment-locations/Edit';
import PhonesList from './pages/admin/phones/List';
import PhonesCreate from './pages/admin/phones/Create';
import PhonesEdit from './pages/admin/phones/Edit';
import FaqList from './pages/admin/faq/List';
import FaqCreate from './pages/admin/faq/Create';
import FaqEdit from './pages/admin/faq/Edit';
import SettingsIndex from './pages/admin/settings/Index';

// CSS
import './styles/global.css';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AccessibilityProvider>
            <ModalProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="users" element={<UsersList />} />
                  <Route path="users/create" element={<UsersCreate />} />
                  <Route path="users/edit/:id" element={<UsersEdit />} />
                  <Route path="news" element={<NewsList />} />
                  <Route path="news/create" element={<NewsCreate />} />
                  <Route path="news/edit/:id" element={<NewsEdit />} />
                  <Route path="carousel" element={<CarouselList />} />
                  <Route path="carousel/create" element={<CarouselCreate />} />
                  <Route path="carousel/edit/:id" element={<CarouselEdit />} />
                  <Route path="galleries" element={<GalleryList />} />
                  <Route path="galleries/create" element={<GalleryCreate />} />
                  <Route path="galleries/edit/:id" element={<GalleryEdit />} />
                  <Route path="galleries/media/:id" element={<GalleryMedia />} />
                  <Route path="bids" element={<BidsList />} />
                  <Route path="bids/create" element={<BidsCreate />} />
                  <Route path="bids/edit/:id" element={<BidsEdit />} />
                  <Route path="contracts" element={<ContractsList />} />
                  <Route path="contracts/create" element={<ContractsCreate />} />
                  <Route path="contracts/edit/:id" element={<ContractsEdit />} />
                  <Route path="cipa" element={<CipaList />} />
                  <Route path="cipa/create" element={<CipaCreate />} />
                  <Route path="cipa/edit/:id" element={<CipaEdit />} />
                  <Route path="water-quality" element={<WaterQualityList />} />
                  <Route path="water-quality/create" element={<WaterQualityCreate />} />
                  <Route path="water-quality/edit/:id" element={<WaterQualityEdit />} />
                  <Route path="pages" element={<PagesList />} />
                  <Route path="pages/create" element={<PagesCreate />} />
                  <Route path="pages/edit/:id" element={<PagesEdit />} />
                  <Route path="dictionary" element={<DictionaryList />} />
                  <Route path="dictionary/create" element={<DictionaryCreate />} />
                  <Route path="dictionary/edit/:id" element={<DictionaryEdit />} />
                  <Route path="tips" element={<TipsList />} />
                  <Route path="tips/create" element={<TipsCreate />} />
                  <Route path="tips/edit/:id" element={<TipsEdit />} />
                  <Route path="tariffs" element={<TariffsList />} />
                  <Route path="tariffs/create" element={<TariffsCreate />} />
                  <Route path="tariffs/edit/:id" element={<TariffsEdit />} />
                  <Route path="payment-locations" element={<PaymentLocationsList />} />
                  <Route path="payment-locations/create" element={<PaymentLocationsCreate />} />
                  <Route path="payment-locations/edit/:id" element={<PaymentLocationsEdit />} />
                  <Route path="phones" element={<PhonesList />} />
                  <Route path="phones/create" element={<PhonesCreate />} />
                  <Route path="phones/edit/:id" element={<PhonesEdit />} />
                  <Route path="faq" element={<FaqList />} />
                  <Route path="faq/create" element={<FaqCreate />} />
                  <Route path="faq/edit/:id" element={<FaqEdit />} />
                  <Route path="settings" element={<SettingsIndex />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ModalProvider>
          </AccessibilityProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;