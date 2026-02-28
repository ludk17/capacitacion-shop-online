import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: conectar con la API de autenticación
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <ShoppingCart size={22} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800">
              Mercado <span className="text-indigo-600">UPN</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Inicia sesión en tu cuenta</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 flex flex-col gap-5">

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Olvidé contraseña */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón */}
            <button
              id="btn-login"
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer mt-1"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-slate-100" />
            <span className="text-xs text-slate-300">o</span>
            <hr className="flex-1 border-slate-100" />
          </div>

          {/* Registro */}
          <p className="text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors cursor-pointer"
            >
              Regístrate
            </button>
          </p>
        </div>

        {/* Volver */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-400 hover:text-indigo-500 transition-colors">
            ← Volver a la tienda
          </Link>
        </div>

      </div>
    </div>
  );
}
