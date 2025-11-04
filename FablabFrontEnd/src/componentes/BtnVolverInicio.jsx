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
      <button className="scroll-to-top" onClick={scrollToTop} aria-label="Ir arriba">
        &#8679;
      </button>
    )
  );
}

export default BtnVolverInicio;