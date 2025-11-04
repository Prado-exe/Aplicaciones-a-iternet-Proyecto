import React from "react";
import Navbar from "./Navbar";
import "../styles/PagQuienesSomos.css";

// Imágenes
import misionImg from "../assets/ImagenMision.png";
import visionImg from "../assets/ImagenVision.png";
import staff1 from "../assets/StaffRicardo.png";
import staff2 from "../assets/StaffMarcelo.png";

const PagQuienesSomos = () => {
  return (
    <>
      <Navbar />

      <div className="quienes-somos-container">

        {/* Sección Staff */}
        <div className="staff-section animate-fadeDown">
          <h2>Conoce al Staff</h2>
          <div className="staff-grid">
            <div className="staff-item">
              <img src={staff1} alt="Ricardo" />
              <p className="staff-nombre">Ricardo Campos Villarroel</p>
              <p className="staff-rol">Coordinador de Laboratorio</p>
            </div>
            <div className="staff-item">
              <img src={staff2} alt="Marcelo" />
              <p className="staff-nombre">Marcelo Chávez Vicencio</p>
              <p className="staff-rol">Encargado de Proyectos</p>
            </div>
          </div>
        </div>

        <hr className="separador" />

        {/* Quiénes Somos */}
        <div className="quienes-somos-texto animate-fadeIn">
          <h1>Quiénes Somos</h1>
          <p>
            Bienvenido a la página de <strong>Quiénes Somos</strong>. Aquí puedes contar la historia, misión, visión y valores de tu organización.
          </p>
        </div>

        <hr className="separador" />

        {/* Misión */}
        <div className="bloque-mision-vision mision animate-fadeLeft">
          <div className="bloque-imagen">
            <img src={misionImg} alt="Misión" />
          </div>
          <div className="bloque-texto">
            <h2>Misión</h2>
            <p>
              Nuestra misión es fomentar la utilización de tecnologías de la información y software como herramientas clave para la creación, diseño y emprendimiento de nuevos productos, bienes y servicios.
            </p>
          </div>
        </div>

        <hr className="separador" />

        {/* Visión */}
        <div className="bloque-mision-vision vision animate-fadeRight">
          <div className="bloque-texto">
            <h2>Visión</h2>
            <p>
              El propósito de FABLAB FIULS es proporcionar un entorno de innovación y colaboración donde estudiantes, académicos, investigadores y emprendedores puedan aplicar su creatividad y pensamiento crítico.
            </p>
          </div>
          <div className="bloque-imagen">
            <img src={visionImg} alt="Visión" />
          </div>
        </div>

      </div>
    </>
  );
};

export default PagQuienesSomos;
