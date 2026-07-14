import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import PageLoader from './components/PageLoader';

// Lazy-loaded pages for route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const Convert = lazy(() => import('./pages/Convert'));
const About = lazy(() => import('./pages/About'));
const Features = lazy(() => import('./pages/Features'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg, #161B34)',
            color: '#F7F7FC',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
        }}
      />
      <MainLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/convert" element={<Convert />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </>
  );
}
