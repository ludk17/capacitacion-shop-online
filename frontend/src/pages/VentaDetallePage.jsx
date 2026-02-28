import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

const BACKEND = 'http://localhost:3000';

function formatPrice(price) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price);
}

function formatFecha(iso) {
  return new Date(iso).toLocaleString('es-PE', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export default function VentaDetallePage() {
  const { id } = useParams();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND}/api/ventas/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Venta no encontrada');
        return r.json();
      })
      .then(setVenta)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Volver */}
      <Link
        to="/mis-compras"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-8"
      >
        <ArrowLeft size={15} />
        Mis Compras
      </Link>

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

      {/* Detalle */}
      {venta && (
        <div className="flex flex-col gap-6">

          {/* Cabecera */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Número de pedido</p>
                <h1 className="text-2xl font-bold text-slate-800">#{venta.id}</h1>
                <p className="text-xs text-slate-400 mt-1">{formatFecha(venta.fecha)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Total pagado</p>
                <p className="text-2xl font-bold text-indigo-600">{formatPrice(venta.total)}</p>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Package size={15} className="text-indigo-500" />
                Productos
              </h2>
            </div>

            <div className="divide-y divide-slate-50">
              {venta.detalle.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.nombre_producto}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatPrice(item.precio_unitario)} × {item.cantidad}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-700 flex-shrink-0">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal (sin IGV)</span>
                <span>{formatPrice(venta.total / 1.18)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>IGV (18%)</span>
                <span>{formatPrice(venta.total - venta.total / 1.18)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 text-base pt-1 border-t border-slate-200">
                <span>Total</span>
                <span className="text-indigo-600">{formatPrice(venta.total)}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </main>
  );
}
