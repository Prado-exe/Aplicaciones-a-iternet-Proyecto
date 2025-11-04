import { useState, useEffect } from 'react';
import '../styles/Carousel.css';

const images = [
  'https://www.userena.cl/images/logos_web/descarga/logo-uls-vertical.png',
  'https://fablab.fiuls.cl/wp-content/uploads/2024/08/Grafica-Mousepad-FABLAB-1.png',
  // etc.
];

function Carousel() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(false);
  const length = images.length;

  // Cambio automático cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      handleChange(current === length - 1 ? 0 : current + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [current, length]);

  function handleChange(nextIndex) {
    setFade(true);
    setTimeout(() => {
      setCurrent(nextIndex);
      setFade(false);
    }, 400); // Debe ser igual o menor que el transition en CSS
  }

  const nextSlide = () => handleChange(current === length - 1 ? 0 : current + 1);
  const prevSlide = () => handleChange(current === 0 ? length - 1 : current - 1);

  if (length === 0) return null;

  return (
    <div className="carousel-outer">
      <div className="carousel-inner">
        <button onClick={prevSlide} className="left-arrow">&#10094;</button>
        <div className={`slide-container${fade ? ' fade-out' : ''}`}>
          <img
            src={images[current]}
            alt={`Slide ${current + 1}`}
            className="carousel-image"
          />
        </div>
        <button onClick={nextSlide} className="right-arrow">&#10095;</button>
      </div>
    </div>
  );
}

export default Carousel;
