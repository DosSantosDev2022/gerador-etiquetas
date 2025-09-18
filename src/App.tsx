// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/global/layout';
import { GeneratePage } from './pages/GeneratePage';
import { ReprintPage } from './pages/ReprintPage'; // Vamos criar em breve

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* A rota principal (/) renderizará a página de geração */}
        <Route index element={<GeneratePage />} />
        
        {/* A rota /reimprimir renderizará a página de reimpressão */}
        <Route path="reimprimir" element={<ReprintPage />} />
      </Route>
    </Routes>
  );
}

export default App;