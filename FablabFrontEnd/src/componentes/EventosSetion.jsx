import { Link, useNavigate } from 'react-router-dom';
import '../styles/EventosSection.css';

const eventos = [
  { id: 1, titulo: "JAM", fecha: "20/09/2025", descripcion: "Diseña tu propio videojuego" },
  { id: 2, titulo: "EJEMPLO DE EVENTO", fecha: "25/09/2025", descripcion: "Descubre proyectos y metodologías de prototipado." },
  { id: 3, titulo: "EJEMPLO DE EVENTO", fecha: "28/09/2025", descripcion: "Iniciación práctica a circuitos y Arduino." }
];

function EventosSection({ handleLinkClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (handleLinkClick) {
      handleLinkClick(e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="eventos-section">
      <div className="eventos-header">
        <h2 className="eventos-title">Próximos Eventos</h2>
        <Link
          to="/pag-noticiero"
          className="mas-eventos-btn"
          onClick={handleClick}
        >
          Más eventos
        </Link>
      </div>

      <div className="eventos-cards-main">
        {eventos.map(evento => (
          <div className="evento-card" key={evento.id}>
            <h3 className="evento-titulo">{evento.titulo}</h3>
            <span className="evento-fecha">{evento.fecha}</span>
            <p className="evento-descripcion">{evento.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EventosSection;
