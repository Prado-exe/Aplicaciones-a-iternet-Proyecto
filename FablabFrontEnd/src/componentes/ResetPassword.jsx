import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../api/userService";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Leer token desde la URL (?token=...)
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Si no hay token en la URL, mostramos un error simple
  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0f",
          color: "#f9fafb",
          padding: "1rem",
        }}
      >
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            background: "#15151b",
            padding: "1.5rem",
            borderRadius: "1rem",
            border: "1px solid #f87171",
          }}
        >
          <h1 style={{ fontSize: "1.3rem", color: "#f87171", marginBottom: "0.75rem" }}>
            Enlace no válido
          </h1>
          <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
            El enlace para restablecer la contraseña no es válido o está incompleto.
            Vuelve a solicitar la recuperación desde la opción
            &nbsp;<strong>“¿Olvidaste tu contraseña?”</strong>.
          </p>
          <button
            onClick={() => navigate("/auth")}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#facc15",
              color: "#111827",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!newPassword || !repeatPassword) {
      setErrorMessage("Debes completar ambos campos de contraseña");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword !== repeatPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPasswordApi(token, newPassword);
      setInfoMessage(
        res.message || "Contraseña actualizada correctamente. Ahora puedes iniciar sesión."
      );

      // Opcional: redirigir al login después de unos segundos
      setTimeout(() => {
        navigate("/auth"); // ajusta si tu ruta de login es otra
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || "Ocurrió un error al actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0b0f",
        color: "#f9fafb",
        padding: "1rem",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "#15151b",
          padding: "1.5rem",
          borderRadius: "1rem",
          border: "1px solid rgba(250, 204, 21, 0.4)",
        }}
      >
        <h1
          style={{
            fontSize: "1.4rem",
            color: "#facc15",
            marginBottom: "0.75rem",
            fontWeight: "700",
          }}
        >
          Restablecer contraseña
        </h1>
        <p style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#e5e7eb" }}>
          Ingresa tu nueva contraseña. Este enlace es válido por un tiempo limitado.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", marginBottom: "0.25rem", display: "block" }}>
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingresa la nueva contraseña"
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #facc15",
                backgroundColor: "#1f2937",
                color: "#f9fafb",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", marginBottom: "0.25rem", display: "block" }}>
              Repetir contraseña
            </label>
            <input
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #facc15",
                backgroundColor: "#1f2937",
                color: "#f9fafb",
                fontSize: "0.9rem",
              }}
            />
          </div>

          {errorMessage && (
            <p style={{ fontSize: "0.8rem", color: "#f87171" }}>{errorMessage}</p>
          )}

          {infoMessage && (
            <p style={{ fontSize: "0.8rem", color: "#4ade80" }}>{infoMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.5rem",
              width: "100%",
              padding: "0.6rem 0.75rem",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#facc15",
              color: "#111827",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Guardando..." : "Actualizar contraseña"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              marginTop: "0.5rem",
              background: "none",
              border: "none",
              color: "#9ca3af",
              fontSize: "0.85rem",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            ← Volver al inicio
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
