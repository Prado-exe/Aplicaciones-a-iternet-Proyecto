import { useNavigate } from 'react-router-dom';
import '../styles/AreasSection.css';

const areas = [
  {
    id: 1,
    nombre: "Impresión 3D",
    desc: "Crea prototipos y piezas personalizadas con tecnologías de fabricación aditiva.",
    img: "https://hacedores.com/wp-content/uploads/2024/03/Replicator-la-impresora-3D-que-utiliza-la-luz-para-crear-objetos-copia-e1711563345534-1080x567.webp"
  },
  {
    id: 2,
    nombre: "Cortadora Láser",
    desc: "Cortes y grabados de alta precisión en acrílico, MDF, cartón y más.",
    img: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Cortadora_Laser_-_FabLAB_Newton.jpg"
  },
  {
    id: 3,
    nombre: "Realidad Virtual (RV)",
    desc: "Experimenta simulaciones e interacción inmersiva a través de dispositivos VR.",
    img: "https://i.blogs.es/3e7bdd/realidad-virtual/1366_2000.jpg"
  },
];

function AreasSection({ handleLinkClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (handleLinkClick) {
      handleLinkClick(e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate('/pag-servicios'), 350);
  };

  return (
    <section className="areas-principales-section">
      <div className="areas-header">
        <h2 className="areas-title">Áreas de trabajo</h2>
        <button className="mas-areas-btn" onClick={handleClick}>
          Más áreas
        </button>
      </div>

      <div className="areas-cards-main">
        {areas.map(area => (
          <div className="area-card" key={area.id}>
            <img src={area.img} alt={area.nombre} className="area-img" />
            <h3 className="area-nombre">{area.nombre}</h3>
            <p className="area-desc">{area.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AreasSection;
