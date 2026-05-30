"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { ROLE_NAMES, type UserRole } from "@/lib/types"
import { User, LogIn, Building2, Shield } from "lucide-react"

export function LoginScreen() {
  const { users, login } = useAppStore()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const handleLogin = () => {
    if (selectedUserId) {
      login(selectedUserId)
    }
  }

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      ENCARGADO_ADQUISICIONES: "bg-emerald-100 text-emerald-700 border-emerald-200",
      LOGISTICA: "bg-blue-100 text-blue-700 border-blue-200",
      TECNICO_TI: "bg-amber-100 text-amber-700 border-amber-200",
      CUSTODIO: "bg-purple-100 text-purple-700 border-purple-200",
    }
    return colors[role]
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">ASCONT</h1>
          <p className="text-muted-foreground">Sistema de Gestion de Activos</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">Identificacion de Usuario</h2>
              <p className="text-sm text-muted-foreground">Selecciona tu perfil para ingresar</p>
            </div>
          </div>

          <div className="space-y-3">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                  selectedUserId === user.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getRoleColor(user.role)}`}>
                  <User className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getRoleColor(user.role)}`}>
                    {ROLE_NAMES[user.role]}
                  </span>
                </div>
                {selectedUserId === user.id && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedUserId}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogIn className="h-5 w-5" />
            Ingresar al Sistema
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          PMV - Prototipo Minimo Viable v2.0
        </p>
      </div>
    </div>
  )
}
