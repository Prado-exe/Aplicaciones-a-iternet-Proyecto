import React, { useEffect, useState } from "react";

export default function UsuarioDetalle({ userId, onVolver }) {

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 🔥 FORMULARIO SIEMPRE ARRIBA — NUNCA DEPENDIENDO DE UNA CONDICIÓN
  const [form, setForm] = useState({
    Nickname: "",
    CorreoUsuario: "",
    TipoUsuario: 2
  });

  // ➤ 1) Traer datos del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/users/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();
        console.log("Respuesta backend:", data);

        let userData = null;

        if (res.ok) {
          if (data.usuario) userData = data.usuario;
          else if (data._id) userData = data;
          else if (data.data) userData = data.data;
          else throw new Error("Formato inesperado");
        } else {
          throw new Error(data.msg || "Error al obtener usuario");
        }

        setUsuario(userData);

        // 🔥 Inicializamos el formulario AHORA que tenemos datos
        setForm({
          Nickname: userData.Nickname,
          CorreoUsuario: userData.CorreoUsuario,
          TipoUsuario: userData.TipoUsuario
        });

      } catch (err) {
        console.error("Error:", err);
      } finally {
        setCargando(false);
      }
    };

    if (userId) fetchUsuario();
  }, [userId]);

  // ⏳ Loading seguro
  if (cargando) return <p>Cargando información...</p>;
  if (!usuario) return <p className="text-red-400">No se encontraron datos del usuario</p>;

  // ➤ 2) Handler del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➤ 3) Actualizar usuario
  const actualizarUsuario = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Usuario actualizado correctamente");
        onVolver();
      } else {
        alert(data.msg || "Error al actualizar usuario");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ➤ 4) Eliminar usuario
  const eliminarUsuario = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Usuario eliminado");
        onVolver();
      } else {
        alert("Error al eliminar usuario");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ➤ 5) Render final
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Editar Usuario</h3>

      <label className="block">
        <span>Nickname:</span>
        <input
          type="text"
          name="Nickname"
          value={form.Nickname}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#0d0d11] border border-yellow-500/20"
        />
      </label>

      <label className="block">
        <span>Email:</span>
        <input
          type="email"
          name="CorreoUsuario"
          value={form.CorreoUsuario}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#0d0d11] border border-yellow-500/20"
        />
      </label>

      <label className="block">
        <span>Rol:</span>
        <select
          name="TipoUsuario"
          value={form.TipoUsuario}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#0d0d11] border border-yellow-500/20"
        >
          <option value={1}>Administrador</option>
          <option value={2}>Usuario</option>
        </select>
      </label>

      <div className="flex gap-3 mt-4">
        <button
          className="bg-yellow-600 text-black px-4 py-2 rounded"
          onClick={actualizarUsuario}
        >
          Guardar Cambios
        </button>

        <button
          className="bg-red-600 px-4 py-2 rounded"
          onClick={eliminarUsuario}
        >
          Eliminar Usuario
        </button>

        <button
          className="bg-gray-600 px-4 py-2 rounded"
          onClick={onVolver}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
