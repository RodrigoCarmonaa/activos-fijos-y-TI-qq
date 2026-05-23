"use client"

import { useAppStore } from "@/lib/store"
import { ConfiguracionTI } from "@/components/screens/configuracion-ti"
import { CustodiaFirmas } from "@/components/screens/custodia-firmas"
import { SoporteTecnico } from "@/components/screens/soporte-tecnico"
import { NotificationToast } from "@/components/notification-toast"
import { Settings, FileSignature, Wrench, RotateCcw, ChevronRight } from "lucide-react"

const screens = [
  { id: 2, name: "Configuracion TI", icon: Settings, color: "amber" },
  { id: 3, name: "Custodia y Firmas", icon: FileSignature, color: "blue" },
  { id: 5, name: "Soporte Tecnico", icon: Wrench, color: "rose" },
]

export default function Home() {
  const { currentScreen, setCurrentScreen, resetAsset, resetSoftware, asset } = useAppStore()

  const handleReset = () => {
    resetAsset()
    resetSoftware()
    setCurrentScreen(2)
  }

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: Record<string, { active: string; inactive: string }> = {
      amber: {
        active: "bg-amber-500 text-white",
        inactive: "bg-amber-50 text-amber-700 hover:bg-amber-100",
      },
      blue: {
        active: "bg-blue-500 text-white",
        inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      },
      rose: {
        active: "bg-rose-500 text-white",
        inactive: "bg-rose-50 text-rose-700 hover:bg-rose-100",
      },
    }
    return isActive ? colors[color].active : colors[color].inactive
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 2:
        return <ConfiguracionTI />
      case 3:
        return <CustodiaFirmas />
      case 5:
        return <SoporteTecnico />
      default:
        return <ConfiguracionTI />
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <NotificationToast />
      
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo / Title */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">AS</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-foreground">ASCONT</p>
                <p className="text-xs text-muted-foreground">Gestion de Activos</p>
              </div>
            </div>

            {/* Screen Navigation */}
            <div className="flex items-center gap-1 sm:gap-2">
              {screens.map((screen, index) => {
                const Icon = screen.icon
                const isActive = currentScreen === screen.id
                return (
                  <div key={screen.id} className="flex items-center">
                    <button
                      onClick={() => setCurrentScreen(screen.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all sm:px-3 sm:py-2 sm:text-sm ${getColorClasses(
                        screen.color,
                        isActive
                      )}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden md:inline">{screen.name}</span>
                      <span className="md:hidden">P{screen.id}</span>
                    </button>
                    {index < screens.length - 1 && (
                      <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-3 sm:py-2 sm:text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between border-t border-border py-2 text-xs">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Activo: <span className="font-medium text-foreground">{asset.code}</span>
              </span>
              <span className="text-muted-foreground">
                Estado:{" "}
                <span
                  className={`font-medium ${
                    asset.status === "ASIGNADO"
                      ? "text-emerald-600"
                      : asset.status === "EN_MANTENCION"
                      ? "text-rose-600"
                      : asset.status === "EN_CONFIGURACION"
                      ? "text-amber-600"
                      : asset.status === "LISTO_PARA_ASIGNACION"
                      ? "text-blue-600"
                      : "text-slate-600"
                  }`}
                >
                  {asset.status.replace(/_/g, " ")}
                </span>
              </span>
            </div>
            <span className="text-muted-foreground">
              Pantalla {currentScreen} de 5
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>{renderScreen()}</main>
    </div>
  )
}
