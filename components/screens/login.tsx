"use client"

import { useState } from "react"
import { LogIn, Eye, EyeOff, AlertCircle, Shield, Wrench, UserCheck } from "lucide-react"
import { loginAction } from "@/app/actions/auth"
import { useRouter } from "next/navigation"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Ingrese correo y contraseña")
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    const result = await loginAction(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      // Login exitoso, forzar recarga para que page.tsx lea la sesión
      window.location.href = "/"
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1117] p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-[900px] z-10 flex flex-col md:flex-row rounded-3xl border border-slate-800 bg-[#1A1D27]/80 shadow-2xl backdrop-blur-xl overflow-hidden">
        
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <div className="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 mb-6">
              <span className="text-2xl font-bold text-white tracking-tighter">AS</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Bienvenido a ASCONT</h1>
            <p className="mt-2 text-slate-400">Sistema de Gestión de Activos Fijos y TI</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#0F1117] px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="usuario@ascont.cl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#0F1117] px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right side - Info/Test accounts */}
        <div className="w-full md:w-1/2 bg-slate-900/50 p-8 md:p-12 border-l border-slate-800 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6">Cuentas de Acceso (Test)</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                setEmail("diego.leiva@ascont.cl")
                setPassword("ascont123")
              }}
              className="w-full group flex items-center gap-4 rounded-xl border border-slate-700/50 bg-[#1A1D27] p-4 text-left transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 group-hover:bg-emerald-500/10 transition-colors">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Administrador</p>
                <p className="text-xs text-slate-400">diego.leiva@ascont.cl</p>
              </div>
            </button>
            <div className="rounded-xl border border-dashed border-slate-700 p-4 text-center">
              <p className="text-sm text-slate-500">
                Solo el administrador existe actualmente en la base de datos PostgreSQL. <br/><br/>
                Para crear cuentas de Técnico o Custodio, debes iniciar sesión como Administrador y crearlas desde el panel de Gestión de Usuarios.
              </p>
            </div>
          </div>
          
          <div className="mt-auto pt-8">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 flex gap-3">
              <Shield className="h-5 w-5 text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-300 leading-relaxed">
                Este sistema utiliza autenticación segura con NextAuth y bcrypt. Todas las sesiones son validadas en el backend.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
