"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { ShoppingCart, CheckCircle, XCircle, AlertTriangle, RefreshCcw, Loader2 } from "lucide-react"

export function Adquisicion() {
  const { asset, acquireAsset, resetAsset, setCurrentScreen, addNotification } = useAppStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSuccess = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 800))
    acquireAsset(true)
    addNotification("Compra registrada exitosamente. Activo creado en el sistema.", "success")
    setIsProcessing(false)
  }

  const handleError = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 800))
    acquireAsset(false)
    addNotification("Error de validacion: El equipo no cumple los requisitos.", "error")
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <ShoppingCart className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground">Adquisicion de Activos</h1>
              <p className="text-sm text-muted-foreground">Interfaz de Adquisiciones</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Registro de Compra</h2>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="mb-4 text-sm text-muted-foreground">
                Ingrese los datos de la compra para integrar el activo al ecosistema ASCONT.
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Marca y Modelo</label>
                    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
                      HP ProBook 450 G10
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Precio Unitario</label>
                    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
                      $845.900
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Proveedor</label>
                  <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
                    SOLUCIONES TCP
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Solicitante</label>
                  <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
                    Diego Leiva
                  </div>
                </div>
              </div>

              {asset.status === "PENDIENTE_ADQUISICION" && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleError}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    Simular Error de Requisitos
                  </button>
                  <button
                    onClick={handleSuccess}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    Registrar Compra Exitosa
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Estado del Activo</h2>

            {asset.status === "PENDIENTE_ADQUISICION" && (
              <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-6 text-center">
                <ShoppingCart className="mb-3 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">Esperando registro de compra...</p>
              </div>
            )}

            {asset.status === "ADQUIRIDO" && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900">Activo Adquirido</h3>
                    <p className="text-sm text-emerald-700">El activo ha sido ingresado al sistema.</p>
                  </div>
                </div>
                <div className="space-y-2 rounded-lg bg-white/60 p-4 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Codigo Asignado:</span><span className="font-medium">{asset.code}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Equipo:</span><span className="font-medium">{asset.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Estado:</span><span className="font-bold text-emerald-600">ADQUIRIDO</span></div>
                </div>
                <button
                  onClick={() => setCurrentScreen(1.5)}
                  className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Continuar a Recepcion Logistica
                </button>
              </div>
            )}

            {asset.status === "RECHAZADO" && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                    <AlertTriangle className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-900">Adquisicion Rechazada</h3>
                    <p className="text-sm text-rose-700">Incompatible con el software corporativo o requisitos minimos.</p>
                  </div>
                </div>
                <button
                  onClick={() => resetAsset()}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-200"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reiniciar Simulacion
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}