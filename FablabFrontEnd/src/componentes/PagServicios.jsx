import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "../styles/PagServicios.css";

export default function PagServicios() {
  const bloques = [
    {
      id: "laser",
      titulo: "Cortadora Láser",
      desc: `Nuestra cortadora láser permite realizar cortes y grabados de alta precisión en
      madera, acrílico, cartón y otros materiales. Es ideal para crear prototipos, maquetas
      arquitectónicas, piezas personalizadas y trabajos artísticos, ofreciendo acabados limpios
      y gran velocidad de producción.`,
      img: "https://ecut.cl/wp-content/uploads/2021/05/Laser-EL-6040.webp",
    },
    {
      id: "impresion3d",
      titulo: "Impresión 3D",
      desc: `Con nuestra zona de impresión 3D puedes materializar cualquier diseño en pocas horas.
      Desde piezas funcionales hasta modelos de exposición, disponemos de impresoras de filamento
      y resina que ofrecen diferentes niveles de detalle y resistencia, acompañadas de asesoría
      para preparar correctamente tus archivos y configuraciones.`,
      img: "https://mecaluxcl.cdnwm.com/blog/img/impresora-3d-logistica.1.0.jpg",
    },
    {
      id: "electronica",
      titulo: "Electrónica y Robótica",
      desc: `Espacio equipado para el desarrollo de circuitos, soldadura, programación de
      microcontroladores y pruebas de prototipos electrónicos. Contamos con herramientas e
      instrumentación básica, además de orientación para que puedas llevar a cabo proyectos de
      robótica, IoT o automatización.`,
      img: "https://a.storyblok.com/f/169662/1200x627/4958ad2943/proyectos-de-electro-nica-y-robo-tica.jpg",
    },
    {
      id: "vr-ar",
      titulo: "Realidad Virtual (VR-AR)",
      desc: `Área dedicada a experiencias inmersivas para pruebas de proyectos interactivos,
      simulaciones, visualización de modelos 3D y demostraciones educativas. Incluye equipos de
      última generación y un espacio seguro para la exploración de entornos virtuales o
      aumentados.`,
      img: "https://userena.cl/images/imagenes_articulos/uls_noticias/2023/junio/nota_junio_19_1_1.jpg",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="svcS">
        <header className="svcS-header">
          <h1>Servicios del FABLAB</h1>
          <p>Equipamiento y acompañamiento para transformar tus ideas en prototipos reales.</p>
        </header>

        <div className="svcS-grid">
          {bloques.map((b, i) => (
            <section
              key={b.id}
              className={`svcS-row ${i % 2 ? "invert" : ""} animate-card`}
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <div className="svcS-info">
                <h2 className="svcS-title">{b.titulo}</h2>
                <p className="svcS-desc">{b.desc}</p>
                <Link className="btn primary" to={`/reserva/${b.id}`}>
                  Reservar una hora
                </Link>
              </div>

              <figure className="svcS-media" aria-hidden="true">
                <img src={b.img} alt={b.titulo} loading="lazy" />
              </figure>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
