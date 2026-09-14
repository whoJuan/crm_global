import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, HelpCircle } from "lucide-react";
import Button from "../components/ui/Button";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-neu-base flex flex-col items-center justify-center p-6 text-center">
      <div className="neu-card p-10 max-w-md space-y-6">
        <div className="w-16 h-16 rounded-full bg-neu-surface shadow-neu-inset flex items-center justify-center text-neu-accent mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
            Error 404
          </span>
          <h1 className="font-display text-3xl font-extrabold text-neu-text-dark mt-2">
            Página No Encontrada
          </h1>
          <p className="text-xs text-neu-text-sub mt-1 leading-relaxed">
            La sección solicitada no se encuentra disponible o fue reubicada en el sistema.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/dashboard">
            <Button variant="accent" size="md">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
