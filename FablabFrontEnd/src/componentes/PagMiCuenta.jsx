import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UniqueDivider from "./UniqueDivider";

const PagMiCuenta = () => {
  const [user, setUser] = useState(null);

  // ¿Está el panel en modo edición?
  const [isEditing, setIsEditing] = useState(false);

  // ¿Estamos editando específicamente la contraseña?
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Campos editables
  const [formData, setFormData] = useState({
    nombre: "",
    nickname: "",
    correo: "",
    rolUsuario: "",
  });

  // Campos de contraseña
  const [passwordData, setPasswordData] = useState({
    current: "",
    next: "",
  });

  // Mostrar/ocultar texto de contraseña
  const [showPwd, setShowPwd] = useState({
    current: false,
    next: false,
  });

  // Cargar datos del usuario (de momento desde localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);

      setFormData({
        nombre: parsed.NombreUsuario || "",
        nickname: parsed.Nickname || "",
        correo: parsed.Correo || "",
        // compatible con nombres de campo que pueda usar el backend
        rolUsuario:
          parsed.RolUsuario ||
          parsed.RolUniversitario || // por si lo tenían así
          "",
      });
    }
  }, []);

  if (!user) {
    return (
      <div className="pt-24 min-h-screen bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] flex items-center justify-center text-gray-200">
        <p className="text-lg">
          No hay una sesión activa. Inicia sesión para ver tu cuenta.
        </p>
      </div>
    );
  }

  const displayName =
    formData.nickname ||
    formData.nombre ||
    "Usuario";

  const avatarUrl = user?.FotoPerfil || null;
  const initial = displayName.charAt(0).toUpperCase();
  const rolUsuario = formData.rolUsuario || "";

  const toggleEdit = () => {
    if (isEditing) setIsChangingPassword(false);
    setIsEditing((prev) => !prev);
  };

  const onChange = (field) => (e) => {
    setFormData((data) => ({
      ...data,
      [field]: e.target.value,
    }));
  };

  const onPasswordChange = (field) => (e) => {
    setPasswordData((pwd) => ({
      ...pwd,
      [field]: e.target.value,
    }));
  };

  const toggleShowPwd = (field) => () => {
    setShowPwd((s) => ({
      ...s,
      [field]: !s[field],
    }));
  };

  const handleConfirmPassword = () => {
    // TODO: aquí va la llamada real al backend para cambiar contraseña
    // ej: await api.changePassword({ current: passwordData.current, next: passwordData.next });
    setPasswordData({ current: "", next: "" });
    setIsChangingPassword(false);
  };

  // Botón Confirmar cambios: sólo prepara datos para backend
  const handleConfirmChanges = () => {
    const payload = {
      userId: user?.IdUsuario || user?.id || user?._id || null,
      nombre: formData.nombre,
      nickname: formData.nickname,
      correo: formData.correo,
      rolUsuario: rolUsuario,
    };

    console.log("Datos de perfil listos para enviar al backend:", payload);
    // TODO: aquí se hará la llamada real al backend cuando esté lista
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  const passwordVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-[#0b0b0f] via-[#101114] to-[#0b0b0f] text-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-10">

        {/* Título principal */}
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-3 drop-shadow-[0_0_12px_rgba(255,215,0,0.7)]">
            Panel de Usuario
          </h1>
          <p className="text-gray-300">
            Aquí podrás ver tus datos principales y un resumen de tu actividad dentro del FabLab.
          </p>
        </header>

        <UniqueDivider />

        {/* Bloque principal */}
        <section className="bg-[#15151b] rounded-3xl p-6 md:p-8 shadow-[0_0_25px_rgba(255,215,0,0.18)] flex flex-col md:flex-row gap-8 border border-yellow-500/30 transition-all duration-300">
          {/* Columna izquierda: datos + edición */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            <AnimatePresence mode="wait">
              {!isEditing ? (
                // 🔹 MODO LECTURA
                <motion.div
                  key="view"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-3"
                >
                  {/* Nickname grande */}
                  <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">
                    {displayName}
                  </h2>

                  {/* Rol de usuario */}
                  <p className="text-sm text-gray-300">
                    Rol de usuario:{" "}
                    <span className="text-yellow-300 font-semibold">
                      {rolUsuario || "—"}
                    </span>
                  </p>

                  {/* Datos clave para que el usuario sepa qué puede editar */}
                  <div className="mt-3 space-y-1 text-sm">
                    <p>
                      <span className="font-semibold text-gray-100">
                        Nombre completo:
                      </span>{" "}
                      {formData.nombre || "—"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-100">
                        Contraseña:
                      </span>{" "}
                      <span className="tracking-widest text-yellow-100">
                        ••••••••
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-100">
                        Correo:
                      </span>{" "}
                      {formData.correo || "—"}
                    </p>
                  </div>
                </motion.div>
              ) : (
                // 🔹 MODO EDICIÓN
                <motion.div
                  key="edit"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* Nombre y nickname */}
                  <div>
                    <label className="block text-sm mb-1">Nombre completo</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={onChange("nombre")}
                      className="w-full rounded-xl px-3 py-2 bg-[#1b1b21] border border-yellow-500/60 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <label className="block text-sm mt-3 mb-1">Nickname</label>
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={onChange("nickname")}
                      className="w-full rounded-xl px-3 py-2 bg-[#1b1b21] border border-yellow-500/60 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      (Regla sugerida: permitir cambiar el nickname sólo cada cierto tiempo).
                    </p>
                  </div>

                  {/* Contraseña con borde y botón interno */}
                  <div className="mt-2">
                    <label className="block text-sm mb-1">Contraseña</label>
                    <div className="flex items-center gap-2 rounded-xl bg-[#1b1b21] border border-yellow-500/60 px-3 py-2">
                      <span className="flex-1 text-yellow-100 text-sm tracking-widest">
                        ••••••••
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword((v) => !v)}
                        className="text-xs px-3 py-1 rounded-full border border-yellow-500 text-yellow-300 hover:bg-yellow-500 hover:text-black transition"
                      >
                        {isChangingPassword ? "Cancelar" : "Cambiar contraseña"}
                      </button>
                    </div>
                  </div>

                  {/* Panel de cambio de contraseña (desplegable con animación) */}
                  <AnimatePresence>
                    {isChangingPassword && (
                      <motion.div
                        key="pwd"
                        variants={passwordVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="grid md:grid-cols-2 gap-4 text-sm mt-2"
                      >
                        <div>
                          <label className="block mb-1">
                            Contraseña actual
                          </label>
                          <div className="relative">
                            <input
                              type={showPwd.current ? "text" : "password"}
                              value={passwordData.current}
                              onChange={onPasswordChange("current")}
                              className="w-full rounded-xl px-3 py-2 bg-[#1b1b21] border border-yellow-500/60 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                            <button
                              type="button"
                              onClick={toggleShowPwd("current")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300"
                            >
                              <i className={`bi ${showPwd.current ? "bi-eye-slash" : "bi-eye"}`} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1">
                            Nueva contraseña
                          </label>
                          <div className="relative">
                            <input
                              type={showPwd.next ? "text" : "password"}
                              value={passwordData.next}
                              onChange={onPasswordChange("next")}
                              className="w-full rounded-xl px-3 py-2 bg-[#1b1b21] border border-yellow-500/60 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                            <button
                              type="button"
                              onClick={toggleShowPwd("next")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300"
                            >
                              <i className={`bi ${showPwd.next ? "bi-eye-slash" : "bi-eye"}`} />
                            </button>
                          </div>
                        </div>
                        <div className="md:col-span-2 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={handleConfirmPassword}
                            className="mt-1 px-4 py-2 rounded-full bg-yellow-500 text-black text-xs font-semibold hover:bg-yellow-400 transition"
                          >
                            Confirmar contraseña
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Rol de usuario (read-only) */}
                  <div className="mt-2">
                    <label className="block text-sm mb-1">Rol de usuario</label>
                    <input
                      type="text"
                      value={rolUsuario}
                      readOnly
                      className="w-full rounded-xl px-3 py-2 bg-[#1b1b21]/60 border border-yellow-500/40 text-gray-300 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Valores esperados: <strong>Alumno</strong> o <strong>Externo</strong> (y el tercero que definan).
                    </p>
                  </div>

                  {/* Correo */}
                  <div className="grid md:grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Correo</label>
                      <input
                        type="email"
                        value={formData.correo}
                        onChange={onChange("correo")}
                        className="w-full rounded-xl px-3 py-2 bg-[#1b1b21] border border-yellow-500/60 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botones inferiores: Editar / Cerrar + Confirmar cambios */}
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={toggleEdit}
                className="px-5 py-2 rounded-full bg-yellow-500 text-black font-semibold text-sm hover:bg-yellow-400 transition shadow-[0_0_12px_rgba(255,215,0,0.6)]"
              >
                {isEditing ? "Cerrar edición" : "Editar datos"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={handleConfirmChanges}
                  className="px-5 py-2 rounded-full bg-yellow-500 text-black font-semibold text-sm hover:bg-yellow-400 transition shadow-[0_0_12px_rgba(255,215,0,0.6)]"
                >
                  Confirmar cambios
                </button>
              )}
            </div>
          </div>

          {/* Columna derecha: avatar + chips de actividad */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-yellow-400 shadow-[0_0_18px_rgba(255,215,0,0.8)] overflow-hidden border-4 border-yellow-200">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar usuario"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-black">
                    {initial}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-400">
              Imagen de usuario
            </span>

            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <div className="px-4 py-2 rounded-full bg-[#2c2410] border border-yellow-500/60 text-sm">
                <span className="block text-gray-300 text-xs">
                  Proyectos
                </span>
                <span className="block text-yellow-300 font-bold text-lg text-center">
                  {user.TotalProyectos ?? 0}
                </span>
              </div>
              <div className="px-4 py-2 rounded-full bg-[#2c2410] border border-yellow-500/60 text-sm">
                <span className="block text-gray-300 text-xs">
                  Reservas
                </span>
                <span className="block text-yellow-300 font-bold text-lg text-center">
                  {user.TotalReservas ?? 0}
                </span>
              </div>
              <div className="px-4 py-2 rounded-full bg-[#2c2410] border border-yellow-500/60 text-sm">
                <span className="block text-gray-300 text-xs">
                  Eventos
                </span>
                <span className="block text-yellow-300 font-bold text-lg text-center">
                  {user.TotalReservas ?? 0}
                </span>
              </div>
            </div>
          </div>
        </section>

        <UniqueDivider />

        {/* Bloque inferior: información de cuenta + actividad reciente */}
        <section className="bg-[#15151b] rounded-3xl p-6 md:p-8 shadow-[0_0_25px_rgba(255,215,0,0.18)] border border-yellow-500/25">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-3xl p-6 bg-[#18181f] border border-yellow-500/25">
              <h3 className="text-2xl font-semibold text-yellow-400 mb-3">
                Información de la cuenta
              </h3>
              <p className="text-sm text-gray-300 mb-1">
                Fecha de registro:{" "}
                <span className="font-semibold text-yellow-200">
                  {user.FechaRegistro || "—"}
                </span>
              </p>
              <p className="text-sm text-gray-300 mb-1">
                Última conexión:{" "}
                <span className="font-semibold text-yellow-200">
                  {user.UltimaConexion || "—"}
                </span>
              </p>
            </div>

            <div className="rounded-3xl p-6 bg-[#18181f] border border-yellow-500/25">
              <h3 className="text-2xl font-semibold text-yellow-400 mb-3">
                Actividad reciente
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                <li>
                  Último proyecto registrado:{" "}
                  <span className="italic">
                    {user.UltimoProyecto || "—"}
                  </span>
                </li>
                <li>
                  Reserva más reciente:{" "}
                  <span className="italic">
                    {user.ReservaMasReciente || "—"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PagMiCuenta;
