import React from "react";
import { Link } from "react-router-dom"; 
import "../styles/Noticiero.css";

const notices = [
  {
    img: "https://scontent.flsc1-1.fna.fbcdn.net/v/t51.82787-15/514238617_18073073048501606_2446256002441196934_n.webp?stp=dst-jpg_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=cWbrLoeLc9oQ7kNvwHdfkEy&_nc_oc=AdldZajfSCvZ9i_GNOXMXoPSDisxTV-mirxidCkY4PIdNh4MfUQL5WD45KUsn5hsw-U&_nc_zt=23&_nc_ht=scontent.flsc1-1.fna&_nc_gid=HT-yw0jMcg_QnsHKbs7S0Q&oh=00_AfYUsyS_yaQwPZ75ZWOrqom8qa7EzIhmKzNJlsgYsaKYGQ&oe=68CB9AAA",
    title: "GameJam",
    description:
      "Participa en la GameJam para obtener premios y ostentar el primer lugar. Jugosos premios te esperan, haz clic para saber más.",
    date: "Agosto-Septiembre",
    important: true,
  },
  {
    img: "https://scontent.flsc1-1.fna.fbcdn.net/v/t39.30808-6/459023620_18037985900501606_8999948346806728511_n.jpg?stp=dst-jpg_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGx4vcrwpSLmyDwt_zl0ayThLeWC_9Ttc2Et5YL_1O1zUiCcCB6eFjwnbFk_RZhirC3NPwtH89IMz0rYcWgcTEB&_nc_ohc=vzJ6F59T0LsQ7kNvwELRvwj&_nc_oc=AdnnGfL7AhlTQU4mU6Dmk-X-jbIMSIe8MV12h_xAEw8bTXzU2y2l8ouyx0H-XMAf_uo&_nc_zt=23&_nc_ht=scontent.flsc1-1.fna&_nc_gid=vI7CwBjQ0gfFQeNKZO54tQ&oh=00_AfbzkYsIz9GcSebBbzk9P03MJfsJD7hbMyZkVOG9Z13GEQ&oe=68CB7FE3",
    title: "Crazy Bots",
    description:
      "Entra al ring con tu robot personalizado y enfréntate a otros por el trono. Haz clic en el botón para saber más.",
    date: "Diciembre",
    important: true,
  },
  {
    img: "https://scontent.flsc1-1.fna.fbcdn.net/v/t51.75761-15/497280950_18067981244501606_221445847162349277_n.webp?stp=dst-jpg_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGQaRQfEMzouk_yTvy7iZLPQKIYBSNiT35AohgFI2JPfsGgak7bNDm8sBESUXHCGJ1OwdReV1CKuD3lwV0H8qd0&_nc_ohc=lKV8sc9qjtgQ7kNvwHyrhZD&_nc_oc=AdllC3l3x7fVIflfT1ah3A8X63wcEz5LshaIZVLmIFNTwgfgVzc4_j0m51u6UFQXyFw&_nc_zt=23&_nc_ht=scontent.flsc1-1.fna&_nc_gid=ah3vOaibUMjVJJmFPQ33FQ&oh=00_AfaFMWPTbuqatIormpV3Z8TiNcJO1Jh6po7KSMR8_qYfaw&oe=68CB8CA8",
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
              
              {/* ✅ Link como botón */}
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
