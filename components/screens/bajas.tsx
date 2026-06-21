"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import {
  Trash2,
  AlertOctagon,
  TrendingDown,
  DollarSign,
  Activity,
  FileWarning,
  RotateCcw,
  Loader2,
  Package,
  Wrench,
  CheckCircle,
} from "lucide-react"

export function Bajas() {
  const {
    assets,
    currentAssetId,
    retireAsset,
    repairAsset,
    addNotification,
    selectAsset,
    setCurrentScreen,
  } = useAppStore()

  const currentAsset = assets.find((a) => a.id === currentAssetId) || null
  const eligibleAssets = assets.filter(
    (a) => a.status === "EN_MANTENCION" || a.status === "DADO_DE_BAJA"
  )

  const [isProcessing, setIsProcessing] = useState(false)
  const [repairCost, setRepairCost] = useState("")
  const [retirementReason, setRetirementReason] = useState("")
  const [techDiagnosis, setTechDiagnosis] = useState("")

  const repairCostNum = parseInt(repairCost.replace(/\D/g, "")) || 0
  const assetValue = currentAsset?.value || 0
  const threshold50 = assetValue * 0.5
  const exceedsThreshold = repairCostNum > threshold50 && repairCostNum > 0

  const handleRepairCostChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "")
    setRepairCost(digits ? parseInt(digits).toLocaleString("es-CL") : "")
  }

  const handleRetire = async () => {
    if (!currentAsset) return
    if (!retirementReason.trim()) {
      addNotification("Debe indicar el motivo de la baja.", "warning")
      return
    }
    if (repairCostNum <= 0) {
      addNotification("Ingrese el costo estimado de reparación.", "warning")
      return
    }

    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 1200))

    // Update repair cost on asset
    useAppStore.getState().updateAsset(currentAsset.id, { repairCost: repairCostNum })
    retireAsset(currentAsset.id, retirementReason)
    addNotification("Baja autorizada. Se ha generado una solicitud de reposición.", "warning")
    setIsProcessing(false)
  }

  const handleRepair = async () => {
    if (!currentAsset) return
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 1000))
    repairAsset(currentAsset.id)
    addNotification(`${currentAsset.code} reparado exitosamente. Retorna a estado ASIGNADO.`, "success")
    setIsProcessing(false)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
          <FileWarning className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Gestión de Bajas y Reposición</h1>
          <p className="text-sm text-slate-400">Evaluación de reparabilidad y baja de activos</p>
        </div>
      </div>

      {eligibleAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-12 text-center">
          <Trash2 className="mb-3 h-12 w-12 text-slate-700" />
          <h2 className="text-lg font-semibold text-slate-400">Módulo de Bajas Inactivo</h2>
          <p className="mt-1 text-sm text-slate-500">
            Solo evalúa equipos en estado EN MANTENCIÓN que puedan calificar para baja.
          </p>
          <button
            onClick={() => setCurrentScreen(5)}
            className="mt-4 text-sm font-medium text-red-400 hover:text-red-300"
          >
            Ir a Soporte Técnico →
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Asset selector + evaluation */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Equipos en Evaluación</h2>

            {/* Asset selector */}
            <div className="space-y-2">
              {eligibleAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => selectAsset(asset.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                    currentAssetId === asset.id
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-slate-800 bg-[#1A1D27] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{asset.name}</p>
                      <p className="text-xs text-slate-500">{asset.code} · {asset.yearsInUse} años de uso</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    asset.status === "DADO_DE_BAJA"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-orange-500/10 text-orange-400"
                  }`}>
                    {asset.status === "DADO_DE_BAJA" ? "Dado de Baja" : "En Mantención"}
                  </span>
                </button>
              ))}
            </div>

            {/* Technical diagnosis */}
            {currentAsset && currentAsset.status === "EN_MANTENCION" && (
              <div className="rounded-xl border border-slate-800 bg-[#1A1D27] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4 text-orange-400" />
                  <h3 className="text-sm font-medium text-white">Dictamen Técnico</h3>
                </div>
                <textarea
                  rows={3}
                  value={techDiagnosis}
                  onChange={(e) => setTechDiagnosis(e.target.value)}
                  placeholder="Describa el diagnóstico técnico del equipo..."
                  className="w-full resize-none rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            )}
          </div>

          {/* Right: Financial analysis + resolution */}
          <div className="space-y-4">
            {currentAsset ? (
              currentAsset.status === "DADO_DE_BAJA" ? (
                // Asset already retired
                <div className="rounded-xl border border-slate-800 bg-[#1A1D27] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                    <Trash2 className="h-8 w-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Activo Desincorporado</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {currentAsset.code} ha sido dado de baja legal y contablemente.
                  </p>
                  {currentAsset.retirementReason && (
                    <div className="mt-4 rounded-lg bg-[#0F1117] p-3 text-left">
                      <p className="text-xs text-slate-500 mb-1">Motivo de baja:</p>
                      <p className="text-sm text-slate-300">{currentAsset.retirementReason}</p>
                    </div>
                  )}
                  <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                    <p className="text-sm font-medium text-amber-400">Circularidad de Flujo Activada</p>
                    <p className="mt-1 text-xs text-amber-400/70">
                      Se ha generado una solicitud de reposición de equipo para: <strong>{currentAsset.custodian}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentScreen(1)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Ir a Nueva Adquisición
                  </button>
                </div>
              ) : (
                // Financial analysis
                <>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Análisis Financiero — Regla del 50%
                  </h2>
                  <div className="rounded-xl border border-slate-800 bg-[#1A1D27] p-5 space-y-4">
                    {/* Original value */}
                    <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-slate-500" />
                        <span className="text-sm text-slate-300">Valor Original</span>
                      </div>
                      <span className="font-mono font-medium text-white">${assetValue.toLocaleString("es-CL")}</span>
                    </div>

                    {/* 50% threshold */}
                    <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <TrendingDown className="h-5 w-5 text-slate-500" />
                        <span className="text-sm text-slate-300">Umbral 50%</span>
                      </div>
                      <span className="font-mono font-medium text-amber-400">${threshold50.toLocaleString("es-CL")}</span>
                    </div>

                    {/* Repair cost input */}
                    <div>
                      <label htmlFor="baja-repair-cost" className="mb-1.5 block text-sm font-medium text-slate-300">
                        Costo Estimado de Reparación <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
                        <input
                          id="baja-repair-cost"
                          type="text"
                          value={repairCost}
                          onChange={(e) => handleRepairCostChange(e.target.value)}
                          placeholder="Ingrese costo estimado"
                          className={`w-full rounded-lg border py-2.5 pl-7 pr-4 text-sm font-mono outline-none transition-all ${
                            exceedsThreshold
                              ? "border-red-500/50 bg-red-500/5 text-red-400 focus:ring-red-500/20"
                              : "border-slate-700 bg-[#0F1117] text-white focus:ring-emerald-500/20"
                          } focus:ring-2`}
                        />
                      </div>
                      {exceedsThreshold && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-red-400">
                          <Activity className="h-3.5 w-3.5" />
                          El costo supera el 50% del valor original. Califica para baja técnica.
                        </div>
                      )}
                      {repairCostNum > 0 && !exceedsThreshold && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                          <CheckCircle className="h-3.5 w-3.5" />
                          El costo no supera el umbral. Se recomienda reparar.
                        </div>
                      )}
                    </div>

                    {/* Retirement reason */}
                    <div>
                      <label htmlFor="baja-reason" className="mb-1.5 block text-sm font-medium text-slate-300">
                        Motivo de la Baja <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="baja-reason"
                        rows={2}
                        value={retirementReason}
                        onChange={(e) => setRetirementReason(e.target.value)}
                        placeholder="Describa el motivo de la baja del activo..."
                        className="w-full resize-none rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleRepair}
                        disabled={isProcessing}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/10 disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wrench className="h-4 w-4" />}
                        Reparar Equipo
                      </button>
                      <button
                        onClick={handleRetire}
                        disabled={isProcessing}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:from-red-600 hover:to-red-700 disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileWarning className="h-4 w-4" />}
                        Autorizar Baja
                      </button>
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-8 text-center">
                <Activity className="mb-3 h-10 w-10 text-slate-700" />
                <p className="text-sm text-slate-500">Seleccione un equipo para evaluar</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}