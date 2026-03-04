import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextData {
  isOpen: boolean;
  openModal: (content: ReactNode, title?: string) => void;
  closeModal: () => void;
  modalContent: ReactNode;
  modalTitle: string;
}

const ModalContext = createContext<ModalContextData | undefined>(undefined);

export const useModal = (): ModalContextData => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');

  const openModal = (content: ReactNode, title: string = '') => {
    setModalContent(content);
    setModalTitle(title);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
    setModalTitle('');
    document.body.style.overflow = 'unset';
  };

  const value: ModalContextData = {
    isOpen,
    openModal,
    closeModal,
    modalContent,
    modalTitle
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};