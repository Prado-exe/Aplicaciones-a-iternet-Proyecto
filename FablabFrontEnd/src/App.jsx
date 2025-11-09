import { useState, useEffect } from "react";
import Navbar from "./componentes/Navbar";
import UniqueDivider from "./componentes/UniqueDivider";
import Footer from "./componentes/footbar";
import BtnVolverInicio from "./componentes/BtnVolverInicio";
import CarruselMain from "./componentes/CarruselMain";
import EventosSection from "./componentes/EventosSection";
import ProyectosSection from "./componentes/ProyectosSection";
import TalleresSection from "./componentes/TalleresSection";
import AreasSection from "./componentes/AreasSection";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/App.css";

function App() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const newOpacity = Math.max(1 - (scrollTop / 400) * 0.6, 0);
      setOpacity(newOpacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 🔹 Navbar fija */}
      <Navbar />

      {/* 🔹 Ajuste de padding exacto para evitar corte del carrusel */}
      <div className="pt-[88px] bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f]">
        {/* 🔹 Carrusel principal */}
        <CarruselMain style={{ opacity }} />

        {/* 🔸 Sección: Áreas de trabajo */}
        <section className="bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] py-4">
          <AreasSection />
        </section>

        <section className="bg-gradient-to-b from-[#0b0b0f] via-[#0d0d12] to-[#0b0b0f]">
          <UniqueDivider />
        </section>

        {/* 🔸 Sección: Talleres destacados */}
        <section className="bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] py-4">
          <TalleresSection />
        </section>

        <section className="bg-gradient-to-b from-[#0b0b0f] via-[#0d0d12] to-[#0b0b0f]">
          <UniqueDivider />
        </section>

        {/* 🔸 Sección: Próximos eventos */}
        <section className="bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] py-4">
          <EventosSection />
        </section>

        <section className="bg-gradient-to-b from-[#0b0b0f] via-[#0d0d12] to-[#0b0b0f]">
          <UniqueDivider />
        </section>

        {/* 🔸 Sección: Proyectos novedosos */}
        <section className="bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] py-4">
          <ProyectosSection />
        </section>

        {/* 🔹 Botón volver arriba */}
        <BtnVolverInicio />

        {/* 🔹 Footer */}
        <Footer />
      </div>
    </>
  );
}

export default App;
