import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AccessibilityContextData {
  fontSize: number;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
  grayscale: boolean;
  toggleGrayscale: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  negativeContrast: boolean;
  toggleNegativeContrast: () => void;
  lightBackground: boolean;
  toggleLightBackground: () => void;
  underlineLinks: boolean;
  toggleUnderlineLinks: () => void;
  readableFont: boolean;
  toggleReadableFont: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextData | undefined>(undefined);

export const useAccessibility = (): AccessibilityContextData => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [fontSize, setFontSize] = useState(16);
  const [grayscale, setGrayscale] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [negativeContrast, setNegativeContrast] = useState(false);
  const [lightBackground, setLightBackground] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [readableFont, setReadableFont] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    if (grayscale) {
      document.body.classList.add('grayscale');
    } else {
      document.body.classList.remove('grayscale');
    }
  }, [grayscale]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (negativeContrast) {
      document.body.classList.add('negative-contrast');
    } else {
      document.body.classList.remove('negative-contrast');
    }
  }, [negativeContrast]);

  useEffect(() => {
    if (lightBackground) {
      document.body.classList.add('light-background');
    } else {
      document.body.classList.remove('light-background');
    }
  }, [lightBackground]);

  useEffect(() => {
    if (underlineLinks) {
      document.body.classList.add('underline-links');
    } else {
      document.body.classList.remove('underline-links');
    }
  }, [underlineLinks]);

  useEffect(() => {
    if (readableFont) {
      document.body.classList.add('readable-font');
    } else {
      document.body.classList.remove('readable-font');
    }
  }, [readableFont]);

  const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 32));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 12));
  const resetFont = () => setFontSize(16);

  const toggleGrayscale = () => setGrayscale(prev => !prev);
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleNegativeContrast = () => setNegativeContrast(prev => !prev);
  const toggleLightBackground = () => setLightBackground(prev => !prev);
  const toggleUnderlineLinks = () => setUnderlineLinks(prev => !prev);
  const toggleReadableFont = () => setReadableFont(prev => !prev);

  const value: AccessibilityContextData = {
    fontSize,
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
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};