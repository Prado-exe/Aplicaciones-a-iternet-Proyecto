import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";
import Logo from "../assets/FABLABHorizaontalBlanco.svg";

export default function Footer() {
  return (
    <footer className="relative -mt-2 bg-gradient-to-t from-black via-gray-900 to-gray-800 text-white backdrop-blur-sm">
      {/* Línea dorada superior animada */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 animate-[pulse_3s_ease-in-out_infinite]" />

      {/* Contenedor principal */}
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Sección izquierda */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
          <img
            src={Logo}
            alt="Logo FABLAB"
            className="w-48 filter drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] transition duration-500"
          />
          <p className="text-gray-400 text-sm">
            © 2025 FABLAB FIULS. Todos los derechos reservados.
          </p>
        </div>

        {/* Sección derecha - Redes sociales */}
        <div className="flex space-x-8 text-2xl">
          <a
            href="https://www.facebook.com/FIULSFABLAB/"
            aria-label="Facebook"
            className="text-gray-300 hover:text-yellow-400 hover:scale-110 transition-transform duration-300"
          >
            <FaFacebook />
          </a>
          <a
            href="https://x.com/FabLabFIULS?s=20"
            aria-label="Twitter"
            className="text-gray-300 hover:text-yellow-400 hover:scale-110 transition-transform duration-300"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.tiktok.com/@fablabfiuls?is_from_webapp=1&sender_device=pc"
            aria-label="Tiktok"
            className="text-gray-300 hover:text-yellow-400 hover:scale-110 transition-transform duration-300"
          >
            <FaTiktok />
          </a>
          <a
            href="https://www.instagram.com/fablabfiuls?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            aria-label="Instagram"
            className="text-gray-300 hover:text-yellow-400 hover:scale-110 transition-transform duration-300"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
}
