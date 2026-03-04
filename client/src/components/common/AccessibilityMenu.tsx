import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { 
  FaUniversalAccess, 
  FaFont, 
  FaAdjust, 
  FaHighlighter,
  FaContao,
  FaSun,
  FaLink,
  FaTextHeight
} from 'react-icons/fa';

const AccessibilityMenu: React.FC = () => {
  const {
    increaseFont,
    decreaseFont,
    resetFont,
    grayscale,
    toggleGrayscale,
    highContrast,
    toggleHighContrast,
    negativeContrast,
    toggleNegativeContrast,
    lightBackground,
    toggleLightBackground,
    underlineLinks,
    toggleUnderlineLinks,
    readableFont,
    toggleReadableFont
  } = useAccessibility();

  return (
    <div className="accessibility-menu">
      <button className="accessibility-btn" aria-label="Menu de acessibilidade">
        <FaUniversalAccess />
      </button>
      
      <div className="accessibility-options">
        <button onClick={increaseFont} className="option-btn" title="Aumentar texto">
          <FaFont /> A+
        </button>
        <button onClick={decreaseFont} className="option-btn" title="Diminuir texto">
          <FaFont /> A-
        </button>
        <button onClick={resetFont} className="option-btn" title="Tamanho normal">
          <FaFont /> A
        </button>
        <button onClick={toggleGrayscale} className={`option-btn ${grayscale ? 'active' : ''}`} title="Escala de cinza">
          <FaAdjust /> Cinza
        </button>
        <button onClick={toggleHighContrast} className={`option-btn ${highContrast ? 'active' : ''}`} title="Alto contraste">
          <FaHighlighter /> Contraste
        </button>
        <button onClick={toggleNegativeContrast} className={`option-btn ${negativeContrast ? 'active' : ''}`} title="Contraste negativo">
          <FaContao /> Negativo
        </button>
        <button onClick={toggleLightBackground} className={`option-btn ${lightBackground ? 'active' : ''}`} title="Fundo claro">
          <FaSun /> Fundo
        </button>
        <button onClick={toggleUnderlineLinks} className={`option-btn ${underlineLinks ? 'active' : ''}`} title="Links sublinhados">
          <FaLink /> Links
        </button>
        <button onClick={toggleReadableFont} className={`option-btn ${readableFont ? 'active' : ''}`} title="Fonte legível">
          <FaTextHeight /> Fonte
        </button>
      </div>
    </div>
  );
};

export default AccessibilityMenu;