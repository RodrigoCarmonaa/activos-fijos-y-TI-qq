"use client"

import { useAppStore } from "@/lib/store"
import { Adquisicion } from "@/components/screens/adquisicion"
import { Recepcion } from "@/components/screens/recepcion"
import { ConfiguracionTI } from "@/components/screens/configuracion-ti"
import { CustodiaFirmas } from "@/components/screens/custodia-firmas"
import { SoporteTecnico } from "@/components/screens/soporte-tecnico"
import { Bajas } from "@/components/screens/bajas"
import { NotificationToast } from "@/components/notification-toast"
import { Settings, FileSignature, Wrench, RotateCcw, ChevronRight, ShoppingCart, Package, Trash2 } from "lucide-react"

const screens = [
  { id: 1, name: "Adquisicion", icon: ShoppingCart, color: "emerald" },
  { id: 1.5, name: "Recepcion", icon: Package, color: "indigo" },
  { id: 2, name: "Configuracion TI", icon: Settings, color: "amber" },
  { id: 3, name: "Custodia", icon: FileSignature, color: "blue" },
  { id: 5, name: "Soporte Tecnico", icon: Wrench, color: "rose" },
  { id: 6, name: "Bajas", icon: Trash2, color: "red" },
]

const colorMap: Record<string, { active: string; inactive: string }> = {
  emerald: { active: "bg-emerald-500 text-white shadow-sm", inactive: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
  indigo: { active: "bg-indigo-500 text-white shadow-sm", inactive: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" },
  amber: { active: "bg-amber-500 text-white shadow-sm", inactive: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
  blue: { active: "bg-blue-500 text-white shadow-sm", inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
  rose: { active: "bg-rose-500 text-white shadow-sm", inactive: "bg-rose-50 text-rose-700 hover:bg-rose-100" },
  red: { active: "bg-red-500 text-white shadow-sm", inactive: "bg-red-50 text-red-700 hover:bg-red-100" },
}

const statusColorMap: Record<string, string> = {
  PENDIENTE_ADQUISICION: "text-slate-600",
  ADQUIRIDO: "text-emerald-600",
  RECHAZADO: "text-rose-600",
  EN_BODEGA: "text-indigo-600",
  EN_CONFIGURACION: "text-amber-600",
  LISTO_PARA_ASIGNACION: "text-teal-600",
  ASIGNADO: "text-blue-600",
  EN_MANTENCION: "text-orange-600",
  DADO_DE_BAJA: "text-red-600",
}

export default function Home() {
  const { currentScreen, setCurrentScreen, resetAsset, resetSoftware, asset } = useAppStore()

  const handleReset = () => {
    resetAsset()
    resetSoftware()
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 1: return <Adquisicion />
      case 1.5: return <Recepcion />
      case 2: return <ConfiguracionTI />
      case 3: return <CustodiaFirmas />
      case 5: return <SoporteTecnico />
      case 6: return <Bajas />
      default: return <Adquisicion />
    }
  }

  const statusColor = statusColorMap[asset.status] || "text-slate-600"

  return (
    <div className="min-h-screen bg-muted/30">
      <NotificationToast />

      <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 mr-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">AS</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-foreground">ASCONT</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Gestion de Activos</p>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {screens.map((screen, index) => {
                const Icon = screen.icon
                const isActive = currentScreen === screen.id
                const colors = colorMap[screen.color]
                const btnClass = isActive ? colors.active : colors.inactive
                return (
                  <div key={screen.id} className="flex items-center shrink-0">
                    <button
                      onClick={() => setCurrentScreen(screen.id)}
                      className={"flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all sm:px-3 sm:py-2 sm:text-sm " + btnClass}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{screen.name}</span>
                      <span className="lg:hidden">P{screen.id}</span>
                    </button>
                    {index < screens.length - 1 && (
                      <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>

            <button
              onClick={handleReset}
              className="ml-4 flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-3 sm:py-2 sm:text-sm shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-border py-2 text-xs">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Activo: <span className="font-medium text-foreground">{asset.code || "No asignado"}</span>
              </span>
              <span className="text-muted-foreground">
                Estado:{" "}
                <span className={"font-medium " + statusColor}>
                  {asset.status.replace(/_/g, " ")}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <main>{renderScreen()}</main>
    </div>
  )
}