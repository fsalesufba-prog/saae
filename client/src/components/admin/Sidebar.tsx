import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaTachometerAlt,
  FaUsers,
  FaNewspaper,
  FaImages,
  FaGavel,
  FaFileContract,
  FaShieldAlt,
  FaTint,
  FaFileAlt,
  FaBook,
  FaLightbulb,
  FaMoneyBill,
  FaMapMarkerAlt,
  FaPhone,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminSidebar: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <img src="/images/logo-white.png" alt="SAAE Linhares" />
        <span>Admin</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin" end>
          <FaTachometerAlt /> Dashboard
        </NavLink>

        <NavLink to="/admin/users">
          <FaUsers /> Usuários
        </NavLink>

        <NavLink to="/admin/news">
          <FaNewspaper /> Notícias
        </NavLink>

        <NavLink to="/admin/carousel">
          <FaImages /> Carrossel
        </NavLink>

        <NavLink to="/admin/galleries">
          <FaImages /> Galerias
        </NavLink>

        <NavLink to="/admin/bids">
          <FaGavel /> Licitações
        </NavLink>

        <NavLink to="/admin/contracts">
          <FaFileContract /> Contratos
        </NavLink>

        <NavLink to="/admin/cipa">
          <FaShieldAlt /> CIPA
        </NavLink>

        <NavLink to="/admin/water-quality">
          <FaTint /> Qualidade da Água
        </NavLink>

        <NavLink to="/admin/pages">
          <FaFileAlt /> Páginas
        </NavLink>

        <NavLink to="/admin/dictionary">
          <FaBook /> Dicionário
        </NavLink>

        <NavLink to="/admin/tips">
          <FaLightbulb /> Dicas
        </NavLink>

        <NavLink to="/admin/tariffs">
          <FaMoneyBill /> Tarifas
        </NavLink>

        <NavLink to="/admin/payment-locations">
          <FaMapMarkerAlt /> Locais de Pagamento
        </NavLink>

        <NavLink to="/admin/phones">
          <FaPhone /> Telefones
        </NavLink>

        <NavLink to="/admin/faq">
          <FaQuestionCircle /> FAQ
        </NavLink>

        <NavLink to="/admin/settings">
          <FaCog /> Configurações
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <span>{user?.name}</span>
          <small>{user?.role}</small>
        </div>
        <button onClick={signOut} className="logout-btn">
          <FaSignOutAlt /> Sair
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;