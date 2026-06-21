"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { LogIn, Eye, EyeOff, AlertCircle, Shield, Wrench, UserCheck } from "lucide-react"

const roleDescriptions = {
  ADMIN: { label: "Administrador", icon: Shield, color: "text-emerald-400", desc: "Acceso completo al sistema" },
  TECNICO_TI: { label: "Técnico TI", icon: Wrench, color: "text-amber-400", desc: "Configuración y soporte" },
  CUSTODIO: { label: "Custodio", icon: UserCheck, color: "text-blue-400", desc: "Firma de actas de custodia" },
}

export function Login() {
  const { login, addNotification, users } = useAppStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Ingrese su correo electrónico")
      return
    }
    if (!password.trim()) {
      setError("Ingrese su contraseña")
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    const success = login(email, password)
    if (success) {
      addNotification("Sesión iniciada correctamente", "success")
    } else {
      setError("Credenciales incorrectas. Verifique su correo y contraseña.")
    }
    setIsLoading(false)
  }

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail)
    setPassword("ascont123")
    setError("")
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const success = login(userEmail, "ascont123")
    if (success) {
      addNotification("Sesión iniciada correctamente", "success")
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1117] p-4">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <span className="text-xl font-bold text-white">AS</span>
          </div>
          <h1 className="text-2xl font-bold text-white">ASCONT</h1>
          <p className="mt-1 text-sm text-slate-400">Sistema de Gestión de Activos Fijos y TI</p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-slate-800 bg-[#1A1D27] p-6 shadow-xl">
          <h2 className="mb-1 text-lg font-semibold text-white">Iniciar Sesión</h2>
          <p className="mb-6 text-sm text-slate-400">Ingrese sus credenciales para acceder al sistema</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-300">
                Correo electrónico
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                placeholder="usuario@ascont.cl"
                className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-slate-300">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError("") }}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 pr-10 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {isLoading ? "Verificando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>

        {/* Quick access */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-[#1A1D27] p-6">
          <h3 className="mb-1 text-sm font-semibold text-white">Acceso Rápido</h3>
          <p className="mb-4 text-xs text-slate-500">Seleccione un perfil para ingresar directamente</p>
          <div className="space-y-2">
            {users.map((user) => {
              const roleInfo = roleDescriptions[user.role]
              const Icon = roleInfo.icon
              return (
                <button
                  key={user.id}
                  onClick={() => handleQuickLogin(user.email)}
                  disabled={isLoading}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-700/50 bg-[#0F1117] p-3 text-left transition-all hover:border-slate-600 hover:bg-slate-800/50 disabled:opacity-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                    <Icon className={`h-5 w-5 ${roleInfo.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">{roleInfo.label} · {roleInfo.desc}</p>
                  </div>
                  <span className={`rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-center text-xs text-slate-600">
            Contraseña para todos: <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-emerald-400">ascont123</code>
          </p>
        </div>
      </div>
    </div>
  )
}
