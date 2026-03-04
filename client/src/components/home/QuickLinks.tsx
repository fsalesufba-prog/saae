import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaUser, FaEnvelope, FaMoneyBill, FaGlobe } from 'react-icons/fa';

const QuickLinks: React.FC = () => {
  const links = [
    {
      icon: <FaFileAlt />,
      title: 'GPI',
      url: 'https://gpi.linhares.es.gov.br/ServerExec/acessoBase/',
      external: true
    },
    {
      icon: <FaUser />,
      title: 'Portal do Cliente',
      url: 'https://gpi.linhares.es.gov.br/ServerExec/acessoBase/?idPortal=D87C1EC9CDF67AA47D9CEC44E67B1D86',
      external: true
    },
    {
      icon: <FaEnvelope />,
      title: 'E-mail corporativo',
      url: 'https://192.168.0.254/',
      external: true
    },
    {
      icon: <FaMoneyBill />,
      title: 'Contra-cheque',
      url: 'https://servicos.cloud.el.com.br/es-linhares-saae/portal/login',
      external: true
    },
    {
      icon: <FaGlobe />,
      title: 'Agência virtual',
      url: 'https://avsanegraph.com.br/av/sane/index.php',
      external: true
    }
  ];

  return (
    <div className="quick-links">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          className="quick-link-card"
        >
          <span className="icon">{link.icon}</span>
          <span className="title">{link.title}</span>
        </a>
      ))}
    </div>
  );
};

export default QuickLinks;