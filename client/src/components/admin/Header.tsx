import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

const AdminHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="admin-header">
      <div className="header-search">
        <FaSearch />
        <input type="text" placeholder="Pesquisar..." />
      </div>

      <div className="header-user">
        <div className="notification-badge">
          <FaBell />
          <span>3</span>
        </div>

        <div className="user-profile">
          <FaUserCircle size={32} />
          <span>{user?.name}</span>
          <div className="user-info-small">
            <p><strong>{user?.name}</strong></p>
            <p>{user?.email}</p>
            <p>Perfil: {user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;