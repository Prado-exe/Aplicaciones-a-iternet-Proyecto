import { useState, useEffect } from 'react';
import '../styles/BtnVolverInicio.css';

function BtnVolverInicio() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        aria-label="Volver arriba"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full 
                   bg-gradient-to-br from-yellow-400 to-yellow-500 
                   text-black flex items-center justify-center 
                   shadow-[0_0_20px_rgba(255,215,0,0.5)] 
                   hover:shadow-[0_0_35px_rgba(255,215,0,0.8)] 
                   hover:scale-110 transition-all duration-300 
                   animate-pulse"
      >
        <i className="bi bi-arrow-up-short text-3xl font-bold"></i>
      </button>
    )
  );
}

export default BtnVolverInicio;
