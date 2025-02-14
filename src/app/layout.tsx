'use client';

import Login from '@/components/common/Login';
import Modal from '@/components/common/Modal';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Montserrat } from 'next/font/google';
import Head from 'next/head';
import './globals.css';
import StyledComponentsRegistry from './lib/registry';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: true,
});

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  // 로딩중에는 아무것도 렌더링하지 않음
  if (isLoading) {
    return (
      <>
        <Header />
        {children}
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      {!user && (
        <Modal>
          <Login />
        </Modal>
      )}
    </>
  );
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
      <Head>
        <title>React Newwons</title>
        <meta name="description" content="Next.js project with Redux and Firebase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className={montserrat.className}>
        <div id="wrap">
          <StyledComponentsRegistry>
            <AuthProvider>
              <LayoutContent>{children}</LayoutContent>
            </AuthProvider>
          </StyledComponentsRegistry>
        </div>
        <div id="modal-root"></div>
      </body>
    </html>
  );
};

export default RootLayout;
