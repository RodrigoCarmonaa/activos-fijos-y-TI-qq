"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import {
  Settings,
  CheckCircle,
  Download,
  Loader2,
  Plus,
  Trash2,
  Package,
  ArrowRight,
  MessageSquare,
} from "lucide-react"
import { configureAssetAction } from "@/app/actions/assets"

export function ConfiguracionTI() {
  const {
    assets,
    currentAssetId,
    getSoftwareForAsset,
    initSoftwareForAsset,
    installAllSoftware,
    addCustomSoftware,
    removeSoftware,
    markAssetConfigured,
    addNotification,
    setCurrentScreen,
    selectAsset,
  } = useAppStore()

  const currentAsset = assets.find((a) => a.id === currentAssetId) || null
  const eligibleAssets = assets.filter(
    (a) => a.status === "EN_BODEGA" || a.status === "EN_CONFIGURACION" || a.status === "LISTO_PARA_ASIGNACION"
  )

  const [isInstalling, setIsInstalling] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentSoftwareName, setCurrentSoftwareName] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSwName, setNewSwName] = useState("")
  const [newSwDesc, setNewSwDesc] = useState("")
  const [techNotes, setTechNotes] = useState("")

  // Initialize software for selected asset
  useEffect(() => {
    if (currentAsset && (currentAsset.status === "EN_BODEGA" || currentAsset.status === "EN_CONFIGURACION")) {
      initSoftwareForAsset(currentAsset.id)
    }
  }, [currentAsset, initSoftwareForAsset])

  const software = currentAsset ? getSoftwareForAsset(currentAsset.id) : []
  const allInstalled = software.length > 0 && software.every((sw) => sw.installed)

  const handleInstallSoftware = async () => {
    if (!currentAsset || isInstalling || allInstalled) return

    setIsInstalling(true)
    setProgress(0)

    const swList = software.filter((sw) => !sw.installed)
    for (let i = 0; i < swList.length; i++) {
      setCurrentSoftwareName(swList[i].name)
      const startProgress = (i / swList.length) * 100
      const endProgress = ((i + 1) / swList.length) * 100
      for (let p = startProgress; p <= endProgress; p += 2) {
        await new Promise((resolve) => setTimeout(resolve, 40))
        setProgress(Math.min(p, endProgress))
      }
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    installAllSoftware(currentAsset.id)
    setProgress(100)
    setCurrentSoftwareName("")
    await new Promise((resolve) => setTimeout(resolve, 400))
    setIsInstalling(false)
  }

  const handleMarkConfigured = async () => {
    if (!currentAsset) return
    setIsInstalling(true)
    const result = await configureAssetAction(currentAsset.id, techNotes || "")
    if (result.error) {
      addNotification(result.error, "error")
    } else {
      useAppStore.setState((state) => ({
        assets: state.assets.map((a) =>
          a.id === currentAsset.id
            ? { ...a, status: "LISTO_PARA_ASIGNACION", technicianNotes: techNotes }
            : a
        )
      }))
      addNotification(`${currentAsset.code} configurado y listo para asignación.`, "success")
    }
    setIsInstalling(false)
  }

  const handleAddSoftware = () => {
    if (!currentAsset || !newSwName.trim()) {
      addNotification("Ingrese un nombre para el software.", "warning")
      return
    }
    addCustomSoftware(currentAsset.id, newSwName.trim(), newSwDesc.trim() || "Software personalizado")
    setNewSwName("")
    setNewSwDesc("")
    setShowAddForm(false)
  }

  const handleRemoveSoftware = (swId: string) => {
    if (!currentAsset) return
    removeSoftware(currentAsset.id, swId)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <Settings className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Configuración de TI</h1>
          <p className="text-sm text-slate-400">Instalación de software y preparación del equipo</p>
        </div>
      </div>

      {eligibleAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-12 text-center">
          <Settings className="mb-3 h-12 w-12 text-slate-700" />
          <h2 className="text-lg font-semibold text-slate-400">Sin equipos para configurar</h2>
          <p className="mt-1 text-sm text-slate-500">Los activos deben estar en estado EN BODEGA para ser configurados.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Asset selection + info */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Seleccionar Equipo</h2>

            {/* Asset selector */}
            <div className="space-y-2">
              {eligibleAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => selectAsset(asset.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                    currentAssetId === asset.id
                      ? "border-amber-500/50 bg-amber-500/5"
                      : "border-slate-800 bg-[#1A1D27] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{asset.name}</p>
                      <p className="text-xs text-slate-500">{asset.code} · {asset.category}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    asset.status === "LISTO_PARA_ASIGNACION"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {asset.status === "LISTO_PARA_ASIGNACION" ? "Configurado" : "Pendiente"}
                  </span>
                </button>
              ))}
            </div>

            {/* Technician notes */}
            {currentAsset && currentAsset.status !== "LISTO_PARA_ASIGNACION" && (
              <div className="rounded-xl border border-slate-800 bg-[#1A1D27] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                  <h3 className="text-sm font-medium text-slate-300">Observaciones del Técnico</h3>
                </div>
                <textarea
                  rows={3}
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                  placeholder="Notas sobre la configuración del equipo..."
                  className="w-full resize-none rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            )}
          </div>

          {/* Right: Software stack */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Stack de Software
              </h2>
              {currentAsset && currentAsset.status !== "LISTO_PARA_ASIGNACION" && (
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar Software
                </button>
              )}
            </div>

            {!currentAsset ? (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-8 text-center">
                <p className="text-sm text-slate-500">Seleccione un equipo para ver su stack de software</p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-[#1A1D27]">
                {/* Add software form */}
                {showAddForm && (
                  <div className="border-b border-slate-800 p-4">
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newSwName}
                        onChange={(e) => setNewSwName(e.target.value)}
                        placeholder="Nombre del software"
                        className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        value={newSwDesc}
                        onChange={(e) => setNewSwDesc(e.target.value)}
                        placeholder="Descripción (opcional)"
                        className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-500"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setShowAddForm(false)} className="flex-1 rounded-lg border border-slate-700 py-2 text-xs text-slate-400 hover:bg-slate-800">
                          Cancelar
                        </button>
                        <button onClick={handleAddSoftware} className="flex-1 rounded-lg bg-amber-500/20 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/30">
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Software list */}
                <div className="divide-y divide-slate-800">
                  {software.map((sw) => (
                    <div key={sw.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          sw.installed ? "bg-emerald-500/10" : "bg-slate-800"
                        }`}>
                          {sw.installed ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Download className="h-4 w-4 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{sw.name}</p>
                          <p className="text-xs text-slate-500">{sw.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${sw.installed ? "text-emerald-400" : "text-slate-500"}`}>
                          {sw.installed ? "Instalado" : "Pendiente"}
                        </span>
                        {sw.isCustom && !sw.installed && (
                          <button
                            onClick={() => handleRemoveSoftware(sw.id)}
                            className="rounded p-1 text-slate-600 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                {isInstalling && (
                  <div className="border-t border-slate-800 p-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {currentSoftwareName ? `Instalando: ${currentSoftwareName}` : "Completando..."}
                      </span>
                      <span className="font-mono font-medium text-amber-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t border-slate-800 p-4 space-y-3">
                  {currentAsset.status === "LISTO_PARA_ASIGNACION" ? (
                    <>
                      <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
                        <CheckCircle className="h-5 w-5" />
                        Software Instalado · Activo Configurado
                      </div>
                      <button
                        onClick={() => setCurrentScreen(3)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2.5 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/10"
                      >
                        Continuar a Custodia
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  ) : !allInstalled ? (
                    <button
                      onClick={handleInstallSoftware}
                      disabled={isInstalling}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-600 hover:to-amber-700 disabled:opacity-50"
                    >
                      {isInstalling ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Instalando Stack...
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5" />
                          Instalar Stack de Software
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleMarkConfigured}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Marcar como Configurado
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
