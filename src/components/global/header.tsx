// src/components/Header.tsx

import { Link, NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-blue-900 shadow-md flex items-center px-8 z-50"> 
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-foreground">
          Gerador de Etiquetas TJ
        </Link>
        
        {/* Navegação */}
        <nav className="flex items-center gap-4">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "text-primary-foreground font-semibold" : "text-muted hover:text-primary"}
          >
            Gerar Etiquetas
          </NavLink>
          <NavLink 
            to="/reimprimir"
            className={({ isActive }) => isActive ? "text-primary-foreground font-semibold" : "text-muted hover:text-primary"}
          >
            Reimprimir
          </NavLink>
        </nav>
      </div>
    </header>
  );
}