import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: '',
  });

  function handleChange(e) {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validaciones en el cliente
    if (form.nombre.trim().length < 2) {
      return setError('El nombre debe tener al menos 2 caracteres.');
    }
    if (form.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }
    if (form.password !== form.confirmar) {
      return setError('Las contraseñas no coinciden.');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          password: form.password,
          rol: 'cliente',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Redirigir al login después de 2 segundos
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.error || 'Ocurrió un error al registrar el usuario.');
      }
    } catch {
      setError('No se pudo conectar con el servidor. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
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
            <p className="text-sm text-slate-400 mt-1">Crea tu cuenta gratis</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 flex flex-col gap-5">

          {/* Éxito */}
          {success ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={30} className="text-green-500" />
              </div>
              <div>
                <p className="text-slate-800 font-semibold text-lg">¡Cuenta creada!</p>
                <p className="text-slate-400 text-sm mt-1">
                  Tu cuenta fue registrada exitosamente.<br />
                  Redirigiendo al inicio de sesión…
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Error global */}
              {error && (
                <div
                  id="registro-error"
                  className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-4 py-3"
                >
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nombre" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Nombre completo
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  />
                </div>
              </div>

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
                    autoComplete="new-password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
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

              {/* Confirmar contraseña */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmar" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="confirmar"
                    name="confirmar"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={form.confirmar}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Botón registrar */}
              <button
                id="btn-registro"
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer mt-1"
              >
                {loading ? 'Registrando…' : 'Crear cuenta'}
              </button>
            </form>
          )}

          {/* Divider */}
          {!success && (
            <>
              <div className="flex items-center gap-3">
                <hr className="flex-1 border-slate-100" />
                <span className="text-xs text-slate-300">o</span>
                <hr className="flex-1 border-slate-100" />
              </div>

              {/* Ya tienes cuenta */}
              <p className="text-center text-sm text-slate-500">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Inicia sesión
                </Link>
              </p>
            </>
          )}
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
