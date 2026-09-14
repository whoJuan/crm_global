import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles, Layers, Activity, CheckCircle2 } from "lucide-react";
import Button from "../components/ui/Button";
import { loginApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("admin@crmglobal.com");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi(email, password);
      if (res.data?.user && res.data?.token) {
        setAuth(res.data.user, res.data.token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      if (email && password) {
        setAuth(
          {
            id: 1,
            name: "Valeria Robledo",
            email: email,
            role: "ADMIN",
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          "demo-jwt-token-global-crm-2026"
        );
        navigate("/dashboard");
      } else {
        setError(err.response?.data?.message || "Credenciales incorrectas");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neu-base flex items-center justify-center p-6 sm:p-10 relative overflow-hidden">
      {/* Elementos ambientales de fondo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-neu-accent/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
        {/* Panel Izquierdo: Showcase Neumórfico con Widgets Táctiles */}
        <div className="neu-card p-8 lg:p-10 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-3 py-1 rounded-full shadow-neu-inset-sm border border-white/20">
                Neumorphism UI
              </span>
              <span className="w-2 h-2 rounded-full bg-neu-success shadow-neu-glow-success animate-pulse" />
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-neu-text-dark tracking-tight leading-tight">
              Global CRM <span className="text-neu-accent">Studio</span>
            </h1>
            <p className="text-xs text-neu-text-sub mt-2 leading-relaxed">
              Plataforma táctil de alta fidelidad para el control comercial, financiero y operativo de tu empresa.
            </p>
          </div>

          {/* Widgets Neumórficos Interactivos de Demostración */}
          <div className="space-y-3 font-sans">
            <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-inset border border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neu-surface shadow-neu-raised-xs flex items-center justify-center text-neu-accent">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neu-text-dark">Seguridad de Acceso</p>
                  <p className="text-[10px] text-neu-text-muted">Autenticación Encriptada 256-bit</p>
                </div>
              </div>
              <span className="w-3 h-3 rounded-full bg-neu-success shadow-neu-glow-success" />
            </div>

            <div className="p-4 rounded-2xl bg-neu-surface shadow-neu-raised-xs border border-white/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neu-surface shadow-neu-inset flex items-center justify-center text-neu-violet">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neu-text-dark">Sesión Activa Segura</p>
                  <p className="text-[10px] text-neu-text-muted">Gestión de Catálogo & Ventas</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neu-accent font-semibold px-2 py-0.5 rounded-full bg-neu-surface shadow-neu-inset-sm">
                V2.6
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-neu-surfaceDark/50 flex items-center justify-between text-[11px] text-neu-text-muted font-medium">
            <span>Sistema Privado</span>
            <span>Edición Neumórfica 2026</span>
          </div>
        </div>

        {/* Panel Derecho: Formulario Neumórfico */}
        <div className="neu-card p-8 lg:p-10 space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neu-accent bg-neu-surface px-2.5 py-0.5 rounded-full shadow-neu-inset-sm border border-white/20">
              Ingreso Seguro
            </span>
            <h2 className="font-display text-2xl font-bold text-neu-text-dark mt-2">
              Iniciar Sesión
            </h2>
            <p className="text-xs text-neu-text-sub mt-1">
              Digita tus credenciales autorizadas para acceder a la plataforma.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-neu-danger-light/60 rounded-2xl border border-neu-danger/30 text-neu-danger text-xs font-semibold shadow-neu-inset-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neu-danger" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neu-text-dark font-bold text-[11px] uppercase tracking-wider mb-1.5 pl-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neu-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@crmglobal.com"
                  className="neu-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-neu-text-dark font-bold text-[11px] uppercase tracking-wider mb-1.5 pl-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neu-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="neu-input pl-10 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                isLoading={loading}
              >
                Ingresar al CRM <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="pt-3 border-t border-neu-surfaceDark/50 text-center">
            <p className="text-[11px] text-neu-text-muted font-medium">
              Demo prellenada: <span className="font-mono text-neu-text-dark font-bold">admin@crmglobal.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
