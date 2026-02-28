import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <ShoppingCart size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Mercado <span className="text-indigo-600">UPN</span>
            </span>
          </Link>

          {/* Nav links – desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Inicio</Link>
            <a href="#categorias" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Categorías</a>
            <a href="#ofertas" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Ofertas</a>
            <a href="#contacto" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Contacto</a>
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            {/* Carrito */}
            <button
              id="btn-cart"
              onClick={() => navigate('/carrito')}
              className="relative p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              aria-label="Ver carrito"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Usuario */}
            <button
              id="btn-user"
              className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-slate-700"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                <User size={13} className="text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium">Mi cuenta</span>
            </button>

            {/* Hamburger – móvil */}
            <button
              id="btn-menu"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1">
          {['Inicio', 'Categorías', 'Ofertas', 'Contacto'].map((item) => (
            <button
              key={item}
              className="py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
