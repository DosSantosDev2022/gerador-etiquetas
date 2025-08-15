// src/components/Footer.tsx

import React from 'react';

// Definindo o tipo das props, mesmo que vazio, é uma boa prática em TypeScript.
type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-primary-foreground py-6 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted">
          &copy; {currentYear} Desenvolvido por <a className='hover:text-primary-foreground hover:underline transition-all duration-300' target='_blank' href="https://github.com/DosSantosDev2022">Juliano Santos.</a>
        </p>
      </div>
    </footer>
  );
};

export  {Footer};