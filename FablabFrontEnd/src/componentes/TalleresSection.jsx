import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/TalleresSection.css';

const talleres = [
  {
    id: 1,
    nombre: "Taller de Modelado 3D",
    desc: "Aprende a diseñar y modelar piezas en 3D, desde la idea hasta el archivo para impresión.",
    img: "https://crehana-blog.imgix.net/media/filer_public/ef/4d/ef4ddf09-2d7b-41a4-8d6c-213b5111d4eb/modelado-de-bordes.jpg?auto=format&q=50"
  },
  {
    id: 2,
    nombre: "Arduino",
    desc: "Introducción interactiva al mundo de la electrónica y la programación con Arduino.",
    img: "https://i0.wp.com/dronebotworkshop.com/wp-content/uploads/2023/04/dronebotworkshop-arduino-uno.png?fit=347%2C246&ssl=1"
  },
  {
    id: 3,
    nombre: "Taller de Unity",
    desc: "Primeros pasos en el desarrollo de videojuegos y simulaciones 3D con Unity.",
    img: "https://unity.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ffuvbjjlp%2Fproduction%2F6d1df49565a2ad20ffa8386f1465ba52039133e3-1920x1080.png&w=3840&q=75"
  }
];

function TalleresSection() {
  const navigate = useNavigate();

  const handleMasTalleres = () => {
    navigate('/pag-talleres');
  };

  return (
    <section className="talleres-section">
      <div className="talleres-header">
        <h2 className="talleres-title">Talleres destacados</h2>
        <button className="mas-talleres-btn" onClick={handleMasTalleres}>
          Más talleres
        </button>
      </div>

      <div className="talleres-cards-main">
        {talleres.map(taller => (
          <div className="taller-card" key={taller.id}>
            <img 
              src={taller.img} 
              alt={taller.nombre} 
              className="taller-img"
              loading="lazy"   // carga diferida
            />
            <h3 className="taller-nombre">{taller.nombre}</h3>
            <p className="taller-desc">{taller.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TalleresSection;
