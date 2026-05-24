"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Trash2, AlertOctagon, TrendingDown, DollarSign, Activity, FileWarning, RotateCcw, Loader2 } from "lucide-react"

export function Bajas() {
  const { asset, retireAsset, addNotification, resetAsset } = useAppStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRetire = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 1500))
    retireAsset()
    addNotification("Baja autorizada. Se ha gatillado automaticamente una nueva solicitud de reposicion para el trabajador.", "warning")
    setIsProcessing(false)
  }

  const repairCost = 450000
  const originalValue = 845900
  const threshold50 = originalValue * 0.5
  const isIrreparable = repairCost > threshold50

  if (asset.status !== "EN_MANTENCION" && asset.status !== "DADO_DE_BAJA") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Trash2 className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Modulo de Bajas Inactivo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Este modulo solo evalua equipos en estado EN MANTENCION tecnica que puedan calificar para baja. Estado actual: {asset.status.replace(/_/g, " ")}
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <FileWarning className="h-5 w-5 text-red-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground">Gestion de Bajas y Reposicion</h1>
              <p className="text-sm text-muted-foreground">Interfaz del Coordinador de Logistica</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Evaluacion de Soporte Tecnico</h2>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-start gap-4 rounded-lg bg-orange-50 p-4">
                <AlertOctagon className="mt-0.5 h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">Dictamen Tecnico: Placa Madre Quemada</p>
                  <p className="mt-1 text-sm text-orange-800">
                    El equipo presenta falla catastrofica en componentes principales tras {asset.yearsInUse} anos de uso intensivo.
                  </p>
                </div>
              </div>

              <h3 className="mb-3 font-medium text-foreground">Analisis Financiero (Regla del 50%)</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Valor Original de Adquisicion</span>
                  </div>
                  <span className="font-mono font-medium">$845.900</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Umbral 50% de Reparacion</span>
                  </div>
                  <span className="font-mono font-medium">$422.950</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Costo Estimado Reparacion</span>
                  </div>
                  <span className="font-mono font-bold text-red-700">$450.000</span>
                </div>
              </div>
              {isIrreparable && (
                <div className="mt-4 text-center text-sm font-medium text-red-600">
                  * El costo de reparacion supera el 50% del valor original. Califica para baja tecnica.
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Resolucion y Cierre</h2>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              {asset.status === "DADO_DE_BAJA" ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <Trash2 className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Activo Desincorporado</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    El equipo {asset.code} ha sido dado de baja legal y contablemente.
                  </p>
                  <div className="mt-6 rounded-lg bg-amber-50 p-4 border border-amber-200">
                    <p className="text-sm font-medium text-amber-800">Circularidad de Flujo Activada</p>
                    <p className="mt-1 text-xs text-amber-700">
                      Se ha generado una solicitud de reposicion de equipo para el colaborador: <strong>{asset.custodian}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => resetAsset()}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reiniciar Simulador (Volver a Pantalla 1)
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Al autorizar la baja, el activo sera retirado de los libros contables y se iniciara automaticamente el flujo de reposicion para que el trabajador no pierda continuidad operativa.
                  </p>
                  <button
                    onClick={handleRetire}
                    disabled={isProcessing}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileWarning className="h-5 w-5" />}
                    Autorizar Baja Legal del Activo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}