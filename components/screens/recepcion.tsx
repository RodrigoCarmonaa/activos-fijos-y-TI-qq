"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Package, QrCode, Calculator, CheckCircle, ArrowRight, Loader2, AlertCircle, ClipboardCheck } from "lucide-react"

export function Recepcion() {
  const { assets, currentAssetId, receiveAsset, setCurrentScreen, addNotification, selectAsset } = useAppStore()
  const currentAsset = assets.find((a) => a.id === currentAssetId) || null

  const [scannedCode, setScannedCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [usefulLife, setUsefulLife] = useState("4")
  const [residualValue, setResidualValue] = useState("0")
  const [checks, setChecks] = useState({
    exterior: false,
    accessories: false,
    powersOn: false,
    serialMatch: false,
  })

  const eligibleAssets = assets.filter((a) => a.status === "ADQUIRIDO" || a.status === "EN_BODEGA")
  const scannedAsset = assets.find((a) => a.code === scannedCode.trim().toUpperCase())
  const codeValid = scannedAsset && scannedAsset.status === "ADQUIRIDO"
  const allChecked = Object.values(checks).every(Boolean)

  const handleConfirm = async () => {
    if (!scannedAsset || !codeValid) {
      addNotification("Código no válido o activo no está en estado ADQUIRIDO.", "error")
      return
    }
    if (!allChecked) {
      addNotification("Complete toda la verificación física antes de confirmar.", "warning")
      return
    }
    const life = parseInt(usefulLife) || 4
    const residual = parseInt(residualValue.replace(/\D/g, "")) || 0

    if (life <= 0 || life > 20) {
      addNotification("La vida útil debe ser entre 1 y 20 años.", "error")
      return
    }

    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 1000))
    receiveAsset(scannedAsset.id, life, residual)
    selectAsset(scannedAsset.id)
    addNotification(`Activo ${scannedAsset.code} ingresado a bodega y valorado contablemente.`, "success")
    setIsProcessing(false)
  }

  const handleResidualChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "")
    setResidualValue(digits ? parseInt(digits).toLocaleString("es-CL") : "0")
  }

  const checkLabels = {
    exterior: "Estado exterior sin daños visibles",
    accessories: "Accesorios completos (cargador, cables, manuales)",
    powersOn: "El equipo enciende correctamente",
    serialMatch: "Número de serie coincide con documentación",
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
          <Package className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Recepción y Valoración Contable</h1>
          <p className="text-sm text-slate-400">Verificación física e ingreso a bodega</p>
        </div>
      </div>

      {/* No eligible assets */}
      {eligibleAssets.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-12 text-center">
          <Package className="mb-3 h-12 w-12 text-slate-700" />
          <h2 className="text-lg font-semibold text-slate-400">Sin activos para recibir</h2>
          <p className="mt-1 text-sm text-slate-500">
            Primero registre una adquisición en la pantalla anterior.
          </p>
          <button
            onClick={() => setCurrentScreen(1)}
            className="mt-4 text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            Ir a Adquisiciones →
          </button>
        </div>
      )}

      {eligibleAssets.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Physical reception */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Paso 1: Recepción Física</h2>
            <div className="rounded-xl border border-slate-800 bg-[#1A1D27] p-6">
              {/* Scan QR */}
              <div className="mb-6">
                <label htmlFor="rec-qr" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Escanear Código QR de Etiqueta
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2.5">
                  <QrCode className="h-5 w-5 text-slate-500" />
                  <input
                    id="rec-qr"
                    type="text"
                    placeholder="Ej: QR-001"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value.toUpperCase())}
                    className="w-full bg-transparent text-sm font-mono text-white outline-none placeholder:text-slate-600"
                  />
                  {scannedCode && codeValid && <CheckCircle className="h-5 w-5 text-emerald-400" />}
                  {scannedCode && !codeValid && scannedCode.length >= 3 && <AlertCircle className="h-5 w-5 text-red-400" />}
                </div>
                {scannedCode && !codeValid && scannedCode.length >= 3 && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {scannedAsset ? "Este activo ya fue recibido o no está en estado ADQUIRIDO." : "Código no encontrado en el sistema."}
                  </p>
                )}
              </div>

              {/* Asset info when scanned */}
              {codeValid && scannedAsset && (
                <div className="mb-6 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
                  <p className="text-sm font-semibold text-white">{scannedAsset.name}</p>
                  <p className="text-xs text-slate-400">
                    Proveedor: {scannedAsset.provider} · Valor: ${scannedAsset.value.toLocaleString("es-CL")}
                  </p>
                </div>
              )}

              {/* Physical verification checklist */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-slate-400" />
                  <h3 className="text-sm font-medium text-slate-300">Verificación Física</h3>
                </div>
                <div className="space-y-2">
                  {Object.entries(checkLabels).map(([key, label]) => (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                        checks[key as keyof typeof checks]
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-slate-700 bg-[#0F1117] hover:border-slate-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checks[key as keyof typeof checks]}
                        onChange={(e) => setChecks({ ...checks, [key]: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20"
                      />
                      <span className={`text-sm ${checks[key as keyof typeof checks] ? "text-white" : "text-slate-400"}`}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Financial valuation */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Paso 2: Valoración Financiera</h2>
            <div className="rounded-xl border border-slate-800 bg-[#1A1D27] p-6">
              <div className="mb-5 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-indigo-400" />
                <h3 className="font-medium text-white">Parámetros de Depreciación</h3>
              </div>

              <div className="space-y-4">
                {/* Acquisition value */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Valor de Adquisición</label>
                  <div className="rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 font-mono text-sm text-white">
                    ${codeValid && scannedAsset ? scannedAsset.value.toLocaleString("es-CL") : "---"}
                  </div>
                </div>

                {/* Useful life + Residual value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rec-life" className="mb-1.5 block text-sm font-medium text-slate-300">
                      Vida Útil (años) <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="rec-life"
                      type="number"
                      min="1"
                      max="20"
                      value={usefulLife}
                      onChange={(e) => setUsefulLife(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm font-mono text-indigo-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="rec-residual" className="mb-1.5 block text-sm font-medium text-slate-300">
                      Valor Residual (CLP)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
                      <input
                        id="rec-residual"
                        type="text"
                        value={residualValue}
                        onChange={(e) => handleResidualChange(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-[#0F1117] py-2.5 pl-7 pr-4 text-sm font-mono text-indigo-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Depreciation preview */}
                {codeValid && scannedAsset && (
                  <div className="rounded-lg border border-slate-700 bg-[#0F1117] p-4">
                    <p className="mb-2 text-xs font-medium text-slate-500">Vista previa de depreciación anual</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-indigo-400">
                        ${Math.round((scannedAsset.value - (parseInt(residualValue.replace(/\D/g, "")) || 0)) / (parseInt(usefulLife) || 1)).toLocaleString("es-CL")}
                      </span>
                      <span className="text-sm text-slate-500">/ año</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action button */}
              {currentAsset?.status === "EN_BODEGA" ? (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
                    <CheckCircle className="h-5 w-5" />
                    Activo Ingresado a Bodega
                  </div>
                  <button
                    onClick={() => setCurrentScreen(2)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-4 py-2.5 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-500/10"
                  >
                    Continuar a Configuración TI
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing || !codeValid || !allChecked}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                  Confirmar Ingreso a Bodega
                </button>
              )}
            </div>

            {/* Eligible assets list */}
            {eligibleAssets.filter(a => a.status === "ADQUIRIDO").length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-[#1A1D27] p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Activos Pendientes de Recepción</h3>
                <div className="space-y-1.5">
                  {eligibleAssets.filter(a => a.status === "ADQUIRIDO").map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between rounded-lg bg-[#0F1117] p-2.5 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-indigo-400">{a.code}</span>
                        <span className="text-slate-400">{a.name}</span>
                      </div>
                      <button
                        onClick={() => { setScannedCode(a.code); selectAsset(a.id) }}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                      >
                        Seleccionar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}