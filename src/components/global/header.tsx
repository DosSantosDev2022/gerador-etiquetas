// src/components/Header.tsx

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-blue-900 shadow-md flex items-center px-8 z-50"> 
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="font-bold text-2xl text-primary-foreground ml-10">Gerador de Etiquetas TJ</h1>
      </div>
    </header>
  );
}