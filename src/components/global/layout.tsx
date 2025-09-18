// src/components/global/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';
import { Toaster } from '../ui/sonner';

export function Layout() {
  return (
    <>
      <div className="app-container min-h-screen flex flex-col bg-muted ">
        <Header />
        <main className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-20 flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster position="top-center" richColors/>
    </>
  );
}