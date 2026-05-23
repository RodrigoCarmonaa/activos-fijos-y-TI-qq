"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { AssetCard } from "@/components/asset-card"
import { Settings, CheckCircle, Download, Loader2 } from "lucide-react"

export function ConfiguracionTI() {
  const { asset, software, installAllSoftware, setAssetStatus, addNotification } = useAppStore()
  const [isInstalling, setIsInstalling] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentSoftware, setCurrentSoftware] = useState("")

  const allInstalled = software.every((sw) => sw.installed)

  const handleInstallSoftware = async () => {
    if (isInstalling || allInstalled) return

    setIsInstalling(true)
    setProgress(0)

    // Simular instalacion de cada software
    for (let i = 0; i < software.length; i++) {
      setCurrentSoftware(software[i].name)
      
      // Simular progreso incremental
      const startProgress = (i / software.length) * 100
      const endProgress = ((i + 1) / software.length) * 100
      
      for (let p = startProgress; p <= endProgress; p += 2) {
        await new Promise((resolve) => setTimeout(resolve, 50))
        setProgress(Math.min(p, endProgress))
      }
      
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    // Completar instalacion
    installAllSoftware()
    setProgress(100)
    setCurrentSoftware("")
    
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // Cambiar estado del activo
    setAssetStatus("LISTO_PARA_ASIGNACION")
    addNotification("Stack de software instalado correctamente. Activo listo para asignacion.", "success")
    
    setIsInstalling(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Settings className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground">Configuracion de TI</h1>
              <p className="text-sm text-muted-foreground">Interfaz del Tecnico de TI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Ficha del Activo */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Ficha del Activo</h2>
            <AssetCard asset={asset} />
          </div>

          {/* Stack de Software */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Stack de Software Corporativo</h2>
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="divide-y divide-border">
                {software.map((sw) => (
                  <div key={sw.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        sw.installed ? "bg-emerald-100" : "bg-slate-100"
                      }`}>
                        {sw.installed ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Download className="h-4 w-4 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{sw.name}</p>
                        <p className="text-xs text-muted-foreground">{sw.description}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${
                      sw.installed ? "text-emerald-600" : "text-muted-foreground"
                    }`}>
                      {sw.installed ? "Instalado" : "Pendiente"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Barra de Progreso */}
              {isInstalling && (
                <div className="border-t border-border p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {currentSoftware ? `Instalando: ${currentSoftware}` : "Completando..."}
                    </span>
                    <span className="font-medium text-foreground">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Boton de Accion */}
              <div className="border-t border-border p-4">
                <button
                  onClick={handleInstallSoftware}
                  disabled={isInstalling || allInstalled}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all ${
                    allInstalled
                      ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
                      : isInstalling
                      ? "cursor-wait bg-amber-100 text-amber-700"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                >
                  {allInstalled ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Software Instalado Completamente
                    </>
                  ) : isInstalling ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Instalando Stack de Software...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      Instalar y Verificar Stack de Software
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
