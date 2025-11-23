import React, { useEffect, useState } from "react";

export default function ListarUsuarios() {
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

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Usuarios registrados</h3>
      <table className="w-full text-left border border-yellow-500/20 rounded-xl overflow-hidden">
        <thead className="bg-yellow-600 text-black">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Email</th>
            <th className="p-2">Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u._id} className="border-t border-yellow-500/20">
              <td className="p-2">{u._id}</td>
              <td className="p-2">{u.nombre}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 capitalize">{u.TipoUsuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
