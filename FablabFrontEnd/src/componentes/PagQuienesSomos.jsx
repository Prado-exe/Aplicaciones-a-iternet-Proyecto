import React from "react";
import Navbar from "./Navbar";
import misionImg from "../assets/ImagenMision.png";
import visionImg from "../assets/ImagenVision.png";
import staff1 from "../assets/StaffRicardo.png";
import staff2 from "../assets/StaffMarcelo.png";
import UniqueDivider from "./UniqueDivider";

const PagQuienesSomos = () => {
  return (
    <>
      <Navbar />

      {/* 🔹 Margen superior para que no choque con el Navbar */}
      <div className="pt-24 bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] text-gray-200 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-20 py-16">

          {/* Sección Staff */}
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] mb-8 animate-fadeDown">
              Conoce al Staff
            </h2>
            <div className="flex flex-wrap justify-center gap-10">
              {[{
                img: staff1,
                nombre: "Ricardo Campos Villarroel",
                rol: "Coordinador de Laboratorio",
              },{
                img: staff2,
                nombre: "Marcelo Chávez Vicencio",
                rol: "Encargado de Proyectos",
              }].map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center bg-gray-800/40 rounded-xl p-6 shadow-[0_0_20px_rgba(255,215,0,0.1)] 
                             transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-500">
                  <img
                    src={s.img}
                    alt={s.nombre}
                    className="w-48 h-48 rounded-lg object-cover mb-4"
                  />
                  <p className="text-lg font-semibold text-yellow-400">{s.nombre}</p>
                  <p className="text-sm text-gray-300">{s.rol}</p>
                </div>
              ))}
            </div>
          </div>

          <UniqueDivider />

          {/* Sección Quiénes Somos */}
          <div className="text-center max-w-3xl animate-fadeIn">
            <h1 className="text-5xl font-bold text-yellow-400 mb-6 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              Quiénes Somos
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Bienvenido a la página de <span className="text-yellow-400 font-semibold">Quiénes Somos</span>. Aquí puedes contar la historia, misión, visión y valores de tu organización.
            </p>
          </div>

          <UniqueDivider />

          {/* Misión */}
          <div className="flex flex-col md:flex-row items-center gap-10 animate-fadeLeft">
            <div className="flex-1 flex justify-center">
              <img
                src={misionImg}
                alt="Misión"
                className="w-full max-w-md rounded-xl shadow-[0_0_25px_rgba(255,215,0,0.2)]"
              />
            </div>
            <div className="flex-1 text-left md:pl-6">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">Misión</h2>
              <p className="text-gray-300 leading-relaxed">
                Nuestra misión es fomentar la utilización de tecnologías de la información y software como herramientas clave para la creación, diseño y emprendimiento de nuevos productos, bienes y servicios.
              </p>
            </div>
          </div>

          <UniqueDivider />

          {/* Visión */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 animate-fadeRight">
            <div className="flex-1 flex justify-center">
              <img
                src={visionImg}
                alt="Visión"
                className="w-full max-w-md rounded-xl shadow-[0_0_25px_rgba(255,215,0,0.2)]"
              />
            </div>
            <div className="flex-1 text-left md:pr-6">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">Visión</h2>
              <p className="text-gray-300 leading-relaxed">
                El propósito de FABLAB FIULS es proporcionar un entorno de innovación y colaboración donde estudiantes, académicos, investigadores y emprendedores puedan aplicar su creatividad y pensamiento crítico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PagQuienesSomos;
