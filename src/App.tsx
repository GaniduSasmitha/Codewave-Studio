import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// Public Pages
const Home = lazy(() => import('./pages/public/Home'));
const Services = lazy(() => import('./pages/public/Services'));
const Portfolio = lazy(() => import('./pages/public/Portfolio'));
const Pricing = lazy(() => import('./pages/public/Pricing'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Login = lazy(() => import('./pages/public/Login'));
const Signup = lazy(() => import('./pages/public/Signup'));
const Unauthorized = lazy(() => import('./pages/public/Unauthorized'));
const LegalPage = lazy(() => import('./pages/public/LegalPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const OrdersList = lazy(() => import('./pages/admin/OrdersList'));
const OrderDetail = lazy(() => import('./pages/admin/OrderDetail'));
const MessagesList = lazy(() => import('./pages/admin/MessagesList'));

// Guard
import ProtectedRoute from './components/ProtectedRoute';
import RouteWaveTransition from './components/RouteWaveTransition';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <CustomCursor />
        <ScrollToTop />
        <RouteWaveTransition />
        <Suspense fallback={<div className="min-h-screen bg-[#0B132B]" />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/privacy" element={<LegalPage policy="privacy" />} />
            <Route path="/terms" element={<LegalPage policy="terms" />} />
            <Route path="/refund-policy" element={<LegalPage policy="refund" />} />
            <Route path="/cookies" element={<LegalPage policy="cookies" />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<OrdersList />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="messages" element={<MessagesList />} />
            </Route>
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
