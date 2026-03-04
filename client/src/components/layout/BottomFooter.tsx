import React from 'react';

const BottomFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="bottom-footer">
      <div className="container">
        <p>
          © {currentYear} SAAE Linhares - Serviço Autônomo de Água e Esgoto
        </p>
      </div>
    </div>
  );
};

export default BottomFooter;