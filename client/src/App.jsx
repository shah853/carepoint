import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';
import AppRoutes from './context/AppRoutes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function AppContent() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {isAdminRoute ? null : <Navbar />}
      <AppRoutes />
      {isAdminRoute ? null : <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;