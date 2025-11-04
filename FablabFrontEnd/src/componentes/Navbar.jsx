import React, { useState, useEffect } from 'react';
import '../styles/NavBar.css';
import logo from '../assets/logo_test.png';
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);       
  const [subOpen, setSubOpen] = useState(null);  

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) {
        setOpen(false);
        setSubOpen(null);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setSubOpen(null);
      }
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleLinkClick = () => {
    setOpen(false);
    setSubOpen(null);
  };

const isMobile = () => window.innerWidth <= 768;

  
const handleParentClick = (key) => {
  if (window.innerWidth > 768) return; 
  setSubOpen(prev => (prev === key ? null : key));
};


  return (
    <header className="header">
      <a href="/" className="logo" aria-label="Inicio">
        <img src={logo} alt="Logo FABLAB" />
      </a>

      <button
        className="menu-toggle"
        aria-label="Abrir menú"
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen(!open)}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <nav id="primary-navigation" className={`navbar ${open ? 'open' : ''}`}>
        <ul className="menu">
          {/* INICIO */}
          <li className="menu-item">
            <Link to="/" className="menu-parent" onClick={handleLinkClick}>
              Inicio
            </Link>
          </li>
          {/* SOBRE NOSOTROS */}
          <li className="menu-item">
            <Link to="/pag-quienes-somos" className="menu-parent" onClick={handleLinkClick}>
              Quiénes Somos
            </Link>
          </li>
          {/* SERVICIOS */}
          <li className="menu-item">
            <Link to="/pag-servicios" className="menu-parent" onClick={handleLinkClick}>
              Servicios
            </Link>
          </li>
          {/* NOTICIAS */}
          <li className="menu-item">
            <Link to="/pag-noticiero" className="menu-parent" onClick={handleLinkClick}>
              Eventos
            </Link>
          </li>

        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
