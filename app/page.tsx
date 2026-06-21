"use client"

import { useAppStore, screensByRole } from "@/lib/store"
import { Login } from "@/components/screens/login"
import { Dashboard } from "@/components/screens/dashboard"
import { Adquisicion } from "@/components/screens/adquisicion"
import { Recepcion } from "@/components/screens/recepcion"
import { ConfiguracionTI } from "@/components/screens/configuracion-ti"
import { CustodiaFirmas } from "@/components/screens/custodia-firmas"
import { SoporteTecnico } from "@/components/screens/soporte-tecnico"
import { Bajas } from "@/components/screens/bajas"
import { NotificationToast } from "@/components/notification-toast"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Settings,
  FileSignature,
  Wrench,
  Trash2,
  LogOut,
  Shield,
  User,
} from "lucide-react"
import type { UserRole } from "@/lib/types"

const allScreens = [
  { id: 0, name: "Dashboard", icon: LayoutDashboard, color: "emerald" },
  { id: 1, name: "Adquisición", icon: ShoppingCart, color: "emerald" },
  { id: 1.5, name: "Recepción", icon: Package, color: "indigo" },
  { id: 2, name: "Configuración TI", icon: Settings, color: "amber" },
  { id: 3, name: "Custodia", icon: FileSignature, color: "blue" },
  { id: 5, name: "Soporte", icon: Wrench, color: "rose" },
  { id: 6, name: "Bajas", icon: Trash2, color: "red" },
]

const colorMap: Record<string, { active: string; inactive: string; glow: string }> = {
  emerald: { active: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30", inactive: "text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10", glow: "emerald" },
  indigo: { active: "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30", inactive: "text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10", glow: "indigo" },
  amber: { active: "bg-amber-500 text-white shadow-lg shadow-amber-500/30", inactive: "text-slate-400 hover:text-amber-400 hover:bg-amber-500/10", glow: "amber" },
  blue: { active: "bg-blue-500 text-white shadow-lg shadow-blue-500/30", inactive: "text-slate-400 hover:text-blue-400 hover:bg-blue-500/10", glow: "blue" },
  rose: { active: "bg-rose-500 text-white shadow-lg shadow-rose-500/30", inactive: "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10", glow: "rose" },
  red: { active: "bg-red-500 text-white shadow-lg shadow-red-500/30", inactive: "text-slate-400 hover:text-red-400 hover:bg-red-500/10", glow: "red" },
}

const roleLabels: Record<UserRole, { label: string; color: string }> = {
  ADMIN: { label: "Admin", color: "text-emerald-400" },
  TECNICO_TI: { label: "Técnico TI", color: "text-amber-400" },
  CUSTODIO: { label: "Custodio", color: "text-blue-400" },
}

export default function Home() {
  const { currentScreen, setCurrentScreen, currentUser, logout, assets, currentAssetId } = useAppStore()

  // Not logged in → show login
  if (!currentUser) {
    return (
      <>
        <NotificationToast />
        <Login />
      </>
    )
  }

  const currentAsset = assets.find((a) => a.id === currentAssetId) || null
  const userScreens = screensByRole[currentUser.role] || [0]
  const visibleScreens = allScreens.filter((s) => userScreens.includes(s.id))
  const roleInfo = roleLabels[currentUser.role]

  const renderScreen = () => {
    switch (currentScreen) {
      case 0: return <Dashboard />
      case 1: return <Adquisicion />
      case 1.5: return <Recepcion />
      case 2: return <ConfiguracionTI />
      case 3: return <CustodiaFirmas />
      case 5: return <SoporteTecnico />
      case 6: return <Bajas />
      default: return <Dashboard />
    }
  }

  const statusLabels: Record<string, string> = {
    PENDIENTE_ADQUISICION: "Pendiente",
    ADQUIRIDO: "Adquirido",
    RECHAZADO: "Rechazado",
    EN_BODEGA: "En Bodega",
    EN_CONFIGURACION: "En Config.",
    LISTO_PARA_ASIGNACION: "Listo",
    ASIGNADO: "Asignado",
    EN_MANTENCION: "Mantención",
    DADO_DE_BAJA: "Baja",
  }

  const statusColors: Record<string, string> = {
    ADQUIRIDO: "text-emerald-400",
    RECHAZADO: "text-red-400",
    EN_BODEGA: "text-indigo-400",
    EN_CONFIGURACION: "text-amber-400",
    LISTO_PARA_ASIGNACION: "text-teal-400",
    ASIGNADO: "text-blue-400",
    EN_MANTENCION: "text-orange-400",
    DADO_DE_BAJA: "text-red-400",
  }

  return (
    <div className="min-h-screen bg-[#0F1117]">
      <NotificationToast />

      {/* Top navigation bar */}
      <div className="sticky top-0 z-40 border-b border-slate-800 bg-[#0F1117]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center gap-3 mr-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <span className="text-sm font-bold text-white">AS</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-white">ASCONT</p>
                <p className="text-xs text-slate-500">Gestión de Activos</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 items-center justify-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {visibleScreens.map((screen) => {
                const Icon = screen.icon
                const isActive = currentScreen === screen.id
                const colors = colorMap[screen.color]
                const btnClass = isActive ? colors.active : colors.inactive

                return (
                  <button
                    key={screen.id}
                    onClick={() => setCurrentScreen(screen.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all sm:px-3 sm:text-sm shrink-0 ${btnClass}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{screen.name}</span>
                  </button>
                )
              })}
            </nav>

            {/* User info + logout */}
            <div className="flex items-center gap-3 ml-4 shrink-0">
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-white">{currentUser.name}</p>
                  <p className={`text-xs font-medium ${roleInfo.color}`}>
                    {roleInfo.label}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-2.5 py-2 text-xs font-medium text-slate-400 transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>

          {/* Status bar */}
          {currentAsset && currentScreen !== 0 && (
            <div className="flex items-center justify-between border-t border-slate-800/50 py-2 text-xs">
              <div className="flex items-center gap-4">
                <span className="text-slate-500">
                  Activo:{" "}
                  <span className="font-mono font-medium text-emerald-400">{currentAsset.code}</span>
                </span>
                <span className="text-slate-500">
                  Estado:{" "}
                  <span className={`font-medium ${statusColors[currentAsset.status] || "text-slate-400"}`}>
                    {statusLabels[currentAsset.status] || currentAsset.status}
                  </span>
                </span>
                <span className="text-slate-600">{currentAsset.name}</span>
              </div>
              <span className="text-slate-600">
                {assets.length} activo{assets.length !== 1 ? "s" : ""} registrado{assets.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-7xl">
        {renderScreen()}
      </main>
    </div>
  )
}