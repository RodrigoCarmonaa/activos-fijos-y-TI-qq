"use client"

import { useAppStore, useHydration } from "@/lib/store"
import { ROLE_PERMISSIONS, ROLE_NAMES, type UserRole } from "@/lib/types"
import { LoginScreen } from "@/components/screens/login"
import { Adquisicion } from "@/components/screens/adquisicion"
import { Recepcion } from "@/components/screens/recepcion"
import { ConfiguracionTI } from "@/components/screens/configuracion-ti"
import { CustodiaFirmas } from "@/components/screens/custodia-firmas"
import { SoporteTecnico } from "@/components/screens/soporte-tecnico"
import { Dashboard } from "@/components/screens/dashboard"
import { Toaster } from "@/components/ui/sonner"
import { 
  ShoppingCart,
  Warehouse, 
  Settings, 
  FileSignature, 
  Wrench, 
  LayoutDashboard,
  LogOut,
  User,
  Building2,
  Menu,
  X,
  ShieldAlert
} from "lucide-react"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const screens = [
  { id: 0, name: "Adquisicion", shortName: "P1", icon: ShoppingCart, color: "emerald" },
  { id: 1, name: "Recepcion", shortName: "P1.5", icon: Warehouse, color: "blue" },
  { id: 2, name: "Configuracion TI", shortName: "P2", icon: Settings, color: "amber" },
  { id: 3, name: "Custodia", shortName: "P3", icon: FileSignature, color: "purple" },
  { id: 5, name: "Soporte", shortName: "P5", icon: Wrench, color: "rose" },
  { id: 6, name: "Dashboard", shortName: "INV", icon: LayoutDashboard, color: "slate" },
]

const colorClasses: Record<string, { active: string; inactive: string; icon: string }> = {
  emerald: {
    active: "bg-emerald-500 text-white",
    inactive: "text-emerald-700 hover:bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-700",
  },
  blue: {
    active: "bg-blue-500 text-white",
    inactive: "text-blue-700 hover:bg-blue-50",
    icon: "bg-blue-100 text-blue-700",
  },
  amber: {
    active: "bg-amber-500 text-white",
    inactive: "text-amber-700 hover:bg-amber-50",
    icon: "bg-amber-100 text-amber-700",
  },
  purple: {
    active: "bg-purple-500 text-white",
    inactive: "text-purple-700 hover:bg-purple-50",
    icon: "bg-purple-100 text-purple-700",
  },
  rose: {
    active: "bg-rose-500 text-white",
    inactive: "text-rose-700 hover:bg-rose-50",
    icon: "bg-rose-100 text-rose-700",
  },
  slate: {
    active: "bg-slate-700 text-white",
    inactive: "text-slate-700 hover:bg-slate-50",
    icon: "bg-slate-100 text-slate-700",
  },
}

export default function Home() {
  const { currentUser, currentScreen, setCurrentScreen, logout, resetStore } = useAppStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [, forceUpdate] = useState(0)
  const hydrated = useHydration()

  // Forzar re-render después del login
  const handleLoginComplete = () => {
    forceUpdate((n) => n + 1)
  }

  // Mostrar loading mientras se hidrata el store
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario logueado, mostrar pantalla de login
  if (!currentUser) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <LoginScreen onLogin={handleLoginComplete} />
      </>
    )
  }

  const userPermissions = ROLE_PERMISSIONS[currentUser.role]
  const accessibleScreens = screens.filter((s) => userPermissions.includes(s.id))
  const hasAccessToCurrentScreen = userPermissions.includes(currentScreen)

  // Componente de Acceso Denegado
  const AccessDenied = () => (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md rounded-xl border border-destructive/30 bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-destructive">Acceso Denegado</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu rol <span className="font-medium text-foreground">{ROLE_NAMES[currentUser.role]}</span> no tiene permisos para acceder a este modulo.
        </p>
        <div className="mt-6 space-y-2">
          <p className="text-xs text-muted-foreground">Modulos disponibles para tu rol:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {accessibleScreens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => setCurrentScreen(screen.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${colorClasses[screen.color].inactive} hover:opacity-80`}
              >
                {screen.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderScreen = () => {
    // Verificar si el usuario tiene permiso para la pantalla actual
    if (!hasAccessToCurrentScreen) {
      return <AccessDenied />
    }

    switch (currentScreen) {
      case 0:
        return <Adquisicion />
      case 1:
        return <Recepcion />
      case 2:
        return <ConfiguracionTI />
      case 3:
        return <CustodiaFirmas />
      case 5:
        return <SoporteTecnico />
      case 6:
        return <Dashboard />
      default:
        return <Dashboard />
    }
  }

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      ENCARGADO_ADQUISICIONES: "bg-emerald-100 text-emerald-700",
      LOGISTICA: "bg-blue-100 text-blue-700",
      TECNICO_TI: "bg-amber-100 text-amber-700",
      CUSTODIO: "bg-purple-100 text-purple-700",
    }
    return colors[role]
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Toaster position="top-right" richColors />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-200 lg:relative lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground">ASCONT</p>
                <p className="text-xs text-muted-foreground">Gestion de Activos</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getRoleColor(currentUser.role)}`}>
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-foreground">{currentUser.name}</p>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getRoleColor(currentUser.role)}`}>
                  {ROLE_NAMES[currentUser.role]}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Modulos</p>
            {accessibleScreens.map((screen) => {
              const Icon = screen.icon
              const isActive = currentScreen === screen.id
              const colors = colorClasses[screen.color]
              
              return (
                <button
                  key={screen.id}
                  onClick={() => {
                    setCurrentScreen(screen.id)
                    setSidebarOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive ? colors.active : colors.inactive
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? "bg-white/20" : colors.icon}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-left">{screen.name}</span>
                  <span className={`rounded px-1.5 py-0.5 text-xs ${isActive ? "bg-white/20" : "bg-black/5"}`}>
                    {screen.shortName}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Footer Actions */}
          <div className="border-t border-border p-4 space-y-2">
            <button
              onClick={() => {
                if (confirm("Esto eliminara todos los datos. Continuar?")) {
                  resetStore()
                }
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Reiniciar Datos
            </button>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-foreground hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">ASCONT</span>
          </div>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getRoleColor(currentUser.role)}`}>
            <User className="h-4 w-4" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="min-h-screen">
          {renderScreen()}
        </div>
      </div>
    </div>
  )
}
