"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { AssetCard } from "@/components/asset-card"
import { 
  FileSignature, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  User,
  Calendar,
  Monitor,
  Loader2
} from "lucide-react"

export function CustodiaFirmas() {
  const { asset, custodyActs, signAct, rejectAct, addNotification } = useAppStore()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [showActaModal, setShowActaModal] = useState(false)
  const [selectedActId, setSelectedActId] = useState<string | null>(null)

  const pendingActs = custodyActs.filter((act) => act.status === "PENDIENTE")
  const selectedAct = custodyActs.find((act) => act.id === selectedActId)

  const handleSignAct = async (actId: string) => {
    setProcessingId(actId)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    signAct(actId)
    addNotification("Acta firmada exitosamente. Activo asignado al custodio.", "success")
    setProcessingId(null)
    setShowActaModal(false)
  }

  const handleRejectAct = async (actId: string) => {
    setProcessingId(actId)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    rejectAct(actId)
    addNotification("Conflicto escalado a RRHH para mediacion. Activo retornado a bodega.", "error")
    setProcessingId(null)
    setShowActaModal(false)
  }

  const openActaModal = (actId: string) => {
    setSelectedActId(actId)
    setShowActaModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <FileSignature className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground">Custodia y Firmas Digitales</h1>
              <p className="text-sm text-muted-foreground">Interfaz del Custodio / Jefe de Area</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Estado del Activo */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Estado del Activo</h2>
            <AssetCard asset={asset} />
          </div>

          {/* Actas Pendientes */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Actas Pendientes de Firma</h2>
            
            {pendingActs.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="font-medium text-card-foreground">No hay actas pendientes</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Todas las actas han sido procesadas
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingActs.map((act) => (
                  <div
                    key={act.id}
                    className="rounded-xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            Acta de Responsabilidad
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {act.assetName} ({act.assetCode})
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                        Pendiente
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Custodio:</span>
                        <span className="font-medium text-card-foreground">{act.custodian}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Fecha:</span>
                        <span className="font-medium text-card-foreground">
                          {new Date(act.createdAt).toLocaleDateString("es-CL")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => openActaModal(act.id)}
                        className="w-full rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-600"
                      >
                        Ver Acta y Gestionar Firma
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Historial de Actas */}
            {custodyActs.filter((a) => a.status !== "PENDIENTE").length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Historial</h3>
                <div className="space-y-2">
                  {custodyActs
                    .filter((a) => a.status !== "PENDIENTE")
                    .map((act) => (
                      <div
                        key={act.id}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          act.status === "FIRMADA"
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-rose-200 bg-rose-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {act.status === "FIRMADA" ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-600" />
                          )}
                          <span className="text-sm font-medium">
                            {act.assetCode} - {act.custodian}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            act.status === "FIRMADA" ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {act.status === "FIRMADA" ? "Firmada" : "Rechazada"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal del Acta */}
      {showActaModal && selectedAct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-card shadow-xl">
            {/* Header del Modal */}
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Acta de Responsabilidad</h3>
                    <p className="text-sm text-muted-foreground">Documento legal de custodia</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowActaModal(false)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Contenido del Acta */}
            <div className="p-6">
              <div className="rounded-lg border border-border bg-muted/30 p-6">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-foreground">
                    ACTA DE RESPONSABILIDAD DE ACTIVO
                  </h4>
                  <p className="text-sm text-muted-foreground">ASCONT - Oficina de Contadores</p>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <p className="text-foreground">
                    Por medio de la presente, yo <strong>{selectedAct.custodian}</strong>, 
                    identificado como custodio designado, declaro recibir en calidad de 
                    responsable el siguiente activo de la empresa:
                  </p>

                  <div className="rounded-lg bg-card p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Equipo:</span>
                        <span className="font-medium">{selectedAct.assetName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Codigo:</span>
                        <span className="font-medium">{selectedAct.assetCode}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-foreground">
                    Me comprometo a hacer buen uso del equipo asignado, reportar cualquier 
                    falla o incidencia al area de TI, y devolverlo en las condiciones recibidas 
                    al momento de mi desvinculacion o cuando sea requerido por la empresa.
                  </p>

                  <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-700">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <p className="text-xs">
                      Al firmar este documento, acepto la responsabilidad legal sobre el activo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones de Accion */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleRejectAct(selectedAct.id)}
                  disabled={processingId === selectedAct.id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 font-medium text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingId === selectedAct.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  Rechazar Firma por Discrepancia
                </button>
                <button
                  onClick={() => handleSignAct(selectedAct.id)}
                  disabled={processingId === selectedAct.id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingId === selectedAct.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5" />
                  )}
                  Firmar Acta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
