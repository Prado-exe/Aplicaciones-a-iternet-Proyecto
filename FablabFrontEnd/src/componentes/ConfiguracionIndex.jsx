import React from "react";
import AdminCarrusel from "./AdminCarrusel.jsx";
import AdminTalleres from "./AdminTalleres.jsx";
import AdminEventos from "./AdminEventos.jsx";
import UniqueDivider from "./UniqueDivider";

export default function ConfiguracionIndex() {
  return (
    <div className="space-y-10">
          <AdminCarrusel />
          <UniqueDivider />
          <AdminTalleres />
          <UniqueDivider />     
          <AdminEventos />
    </div>
  );
}
