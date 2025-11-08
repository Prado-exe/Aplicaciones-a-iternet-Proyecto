import React, { useState, useEffect } from 'react';
import '../styles/NavBar.css';
import logo from '../assets/logo_test.png';
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Intentar recuperar el usuario del localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
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
          <li><Link to="/" onClick={handleLinkClick}>Inicio</Link></li>
          <li><Link to="/pag-quienes-somos" onClick={handleLinkClick}>Quiénes Somos</Link></li>
          <li><Link to="/pag-servicios" onClick={handleLinkClick}>Servicios</Link></li>
          <li><Link to="/pag-noticiero" onClick={handleLinkClick}>Eventos</Link></li>

          <li className="menu-item user-section">
            {!user ? (
              <button
                className="btn-acceder"
                onClick={() => navigate('/login')}
              >
                Acceder
              </button>
            ) : (
              <div className="user-info">
                <span className="user-name">{user.nombre.split(' ')[0]}</span>
                <Link to="/mi-cuenta" className="user-account" onClick={handleLinkClick}>
                  Mi cuenta
                </Link>
                <button className="btn-logout" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
