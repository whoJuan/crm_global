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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-none animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-surface border border-ink-200 shadow-elevated z-10 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200`}
      >
        {/* Header Editorial */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-ink-100 bg-surface">
          <div>
            <span className="editorial-tag text-brass-600">Robledo Atelier Studio</span>
            <h2 className="font-serif text-2xl font-normal text-ink-950 mt-1">{title}</h2>
            {subtitle && <p className="text-xs text-ink-500 font-light mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-950 hover:bg-canvas-alt transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll discreto */}
        <div className="p-6 overflow-y-auto scrollbar-editorial">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
