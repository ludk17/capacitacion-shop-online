import { ShoppingCart, ImageOff, Check } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

const BACKEND = 'http://localhost:3000';

function formatPrice(price) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(price);
}

export default function ProductCard({ producto }) {
  const { nombre, descripcion, precio, imagen } = producto;
  const imgSrc = imagen ? `${BACKEND}${imagen}` : null;
  const { addItem } = useCart();
  const [agregado, setAgregado] = useState(false);

  function handleAgregar() {
    addItem(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  }

  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">

      {/* Imagen */}
      <div className="relative h-48 bg-slate-50 overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={nombre}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
            <ImageOff size={36} />
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h2 className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">
          {nombre}
        </h2>

        {descripcion && (
          <p className="text-xs text-slate-500 line-clamp-2 flex-1">
            {descripcion}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-indigo-600">
            {formatPrice(precio)}
          </span>

          <button
            id={`btn-agregar-${producto.id}`}
            onClick={handleAgregar}
            className={`flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 active:scale-95
              ${agregado
                ? 'bg-green-500'
                : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
          >
            {agregado ? (
              <>
                <Check size={13} />
                Agregado
              </>
            ) : (
              <>
                <ShoppingCart size={13} />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
