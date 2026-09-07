import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import Button from "../components/ui/Button";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <span className="editorial-tag text-brass-600">Error 404 · Archivo No Encontrado</span>
        <h1 className="font-serif text-5xl font-normal text-ink-950">Página Fuera de Catálogo</h1>
        <p className="text-xs text-ink-600 font-light leading-relaxed">
          La pieza o sección solicitada no se encuentra disponible en la edición actual de Robledo Atelier CRM.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" size="md">
            <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Volver a Portada
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
