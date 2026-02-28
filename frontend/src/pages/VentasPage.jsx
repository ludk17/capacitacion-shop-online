import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, ArrowLeft, Receipt } from 'lucide-react';

const BACKEND = 'http://localhost:3000';

function formatPrice(price) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price);
}

function formatFecha(iso) {
  return new Date(iso).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND}/api/ventas`)
      .then((r) => {
        if (!r.ok) throw new Error('Error al cargar compras');
        return r.json();
      })
      .then(setVentas)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Receipt size={20} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mis Compras</h1>
          <p className="text-xs text-slate-400">Historial de pedidos realizados</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-sm text-red-500 py-20">{error}</p>
      )}

      {/* Vacío */}
      {!loading && !error && ventas.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <ShoppingBag size={56} className="text-slate-200" />
          <p className="text-slate-400 text-sm">Aún no has realizado ninguna compra.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft size={15} />
            Ir a la tienda
          </Link>
        </div>
      )}

      {/* Lista de ventas */}
      {!loading && !error && ventas.length > 0 && (
        <div className="flex flex-col gap-3">
          {ventas.map((venta) => (
            <div
              key={venta.id}
              className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">Pedido</span>
                <span className="text-sm font-bold text-slate-800">#{venta.id}</span>
                <span className="text-xs text-slate-400">{formatFecha(venta.fecha)}</span>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-lg font-bold text-indigo-600">{formatPrice(venta.total)}</span>
              </div>

              <Link
                to={`/mis-compras/${venta.id}`}
                id={`btn-detalle-${venta.id}`}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors cursor-pointer flex-shrink-0"
              >
                Detalle
                <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
