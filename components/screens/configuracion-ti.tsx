"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { 
  Settings, 
  CheckCircle, 
  Download, 
  Loader2,
  Package,
  Monitor,
  AlertTriangle
} from "lucide-react"

export function ConfiguracionTI() {
  const { 
    assets, 
    updateAssetStatus, 
    getSoftwareForAsset, 
    installAllSoftware,
    setSelectedAssetId,
    selectedAssetId,
    createCustodyAct
  } = useAppStore()
  
  const [isInstalling, setIsInstalling] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentSoftware, setCurrentSoftware] = useState("")

  const bodegaAssets = assets.filter((a) => a.status === "EN_BODEGA")
  const configuringAssets = assets.filter((a) => a.status === "EN_CONFIGURACION")
  const selectedAsset = assets.find((a) => a.id === selectedAssetId)
  const software = selectedAssetId ? getSoftwareForAsset(selectedAssetId) : []
  const allInstalled = software.every((sw) => sw.installed)

  const handleSelectAsset = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId)
    if (asset && asset.status === "EN_BODEGA") {
      updateAssetStatus(assetId, "EN_CONFIGURACION", "Activo ingresado a configuracion de TI")
    }
    setSelectedAssetId(assetId)
  }

  const handleInstallSoftware = async () => {
    if (!selectedAssetId || isInstalling || allInstalled) return

    setIsInstalling(true)
    setProgress(0)

    for (let i = 0; i < software.length; i++) {
      setCurrentSoftware(software[i].name)
      
      const startProgress = (i / software.length) * 100
      const endProgress = ((i + 1) / software.length) * 100
      
      for (let p = startProgress; p <= endProgress; p += 2) {
        await new Promise((resolve) => setTimeout(resolve, 50))
        setProgress(Math.min(p, endProgress))
      }
      
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    installAllSoftware(selectedAssetId)
    setProgress(100)
    setCurrentSoftware("")
    
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    updateAssetStatus(selectedAssetId, "LISTO_PARA_ASIGNACION", "Stack de software instalado. Activo listo para asignacion.")
    
    // Crear acta de custodia pendiente
    const asset = assets.find((a) => a.id === selectedAssetId)
    if (asset && asset.solicitante) {
      createCustodyAct(selectedAssetId, asset.solicitante)
    }
    
    toast.success("Configuracion completada", {
      description: "Stack de software instalado. Activo listo para asignacion.",
    })
    
    setIsInstalling(false)
    setSelectedAssetId(null)
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
              <p className="text-sm text-muted-foreground">Modulo P2 - Tecnico de TI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Activos en Bodega */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Activos en Bodega</h2>
            {bodegaAssets.length === 0 && configuringAssets.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Package className="h-6 w-6 text-slate-500" />
                </div>
                <p className="font-medium text-card-foreground">Sin activos pendientes</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  No hay activos en bodega esperando configuracion
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bodegaAssets.map((asset) => (
                  <div key={asset.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {asset.code}
                          </span>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            EN_BODEGA
                          </span>
                        </div>
                        <p className="mt-2 font-medium text-card-foreground">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">Solicitante: {asset.solicitante}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectAsset(asset.id)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-amber-600"
                    >
                      <Settings className="h-4 w-4" />
                      Iniciar Configuracion
                    </button>
                  </div>
                ))}

                {configuringAssets.map((asset) => (
                  <div 
                    key={asset.id} 
                    className={`rounded-xl border p-4 shadow-sm ${
                      selectedAssetId === asset.id 
                        ? "border-amber-300 bg-amber-50" 
                        : "border-amber-200 bg-amber-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            {asset.code}
                          </span>
                          <span className="rounded bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800">
                            EN_CONFIGURACION
                          </span>
                        </div>
                        <p className="mt-2 font-medium text-amber-900">{asset.name}</p>
                        <p className="text-sm text-amber-700">Solicitante: {asset.solicitante}</p>
                      </div>
                    </div>
                    {selectedAssetId !== asset.id && (
                      <button
                        onClick={() => setSelectedAssetId(asset.id)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2.5 font-medium text-amber-700 transition-colors hover:bg-amber-100"
                      >
                        <Monitor className="h-4 w-4" />
                        Continuar Configuracion
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel de Configuracion */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Stack de Software</h2>
            {!selectedAsset ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Settings className="h-6 w-6 text-amber-500" />
                </div>
                <p className="font-medium text-card-foreground">Selecciona un activo</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Elige un activo de la lista para iniciar la configuracion
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card shadow-sm">
                {/* Info del Activo */}
                <div className="border-b border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                      <Monitor className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{selectedAsset.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedAsset.code}</p>
                    </div>
                  </div>
                </div>

                {/* Lista de Software */}
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
                  {allInstalled ? (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-100 px-4 py-3 text-emerald-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Configuracion Completada</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleInstallSoftware}
                      disabled={isInstalling}
                      className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all ${
                        isInstalling
                          ? "cursor-wait bg-amber-100 text-amber-700"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                    >
                      {isInstalling ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Instalando Stack de Software...
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5" />
                          Instalar y Verificar Stack
                        </>
                      )}
                    </button>
                  )}

                  {!allInstalled && !isInstalling && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-amber-700">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <p className="text-xs">
                        Al completar la instalacion, se creara automaticamente el acta de custodia para el solicitante.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
