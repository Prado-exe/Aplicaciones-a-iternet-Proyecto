import React, { useEffect, useState } from "react";

export default function ListarUsuarios({ onSeleccionarUsuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/users/listar", {
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
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
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
      <table className="w-full text-left border border-yellow-500/20 rounded-xl overflow-hidden">
        <thead className="bg-yellow-600 text-black">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Email</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u._id} className="border-t border-yellow-500/20">
              <td className="p-2">{u.Nickname}</td>
              <td className="p-2">{u.CorreoUsuario}</td>
              <td className="p-2 capitalize">{getRolTexto(u.TipoUsuario)}</td>

              <td className="p-2 flex gap-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => onSeleccionarUsuario(u._id)}
                >
                  Ver / Editar
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => eliminarUsuario(u._id)}
                >
                  Eliminar
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
