import React from "react";
import { Link } from "react-router-dom";
import "../styles/Noticiero.css";

const notices = [
  {
    img: "https://scontent.flsc1-1.fna.fbcdn.net/v/t51.82787-15/514238617_18073073048501606_2446256002441196934_n.webp?...",
    title: "GameJam",
    description:
      "Participa en la GameJam para obtener premios y ostentar el primer lugar. Jugosos premios te esperan, haz clic para saber más.",
    date: "Agosto-Septiembre",
    important: true,
  },
  {
    img: "https://scontent.flsc1-1.fna.fbcdn.net/v/t39.30808-6/459023620_18037985900501606_8999948346806728511_n.jpg?...",
    title: "Crazy Bots",
    description:
      "Entra al ring con tu robot personalizado y enfréntate a otros por el trono. Haz clic en el botón para saber más.",
    date: "Diciembre",
    important: true,
  },
  {
    img: "https://scontent.flsc1-1.fna.fbcdn.net/v/t51.75761-15/497280950_18067981244501606_221445847162349277_n.webp?...",
    title: "Robot-Mania",
    description:
      "Aventúrate por las playas de La Serena para construir un robot y limpiar nuestras costas. Haz clic en el botón para saber más.",
    date: "Septiembre",
    important: true,
  },
];

function ImportantNews() {
  const importantNotices = notices.filter((n) => n.important).slice(0, 3);

  return (
    <div className="important-news">
      <h2 className="section-title">Eventos Destacados</h2>
      <br />
      <div className="important-grid">
        {importantNotices.map((n, idx) => (
          <div className="important-card" key={idx}>
            <img src={n.img} alt={n.title} className="important-img" />
            <div className="important-info">
              <h3 className="important-title">{n.title}</h3>
              <p className="important-description">{n.description}</p>
              <span className="important-date">{n.date}</span>
              <Link to="/pag-noticiero" className="important-btn">
                Saber más
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImportantNews;
