import React from 'react';
import TopHeader from './TopHeader';
import MiddleHeader from './MiddleHeader';
import BottomHeader from './BottomHeader';
import Footer from './Footer';
import BottomFooter from './BottomFooter';
import AccessibilityMenu from '../common/AccessibilityMenu';
import BackToTop from '../common/BackToTop';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <TopHeader />
      <MiddleHeader />
      <BottomHeader />
      <main>{children}</main>
      <Footer />
      <BottomFooter />
      <AccessibilityMenu />
      <BackToTop />
    </>
  );
};

export default Layout;