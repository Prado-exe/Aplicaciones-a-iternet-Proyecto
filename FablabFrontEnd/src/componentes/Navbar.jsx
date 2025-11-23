import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/FABLABHorizaontalBlanco.svg";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";

// 🔹 Clases para los links del menú (versión desktop)
const navLinkClass = ({ isActive }) =>
  [
    "relative px-4 py-1.5 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer",
    isActive
      ? [
          // ACTIVO → pastilla dorada + brillo (SIN reflejo abajo)
          "text-black bg-yellow-400 rounded-full",
          "shadow-[0_0_18px_rgba(250,204,21,0.9)]",
        ].join(" ")
      : // NORMAL
        "text-gray-100 hover:text-yellow-300",
  ].join(" ");

// 🔹 Versión simplificada para el menú móvil
const navLinkClassMobile = ({ isActive }) =>
  [
    "relative text-lg font-medium transition-all duration-200",
    isActive ? "text-yellow-300" : "text-white hover:text-yellow-300",
  ].join(" ");

export default function Navbar() {
  const [open, setOpen] = useState(false); // menú móvil
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // menú del avatar

  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();  
  const isAdmin = user?.TipoUsuario === 1;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      setUserMenuOpen(false); // cierro el menú de usuario si hago scroll
    };

    const handleResize = () => {
      if (window.innerWidth > 768) setOpen(false); // cierro menú móvil en escritorio
      setUserMenuOpen(false); // y también el menú de usuario
    };

    const handleKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleLogout = () => { //Si deslogea
    logout(); //Borramos user,token y limpiamos localstorage
    setUserMenuOpen(false); // cierra menú del avatar
    navigate('/');
  };

  // Nombre que vamos a mostrar (Nickname > primer nombre > "Usuario")
  const displayName =
    user?.Nickname || user?.NombreUsuario?.split(" ")[0] || "Usuario";

  // Si más adelante guardan una URL de foto de perfil, se usará aquí
  const avatarUrl = user?.FotoPerfil || null;

  // Inicial (primer carácter) para mostrar dentro del circulito si no hay foto
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0b0f] shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-500">
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="FABLAB FIULS" className="h-12   w-auto" />
        </Link>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex items-center gap-6 text-white font-medium">
          <li>
            <NavLink to="/" className={navLinkClass} end>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pag-quienes-somos"
              className={navLinkClass}
            >
              Quiénes Somos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pag-servicios"
              className={navLinkClass}
            >
              Servicios
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pag-noticiero"
              className={navLinkClass}
            >
              Eventos
            </NavLink>
          </li>

          {/* 🔹 Si hay usuario logueado → avatar tipo GitHub + menú */}
          {isAuthenticated ? (
            <li className="relative">
              {/* Botón avatar circular */}
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-[#ffd700] flex items-center justify-center overflow-hidden border border-[#fff6a3] hover:border-white transition"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar usuario"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-black font-bold text-lg">
                    {initial}
                  </span>
                )}
              </button>

              {/* Dropdown del usuario (Mi Cuenta / Mis Proyectos / Cerrar Sesión) */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#111111] border border-[#ffd700]/70 rounded-2xl shadow-xl text-sm text-white">
                  {/* Cabecera con nombre de usuario */}
                  <div className="px-4 py-3 border-b border-[#ffd700]/50">
                    <p className="text-xs text-gray-400">Usuario</p>
                    <p className="font-semibold text-[#ffdf5b] truncate">
                      {displayName}
                    </p>
                  </div>

                  {/* Opciones */}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/mi-cuenta");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-[#ffdf5b] hover:text-black"
                  >
                    Mi Cuenta
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/mis-proyectos");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-[#ffdf5b] hover:text-black"
                  >
                    Mis Proyectos
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/admin");
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-[#ffdf5b] hover:text-black"
                    >
                      Panel de Administración
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-[#ff4b4b] hover:bg-[#ff4b4b] hover:text-black rounded-b-2xl"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </li>
          ) : (
            // 🔹 Si NO hay usuario → botón Acceder
            <li>
              <button
                onClick={() => navigate("/auth")}
                className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-full shadow-md hover:shadow-[0_0_18px_rgba(250,204,21,0.9)] hover:bg-yellow-400 transition"
              >
                Acceder
              </button>
            </li>
          )}
        </ul>

        {/* BOTÓN MÓVIL (hamburguesa) */}
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
          <ul className="flex flex-col items-center gap-5 py-6 text-white font-medium">
            <li>
              <NavLink
                to="/"
                end
                className={navLinkClassMobile}
                onClick={() => setOpen(false)}
              >
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/pag-quienes-somos"
                className={navLinkClassMobile}
                onClick={() => setOpen(false)}
              >
                Quiénes Somos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/pag-servicios"
                className={navLinkClassMobile}
                onClick={() => setOpen(false)}
              >
                Servicios
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/pag-noticiero"
                className={navLinkClassMobile}
                onClick={() => setOpen(false)}
              >
                Eventos
              </NavLink>
            </li>

            {isAuthenticated ? (
              <>
                <li className="text-[#ffdf5b] font-semibold">
                  {`Conectado: ${displayName}`}
                </li>
                <li>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/mi-cuenta");
                    }}
                  >
                    Mi Cuenta
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/mis-proyectos");
                    }}
                  >
                    Mis Proyectos
                  </button>
                </li>
              

                
                <li>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="text-[#ff4b4b] hover:text-red-300"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    navigate("/auth");
                    setOpen(false);
                  }}
                  className="bg-yellow-400 text-black px-5 py-2 rounded-full font-semibold shadow-md hover:bg-yellow-400 hover:shadow-[0_0_18px_rgba(250,204,21,0.9)] transition"
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
