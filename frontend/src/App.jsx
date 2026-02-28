import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import CartPage from './pages/CartPage.jsx';
import VentasPage from './pages/VentasPage.jsx';
import VentaDetallePage from './pages/VentaDetallePage.jsx';
import LoginPage from './pages/LoginPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/mis-compras" element={<VentasPage />} />
              <Route path="/mis-compras/:id" element={<VentaDetallePage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} Mercado UPN. Todos los derechos reservados.
              </p>
              <p className="text-xs text-slate-400">
                Hecho con ❤️ en el curso de Capacitaciones UPN
              </p>
            </div>
          </footer>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
