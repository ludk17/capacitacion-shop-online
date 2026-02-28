import { useState } from 'react';
import { Trash2, ShoppingBag, ArrowLeft, ShoppingCart, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const BACKEND = 'http://localhost:3000';
const API_VENTAS = `${BACKEND}/api/ventas`;

function formatPrice(price) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(price);
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [estado, setEstado] = useState('idle'); // idle | loading | success | error
  const [ventaId, setVentaId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  async function finalizarCompra() {
    setEstado('loading');
    setErrorMsg('');
    try {
      const res = await fetch(API_VENTAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productos: items.map((i) => ({ id: i.id, cantidad: i.cantidad })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar la venta');
      setVentaId(data.id);
      setEstado('success');
      clearCart();
    } catch (err) {
      setErrorMsg(err.message);
      setEstado('error');
    }
  }

  // ── Pantalla de éxito ────────────────────────────────────────────────────
  if (estado === 'success') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">¡Compra realizada!</h1>
        <p className="text-slate-500 text-sm">
          Tu pedido <span className="font-semibold text-indigo-600">#{ventaId}</span> fue registrado exitosamente.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <ArrowLeft size={16} />
          Seguir comprando
        </Link>
      </main>
    );
  }

  // ── Carrito vacío ────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center gap-6 text-center">
        <ShoppingBag size={64} className="text-slate-200" />
        <h1 className="text-2xl font-bold text-slate-700">Tu carrito está vacío</h1>
        <p className="text-slate-400 text-sm">Agrega productos desde la tienda para continuar.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <ArrowLeft size={16} />
          Ir a la tienda
        </Link>
      </main>
    );
  }

  const igv = totalPrice * 0.18;
  const subtotal = totalPrice - igv;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Mi carrito <span className="text-indigo-600">({totalItems})</span>
        </h1>
        <button
          id="btn-vaciar-carrito"
          onClick={clearCart}
          className="text-xs text-red-400 hover:text-red-600 transition-colors underline underline-offset-2 cursor-pointer"
        >
          Vaciar carrito
        </button>
      </div>

      {/* Layout 2 columnas */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Columna izquierda: lista de productos ── */}
        <div className="flex-1 flex flex-col gap-4">
          {items.map((item) => {
            const imgSrc = item.imagen ? `${BACKEND}${item.imagen}` : null;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
              >
                {/* Imagen */}
                <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {imgSrc ? (
                    <img src={imgSrc} alt={item.nombre} className="w-full h-full object-contain p-1" />
                  ) : (
                    <ShoppingCart size={24} className="text-slate-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.nombre}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatPrice(item.precio)} c/u</p>
                </div>

                {/* Cantidad */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-medium text-slate-700">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <span className="text-sm font-bold text-indigo-600 w-20 text-right">
                  {formatPrice(item.precio * item.cantidad)}
                </span>

                {/* Eliminar */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-300 hover:text-red-400 transition-colors ml-1 cursor-pointer"
                  aria-label="Eliminar producto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}

          {/* Volver */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm transition-colors mt-2 w-fit"
          >
            <ArrowLeft size={15} />
            Seguir comprando
          </Link>
        </div>

        {/* ── Columna derecha: resumen del pedido ── */}
        <div className="w-full lg:w-80 xl:w-96 sticky top-24">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-base font-bold text-slate-800">Resumen del pedido</h2>

            {/* Detalle */}
            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IGV (18%)</span>
                <span>{formatPrice(igv)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-green-500 font-medium">Gratis</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-slate-800">Total</span>
              <span className="text-2xl font-bold text-indigo-600">{formatPrice(totalPrice)}</span>
            </div>

            {/* Error */}
            {estado === 'error' && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center">
                {errorMsg}
              </p>
            )}

            {/* Botón */}
            <button
              id="btn-finalizar-compra"
              onClick={finalizarCompra}
              disabled={estado === 'loading'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {estado === 'loading' ? (
                <><Loader2 size={16} className="animate-spin" /> Procesando...</>
              ) : (
                'Finalizar compra'
              )}
            </button>

            <p className="text-xs text-slate-400 text-center">
              Pago seguro · Devoluciones gratis
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
