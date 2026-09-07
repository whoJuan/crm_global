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
    title: "Un CRM Editorial para todo tipo de Negocio",
    description:
      "Diseñado para empresas de servicios, comercio, agencias, consultoría y marcas boutique. Este sistema te permite gestionar ventas, productos, clientes y finanzas con una estética clara, profesional y sin sobrecargas visuales.",
    icon: Compass,
    highlight: "Vista Panorámica",
    tip: "Esta guía rápida te enseñará en 1 minuto cómo operar cada módulo.",
  },
  {
    step: 2,
    tag: "Paso 01 · Portada",
    title: "The Daily Digest (Dashboard)",
    description:
      "Tu centro de comando matutino. Aquí visualizas los ingresos del día, acumulado del mes, pedidos en curso, balance de clientes y las últimas transacciones registradas.",
    icon: Newspaper,
    highlight: "Métricas Clave",
    tip: "Revisa esta sección cada mañana para conocer el estado general de tu operación.",
  },
  {
    step: 3,
    tag: "Paso 02 · Ventas",
    title: "Ventas, Órdenes & Cotizaciones",
    description:
      "Crea nuevas órdenes de compra o cotizaciones formales. Puedes registrar abonos y anticipos parciales (ej. 50% inicial y 50% al entregar), generar facturas proforma imprimibles y cambiar el estado del pedido.",
    icon: ReceiptText,
    highlight: "Control de Pagos 50/50",
    tip: "Haz clic en 'Ficha' en cualquier pedido para ver e imprimir su proforma con membrete.",
  },
  {
    step: 4,
    tag: "Paso 03 · Catálogo",
    title: "Catálogo de Productos & Servicios",
    description:
      "Registra tus artículos físicos, servicios profesionales o proyectos. Sube imágenes directamente desde tu dispositivo y alterna entre la vista Lookbook y la Tabla Técnica de inventario.",
    icon: Boxes,
    highlight: "Carga Local de Archivos",
    tip: "Puedes arrastrar y soltar fotos directamente desde tu computadora en el modal.",
  },
  {
    step: 5,
    tag: "Paso 04 · Directorio",
    title: "Dossier de Clientes & Empresas",
    description:
      "Directorio integral de compradores particulares, empresas B2B y cuentas corporativas. Incluye historial de compras, notas y botón de contacto directo vía WhatsApp.",
    icon: Contact2,
    highlight: "Atención Consultiva",
    tip: "Guarda notas de preferencias para personalizar la atención con cada cliente recurrente.",
  },
  {
    step: 6,
    tag: "Paso 05 · Finanzas",
    title: "Revista Financiera & Métricas",
    description:
      "Gráficos de facturación mensual, análisis de ticket promedio, rentabilidad y ranking de los productos o servicios más demandados de tu negocio.",
    icon: Coins,
    highlight: "Crecimiento & Analytics",
    tip: "Utiliza estos reportes para planificar metas comerciales y compras de temporada.",
  },
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const Icon = currentStep.icon;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem("hasCompletedTour", "true");
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasCompletedTour", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-none animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={handleSkip} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-surface border border-ink-200 shadow-elevated z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Barra Superior de Progreso */}
        <div className="bg-canvas-alt px-6 py-4 border-b border-ink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-brass-600 animate-spin-slow" />
            <span className="editorial-tag text-brass-600 font-bold">Guía Interactiva Paso a Paso</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-ink-400">
              Paso {currentStepIndex + 1} de {TOUR_STEPS.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-ink-400 hover:text-ink-950 p-1 transition-colors"
              title="Cerrar Guía"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Indicadores de Paso */}
        <div className="grid grid-cols-6 gap-1 px-6 pt-3 bg-canvas-alt/40">
          {TOUR_STEPS.map((s, idx) => (
            <div
              key={s.step}
              className={`h-1 transition-all duration-300 ${
                idx === currentStepIndex
                  ? "bg-brass-600"
                  : idx < currentStepIndex
                  ? "bg-ink-900"
                  : "bg-ink-200"
              }`}
            />
          ))}
        </div>

        {/* Cuerpo del Paso Actual */}
        <div className="p-8 sm:p-10 space-y-6">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-ink-950 text-canvas font-serif flex items-center justify-center flex-shrink-0 shadow-sm">
              <Icon className="w-7 h-7 text-brass-300" />
            </div>

            <div className="space-y-1 flex-1">
              <span className="editorial-tag text-brass-600">{currentStep.tag}</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-ink-950">
                {currentStep.title}
              </h2>
              <span className="inline-block font-mono text-[10px] text-sage-700 bg-sage-50 border border-sage-200 px-2 py-0.5 mt-1">
                Destacado: {currentStep.highlight}
              </span>
            </div>
          </div>

          <p className="text-sm text-ink-700 font-light leading-relaxed">
            {currentStep.description}
          </p>

          <div className="p-4 bg-canvas-alt border-l-2 border-brass-500 text-xs text-ink-600 space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-ink-900 block font-mono">
              Consejo de Uso Rápido:
            </span>
            <p className="italic font-light">{currentStep.tip}</p>
          </div>
        </div>

        {/* Pie de Acciones */}
        <div className="p-6 bg-canvas-alt/80 border-t border-ink-100 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-xs uppercase font-semibold text-ink-400 hover:text-ink-900 tracking-wider"
          >
            Omitir Guía
          </button>

          <div className="flex items-center gap-3">
            {!isFirst && (
              <Button variant="secondary" size="md" onClick={handlePrev}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Anterior
              </Button>
            )}

            <Button variant="primary" size="md" onClick={handleNext}>
              {isLast ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Empezar a Usar el CRM
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
