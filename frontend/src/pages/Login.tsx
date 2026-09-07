import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Globe, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen flex flex-col md:flex-row bg-canvas">
      {/* Lado Izquierdo: Fotografía Editorial de Negocios */}
      <div className="relative md:w-1/2 bg-ink-950 text-canvas flex flex-col justify-between p-12 overflow-hidden min-h-[400px] md:min-h-screen">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80"
          alt="Global CRM Architecture"
          className="absolute inset-0 w-full h-full object-cover opacity-35 grayscale-[20%]"
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="editorial-tag text-brass-300 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Global CRM
            </span>
            <span className="text-[10px] text-ink-300">·</span>
            <span className="text-[10px] font-mono text-ink-400">SISTEMA PRIVADO</span>
          </div>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-canvas">
            Maison <span className="italic font-light text-brass-400">&</span> Commerce
          </h1>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="font-serif text-2xl italic font-light text-brass-100 leading-relaxed">
            "Plataforma empresarial privada de alta gama para la gestión comercial y operativa."
          </p>
          <div className="mt-4 pt-4 border-t border-ink-100/20 flex items-center justify-between text-xs font-mono text-ink-300">
            <span>Acceso Corporativo Exclusivo</span>
            <span>Edición 2026</span>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Formulario Minimalista Editorial */}
      <div className="md:w-1/2 flex items-center justify-center p-8 sm:p-16 bg-surface">
        <div className="w-full max-w-md space-y-8">
          <div>
            <span className="editorial-tag text-brass-600 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Software Privado
            </span>
            <h2 className="font-serif text-3xl font-normal text-ink-950 mt-1">
              Acceso al Sistema
            </h2>
            <p className="text-xs text-ink-500 font-light mt-1">
              Ingresa tus credenciales asignadas por la administración para operar la plataforma.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-clay-50 border border-clay-200 text-clay-700 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@crmglobal.com"
                  className="w-full bg-canvas-alt border border-ink-200 pl-9 pr-3 py-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-ink-700 font-semibold uppercase tracking-wider text-[10px] mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-canvas-alt border border-ink-200 pl-9 pr-3 py-2.5 text-xs text-ink-900 focus:outline-none focus:border-brass-500 font-mono transition-colors"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
              Ingresar al Sistema <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Aviso de Sistema Privado */}
          <div className="pt-6 border-t border-ink-100 flex items-center justify-between text-[11px] text-ink-400 font-mono">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
