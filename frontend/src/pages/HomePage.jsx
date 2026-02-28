import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import SearchBar from '../components/SearchBar.jsx';

const BACKEND = 'http://localhost:3000';

export default function HomePage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch(`${BACKEND}/api/productos`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar productos');
        return res.json();
      })
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
          Bienvenido a <span className="text-indigo-600">Mercado UPN</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Encuentra los mejores productos al mejor precio
        </p>
      </div>

      {/* Buscador */}
      <div className="mb-8">
        <SearchBar value={busqueda} onChange={setBusqueda} />
      </div>

      {/* Estados */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-20 text-red-500 text-sm">{error}</div>
      )}

      {!loading && !error && productosFiltrados.length === 0 && (
        <div className="text-center py-20 text-slate-400 text-sm">
          No se encontraron productos para &quot;{busqueda}&quot;
        </div>
      )}

      {/* Grid de productos */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </main>
  );
}
