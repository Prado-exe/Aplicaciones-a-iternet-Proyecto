import React from "react";

export default function PagAdmin() {
  // Más adelante lo conectamos con el rol admin
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-yellow-200 pt-28 pb-12 flex justify-center">
      <div className="w-full max-w-4xl bg-[#1b1b1f] rounded-3xl p-8 shadow-lg border border-yellow-500/40">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Panel de Administración
        </h1>

        <p className="mb-4 opacity-80 text-center">
          Esta sección será usada por administradores del FabLab para
          gestionar usuarios, proyectos y reservas. De momento es solo
          una estructura base.
        </p>
      </div>
    </div>
  );
}
