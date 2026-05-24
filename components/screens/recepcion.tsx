"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Package, QrCode, Calculator, CheckCircle, ArrowRight, Loader2 } from "lucide-react"

export function Recepcion() {
  const { asset, receiveAsset, setCurrentScreen, addNotification } = useAppStore()
  const [scannedCode, setScannedCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    if (scannedCode !== "QR-012") {
      addNotification("Codigo escaneado no coincide con el activo esperado (QR-012).", "error")
      return
    }
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 1000))
    receiveAsset(4, 0)
    addNotification("Activo ingresado a bodega y valorado contablemente.", "success")
    setIsProcessing(false)
  }

  if (asset.status !== "ADQUIRIDO" && asset.status !== "EN_BODEGA") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Modulo No Disponible</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            El activo no se encuentra en la etapa de recepcion logistica. Estado actual: {asset.status.replace(/_/g, " ")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              <Package className="h-5 w-5 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground">Recepcion y Valoracion Contable</h1>
              <p className="text-sm text-muted-foreground">Interfaz de Logistica y Finanzas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Paso 1: Recepcion Fisica</h2>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-800">Equipo Esperado</p>
                <p className="text-xs text-slate-600">{asset.name}</p>
                <p className="text-xs text-slate-600">Proveedor: {asset.provider}</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Escanear Codigo QR de Etiqueta</label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
                  <QrCode className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Ej: QR-012"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    disabled={asset.status === "EN_BODEGA"}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  {scannedCode === "QR-012" && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Paso 2: Valoracion Financiera</h2>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Parametros de Depreciacion</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Valor de Adquisicion</label>
                  <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">$845.900</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Vida Util Asignada</label>
                    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-medium text-indigo-700">4 anos</div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Valor Residual Estimado</label>
                    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-medium text-indigo-700">$0</div>
                  </div>
                </div>
              </div>

              {asset.status === "ADQUIRIDO" ? (
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing || !scannedCode}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                  Confirmar Ingreso a Bodega
                </button>
              ) : (
                <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  <CheckCircle className="h-5 w-5" />
                  Activo Ingresado a Bodega Exitosamente
                </div>
              )}
            </div>

            {asset.status === "EN_BODEGA" && (
              <button
                onClick={() => setCurrentScreen(2)}
                className="mt-4 w-full rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50"
              >
                Continuar a Configuracion TI
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}