import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import Logo from '../assets/logo.png';

const Footer = () => (
  <footer className="bg-gray-800 text-white py-8">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0">
        <div>
          <img src={Logo} alt="Logo FABLAB" />  
        </div>
        <p className="text-sm text-gray-400">© 2025 Todos los derechos reservados</p>
      </div>
      <div className="flex space-x-6">
        <a href="#" aria-label="Facebook"><FaFacebook size={24} /></a>
        <a href="#" aria-label="Twitter"><FaTwitter size={24} /></a>
        <a href="#" aria-label="Instagram"><FaInstagram size={24} /></a>
      </div>
    </div>
  </footer>
);
export default Footer;
