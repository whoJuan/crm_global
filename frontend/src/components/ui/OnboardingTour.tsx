import React, { useState, useEffect } from "react";
import {
  Compass,
  Newspaper,
  ReceiptText,
  Boxes,
  Contact2,
  Coins,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
} from "lucide-react";
import Button from "./Button";

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    tag: "Bienvenido a Global CRM",
    title: "Un CRM Neumórfico de Nueva Generación",
    description:
      "Diseñado para empresas de comercio, agencias, consultoría y servicios. Este sistema te permite gestionar ventas, productos, clientes y finanzas con una interfaz táctil, suave y moderna.",
    icon: Compass,
    highlight: "Vista Panorámica",
    tip: "Esta guía rápida te enseñará en 1 minuto cómo operar cada módulo.",
  },
  {
    step: 2,
    tag: "Paso 01 · Portada",
    title: "The Daily Digest (Dashboard)",
    description:
      "Tu centro de comando. Visualiza ingresos del día, acumulado del mes, pedidos en curso, balance de clientes y las últimas transacciones registradas.",
    icon: Newspaper,
    highlight: "Métricas Clave",
    tip: "Revisa esta sección cada mañana para conocer el estado general de tu operación.",
  },
  {
    step: 3,
    tag: "Paso 02 · Ventas",
    title: "Ventas, Órdenes & Cotizaciones",
    description:
      "Crea nuevas órdenes o cotizaciones. Registra abonos y anticipos parciales (ej. 50% inicial y 50% al entregar), genera facturas proforma imprimibles y actualiza el estado de pedidos.",
    icon: ReceiptText,
    highlight: "Control de Pagos 50/50",
    tip: "Haz clic en 'Ficha' en cualquier pedido para ver e imprimir su proforma.",
  },
  {
    step: 4,
    tag: "Paso 03 · Catálogo",
    title: "Catálogo de Productos & Servicios",
    description:
      "Registra artículos físicos o servicios. Sube imágenes desde tu dispositivo y alterna entre la vista Lookbook y la Tabla Técnica de inventario.",
    icon: Boxes,
    highlight: "Carga Local de Archivos",
    tip: "Puedes arrastrar y soltar fotos directamente desde tu computadora en el modal.",
  },
  {
    step: 5,
    tag: "Paso 04 · Clientes",
    title: "Directorio de Clientes & Contacto",
    description:
      "Expedientes de clientes con accesos directos de llamada telefónica, correo y WhatsApp con un solo clic.",
    icon: Contact2,
    highlight: "Acciones Rápidas",
    tip: "Usa el botón de WhatsApp para iniciar conversaciones comerciales al instante.",
  },
  {
    step: 6,
    tag: "Paso 05 · Finanzas",
    title: "Revista Financiera & Reportes",
    description:
      "Gráficas interactivas de facturación, desglose de ventas por período y ranking de productos más rentables.",
    icon: Coins,
    highlight: "Rentabilidad Clara",
    tip: "Filtra por períodos para evaluar el crecimiento comercial de tu equipo.",
  },
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const current = TOUR_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const Icon = current.icon;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem("hasCompletedTour", "true");
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    localStorage.setItem("hasCompletedTour", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neu-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={handleSkip} />

      <div className="relative w-full max-w-xl bg-neu-surface rounded-3xl shadow-neu-raised-lg border border-white/60 z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Cabecera con Pasos */}
        <div className="p-6 pb-4 border-b border-neu-surfaceDark/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neu-surface shadow-neu-inset flex items-center justify-center text-neu-accent">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-neu-accent bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-inset-sm border border-white/20">
                {current.tag}
              </span>
              <p className="text-xs text-neu-text-sub mt-0.5">
                Guía Paso a Paso ({currentStep + 1} de {TOUR_STEPS.length})
              </p>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="w-8 h-8 rounded-full bg-neu-surface shadow-neu-raised-xs flex items-center justify-center text-neu-text-sub hover:text-neu-danger hover:shadow-neu-inset transition-all"
            title="Cerrar Guía"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo del Paso */}
        <div className="p-6 space-y-5">
          <div>
            <h3 className="font-display text-xl font-bold text-neu-text-dark">{current.title}</h3>
            <p className="text-xs text-neu-text-sub mt-2 leading-relaxed">{current.description}</p>
          </div>

          {/* Tarjeta Hundida para Tip / Destacado */}
          <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-neu-text-dark">
              <CheckCircle2 className="w-4 h-4 text-neu-success" />
              <span>{current.highlight}</span>
            </div>
            <p className="text-[11px] text-neu-text-sub pl-6">{current.tip}</p>
          </div>

          {/* Barra de Progreso Neumórfica */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[10px] text-neu-text-muted font-mono">
              <span>Progreso de Inducción</span>
              <span>{Math.round(((currentStep + 1) / TOUR_STEPS.length) * 100)}%</span>
            </div>
            <div className="w-full h-2.5 bg-neu-surface shadow-neu-inset rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-neu-accent rounded-full shadow-neu-glow-accent transition-all duration-300"
                style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer con Botones */}
        <div className="p-6 pt-4 border-t border-neu-surfaceDark/50 flex items-center justify-between bg-neu-surface">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-neu-text-muted hover:text-neu-text-sub"
          >
            Omitir Guía
          </Button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button variant="secondary" size="sm" onClick={handlePrev}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Anterior
              </Button>
            )}
            <Button variant="accent" size="sm" onClick={handleNext}>
              {isLast ? (
                <>
                  Comenzar a Usar <CheckCircle2 className="w-3.5 h-3.5 ml-1.5" />
                </>
              ) : (
                <>
                  Siguiente <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
