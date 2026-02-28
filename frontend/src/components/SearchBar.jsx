import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        id="input-buscar"
        type="text"
        placeholder="Buscar productos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 pl-11 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
