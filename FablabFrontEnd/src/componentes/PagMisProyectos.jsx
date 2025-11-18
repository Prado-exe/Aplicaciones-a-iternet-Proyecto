import React, { useEffect, useState } from "react";
import UniqueDivider from "./UniqueDivider";

const PagMisProyectos = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !file) return;

    const newProject = {
      id: Date.now(),
      nombre: title,
      archivoNombre: file.name,
      fecha: new Date().toLocaleDateString(),
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));

    setTitle("");
    setFile(null);
    e.target.reset();
  };

  if (!user) {
    return (
      <div className="pt-24 min-h-screen bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] flex items-center justify-center text-gray-200">
        <p className="text-lg">
          No hay una sesión activa. Inicia sesión para gestionar tus proyectos.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] text-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-10">
        {/* Título */}
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-3 drop-shadow-[0_0_12px_rgba(255,215,0,0.7)]">
            Mis Proyectos
          </h1>
          <p className="text-gray-300">
            Registra y administra proyectos asociados al FabLab. Más adelante,
            esta sección se conectará al backend para almacenamiento real.
          </p>
        </header>

        <UniqueDivider />

        {/* Formulario de registro */}
        <section className="bg-gray-800/40 rounded-3xl p-6 md:p-8 shadow-[0_0_25px_rgba(255,215,0,0.18)]">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Registrar nuevo proyecto
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">
                Nombre del proyecto
              </label>
              <input
                type="text"
                className="w-full rounded-xl px-3 py-2 bg-[#1b1b21] border border-yellow-500/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Prótesis 3D para mano"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Archivo asociado (Word, PDF, etc.)
              </label>
              <input
                type="file"
                className="w-full text-sm text-yellow-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400"
                accept=".doc,.docx,.pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-400 transition"
            >
              Guardar proyecto
            </button>
          </form>
        </section>

        <UniqueDivider />

        {/* Lista de proyectos */}
        <section className="bg-gray-800/40 rounded-3xl p-6 md:p-8 shadow-[0_0_25px_rgba(255,215,0,0.18)]">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Proyectos registrados
          </h2>

          {projects.length === 0 ? (
            <p className="text-sm text-gray-300">
              Aún no has registrado proyectos. Cuando agregues uno, aparecerá en esta lista con su nombre, archivo asociado y fecha de registro.
            </p>
          ) : (
            <ul className="space-y-3">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between bg-[#1e1e24] rounded-2xl px-4 py-3 border border-yellow-500/25"
                >
                  <div>
                    <p className="font-semibold text-gray-100">
                      {p.nombre}
                    </p>
                    <p className="text-xs text-gray-300">
                      Archivo:{" "}
                      <span className="text-yellow-200">
                        {p.archivoNombre}
                      </span>{" "}
                      · Registrado el {p.fecha}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-2 md:mt-0 text-sm bg-yellow-500 text-black px-4 py-1 rounded-full hover:bg-yellow-400"
                  >
                    Ver / Descargar (simulado)
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default PagMisProyectos;
