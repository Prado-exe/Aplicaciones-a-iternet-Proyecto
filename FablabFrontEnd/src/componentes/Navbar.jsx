import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/Navbar.css'; // Puedes mantener estilos antiguos si hay animaciones globales
import { useAuth } from "../context/AuthContext";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();  

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    const handleResize = () => { if (window.innerWidth > 768) setOpen(false); };
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleLogout = () => { //Si deslogea
    logout(); //Borramos user,token y limpiamos localstorage
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0b0f] shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-500">
      <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="FABLAB FIULS" className="h-10 w-auto" />
          <span className="text-white font-bold text-lg tracking-wide">
            FABLAB <span className="text-yellow-400">FIULS</span>
          </span>
        </Link>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex items-center gap-10 text-white font-medium">
          <li><Link to="/" className="hover:text-yellow-400 transition">Inicio</Link></li>
          <li><Link to="/pag-quienes-somos" className="hover:text-yellow-400 transition">Quiénes Somos</Link></li>
          <li><Link to="/pag-servicios" className="hover:text-yellow-400 transition">Servicios</Link></li>
          <li><Link to="/pag-noticiero" className="hover:text-yellow-400 transition">Eventos</Link></li>

          {/* Si hay usuario logueado */}
          {isAuthenticated ? (
            <li className="flex items-center gap-3">
              <span className="text-yellow-400 font-semibold">{user.NombreUsuario?.split(' ')[0]}</span>
              <Link to="/mi-cuenta" className="hover:text-yellow-400 transition">Mi cuenta</Link>
              <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition">
                Cerrar sesión
              </button>
            </li>
          ) : (
            <li>
              <button
                onClick={() => navigate('/auth')}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-full shadow-lg transition"
              >
                Acceder
              </button>
            </li>
          )}
        </ul>

        {/* BOTÓN MÓVIL */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          <i className={`bi ${open ? "bi-x" : "bi-list"}`}></i>
        </button>

        {/* MENU MÓVIL */}
        <div
          className={`absolute top-full left-0 w-full bg-[#0f0f0f]/95 backdrop-blur-md 
            transition-all duration-500 overflow-hidden md:hidden
            ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <ul className="flex flex-col items-center gap-5 py-6 text-white text-lg font-medium">
            <li><Link to="/" onClick={() => setOpen(false)}>Inicio</Link></li>
            <li><Link to="/pag-quienes-somos" onClick={() => setOpen(false)}>Quiénes Somos</Link></li>
            <li><Link to="/pag-servicios" onClick={() => setOpen(false)}>Servicios</Link></li>
            <li><Link to="/pag-noticiero" onClick={() => setOpen(false)}>Eventos</Link></li>

            {isAuthenticated ? (
              <>
                <li><Link to="/mi-cuenta" onClick={() => setOpen(false)}>Mi cuenta</Link></li>
                <li>
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => { navigate('/auth'); setOpen(false); }}
                  className="bg-yellow-400 text-black px-5 py-2 rounded-full font-semibold shadow-md hover:bg-yellow-500 transition"
                >
                  Acceder
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
