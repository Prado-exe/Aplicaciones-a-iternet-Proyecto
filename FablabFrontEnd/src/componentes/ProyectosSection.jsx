import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import '../styles/ProyectosSection.css';

const proyectos = [
  { id: 1, nombre: "Sensor Ambiental", desc: "Monitorea aire y temperatura.", img: "https://prismab.com/wp-content/uploads/2023/11/8.jpg" },
  { id: 2, nombre: "Brazo Robótico", desc: "Brazo programable multiuso.", img: "https://www.esneca.com/wp-content/uploads/brazo-robotico.jpg" },
  { id: 3, nombre: "Cámara IoT", desc: "Vigilancia inteligente conectada.", img: "https://www.ventasdeseguridad.com/images/stories/VDS/2022/1product_m73_2_1510x848.jpg" },
  { id: 4, nombre: "Plotter DIY", desc: "Dibuja y corta por control computarizado.", img: "https://hackaday.com/wp-content/uploads/2023/10/diyplotter_feat.jpg" },
  { id: 5, nombre: "Cultivador Hidropónico", desc: "Sistema automático para plantas.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnk4ldDIqh6WcGvBnX2XYzZfFbELXwOr9a9g&s" },
  { id: 6, nombre: "LED Art", desc: "Instalación artística con LEDs.", img: "https://hyperspacelight.com/cdn/shop/files/HyperCubes-stacked-upon-each-other-to-create-an-LED-art-installation.jpg?v=1689270203&width=3000" },
  { id: 7, nombre: "Control Arduino", desc: "Automatización y domótica.", img: "https://electronicahobby.cl/wp-content/uploads/2024/01/MA2230.webp" },
  { id: 8, nombre: "Impresión 3D", desc: "Diseños personalizados impresos.", img: "https://cdn.artec3d.com/styles/540x380/s3/content-hub-images/how-does-a-3d-printer-work-01.jpg?VersionId=ZFCYg0t3fm4HgXOXfYedNwlGhNp2sbDG&itok=OYwUmTK3" },
];

function LazyCard({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return <div ref={ref} style={{ minHeight: '1px' }}>{isVisible ? children : null}</div>;
}

function ProyectosSection() {
  const navigate = useNavigate();

  const handleMasProyectos = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate('/pag-proyectos'), 300);
  };

  return (
    <section className="proyectos-section">
      <div className="proyectos-header">
        <h2 className="proyectos-title">Proyectos novedosos</h2>
        <button className="mas-proyectos-btn" onClick={handleMasProyectos}>
          Más proyectos
        </button>
      </div>
      <div className="proyectos-cards-main">
        {proyectos.map(proy => (
          <LazyCard key={proy.id}>
            <div className="proyecto-card">
              <img src={proy.img} alt={proy.nombre} className="proyecto-img"/>
              <h3 className="proyecto-nombre">{proy.nombre}</h3>
              <p className="proyecto-desc">{proy.desc}</p>
            </div>
          </LazyCard>
        ))}
      </div>
    </section>
  );
}

export default ProyectosSection;
