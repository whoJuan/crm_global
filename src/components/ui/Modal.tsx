import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "lg",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neu-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-neu-surface rounded-3xl shadow-neu-raised-lg border border-white/60 z-10 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200`}
      >
        {/* Cabecera Neumórfica */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-neu-surfaceDark/50 bg-neu-surface">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-inset-sm border border-white/20">
              Módulo de Operaciones
            </span>
            <h2 className="font-display text-2xl font-bold text-neu-text-dark mt-2">{title}</h2>
            {subtitle && <p className="text-xs text-neu-text-sub mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neu-surface shadow-neu-raised-xs flex items-center justify-center text-neu-text-sub hover:text-neu-danger hover:shadow-neu-inset transition-all duration-200 border border-white/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido con scroll neumórfico */}
        <div className="p-6 overflow-y-auto scrollbar-neu flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
