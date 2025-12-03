import React, { useEffect, useState } from "react";

export default function ListarUsuarios({ onSeleccionarUsuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/users/listar", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();
        setUsuarios(data.usuarios || []);
      } catch (err) {
        console.error("Error obteniendo usuarios:", err);
      } finally {
        setCargando(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (cargando) return <p>Cargando usuarios...</p>;

  if (usuarios.length === 0)
    return <p>No hay usuarios registrados en el sistema.</p>;

  const getRolTexto = (tipo) => {
    if (tipo === 1) return "Administrador";
    if (tipo === 2) return "Usuario";
    return "Desconocido";
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setUsuarios(usuarios.filter(u => u._id !== id));
      } else {
        alert("Error al eliminar usuario");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Usuarios registrados</h3>
      
      {/* 1. Contenedor Responsivo para Tablas */}
      <div className="overflow-x-auto rounded-xl border border-yellow-500/20">
        <table className="w-full text-left">
          
          {/* 2. Cabecera */}
          <thead className="bg-yellow-600 text-black whitespace-nowrap">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          
          {/* 3. Cuerpo de la Tabla */}
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id} className="border-t border-yellow-500/20 hover:bg-yellow-900/10 transition duration-150">
                <td className="p-3 whitespace-nowrap">{u.Nickname}</td>
                <td className="p-3 whitespace-nowrap">{u.CorreoUsuario}</td>
                <td className="p-3 capitalize whitespace-nowrap">{getRolTexto(u.TipoUsuario)}</td>

                {/* 4. Acciones Responsivas */}
                <td className="p-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                      onClick={() => onSeleccionarUsuario(u._id)}
                    >
                      Ver / Editar
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                      onClick={() => eliminarUsuario(u._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}