📘 README — FabLab FrontEnd
# 🌐 FabLab ULS — FrontEnd

Sitio web del **FabLab de la Universidad de La Serena**, desarrollado con **React + Vite**, **Tailwind CSS** y **Framer Motion**.  
El proyecto incluye animaciones, carruseles dinámicos, secciones modulares y soporte para despliegue en **Vercel**.

---

## 🛠️ Tecnologías principales

- ⚛️ **React (Vite)**
- 🎨 **Tailwind CSS**
- 🎞️ **Framer Motion**
- 🧭 **React Router DOM**
- 🧱 **Bootstrap Icons**
- 🌍 **Vercel (para despliegue)**

---

## 🚀 Instalación del entorno

Sigue estos pasos para levantar el proyecto correctamente en cualquier máquina.

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/NombreDelGrupo/FabLabFrontEnd.git
cd FabLabFrontEnd


💡 Si el repositorio está dentro de una organización o grupo de trabajo (por ejemplo, "fablabuls"), usa esa URL específica.

2️⃣ Instalar dependencias

Ejecuta el siguiente comando en la raíz del proyecto:

npm install


Esto instalará:

React y Vite

TailwindCSS y PostCSS

Framer Motion

React Router DOM

Bootstrap Icons

3️⃣ Configurar Tailwind CSS

Verifica que el archivo tailwind.config.js tenga esta estructura:

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


Y que en src/index.css estén los @tailwind base:

@tailwind base;
@tailwind components;
@tailwind utilities;

4️⃣ Extensiones recomendadas en VS Code

Para trabajar de forma fluida con el proyecto:

Extensión	Descripción
Tailwind CSS IntelliSense	Autocompletado y sugerencias para clases de Tailwind.
ES7+ React/Redux/React-Native snippets	Atajos para escribir componentes y hooks.
Prettier	Formato automático del código.
Auto Rename Tag	Sincroniza el nombre de etiquetas HTML/JSX.
vscode-icons	Mejora visual de estructura de archivos.
5️⃣ Iniciar el servidor local

Ejecuta:

npm run dev


Esto levantará el entorno en:

http://localhost:5173/

🧩 Estructura de carpetas
📦 src
 ┣ 📂 componentes
 ┃ ┣ CarruselMain.jsx
 ┃ ┣ EventosSection.jsx
 ┃ ┣ ProyectosSection.jsx
 ┃ ┣ TalleresSection.jsx
 ┃ ┣ AreasSection.jsx
 ┃ ┣ Noticiero.jsx
 ┃ ┣ UniqueDivider.jsx
 ┃ ┣ Navbar.jsx
 ┃ ┣ footbar.jsx
 ┃ ┗ BtnVolverInicio.jsx
 ┣ 📂 assets
 ┃ ┣ event_gamejam.png
 ┃ ┣ event_laser.png
 ┃ ┣ event_arduino.png
 ┃ ┗ otros...
 ┣ 📂 styles
 ┃ ┣ App.css
 ┃ ┣ CarruselMain.css
 ┃ ┗ Noticiero.css
 ┣ App.jsx
 ┣ main.jsx
 ┗ index.css

✨ Animaciones y efectos

El proyecto utiliza Framer Motion para las animaciones de entrada de los elementos.
Ejemplo en EventosSection.jsx:

npm install framer-motion


Y el uso típico:

import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  {/* contenido animado */}
</motion.div>

🧭 Navegación

Para manejar las rutas internas del sitio (por ejemplo, “/pag-noticiero”):

npm install react-router-dom


Y en tu main.jsx asegúrate de tener:

import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

🧰 Comandos útiles
Acción	Comando
Instalar dependencias	npm install
Levantar el servidor local	npm run dev
Construir versión final	npm run build
Vista previa de producción	npm run preview
🌐 Despliegue en Vercel

Crea una cuenta en vercel.com

Conecta tu repositorio de GitHub.

Vercel detectará automáticamente el proyecto Vite + React.

No es necesario editar configuraciones:

Framework preset: Vite

Output directory: dist

👥 Equipo de desarrollo
