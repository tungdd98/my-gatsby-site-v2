import React, { FC } from 'react';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

type DefaultLayoutProps = {
  children?: React.ReactNode;
};

const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-grow container py-8">{children}</main>

      <AppFooter />
    </div>
  );
};

export default DefaultLayout;
