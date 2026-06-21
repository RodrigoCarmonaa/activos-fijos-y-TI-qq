"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import {
  FileSignature,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  Monitor,
  Loader2,
  Plus,
  Package,
} from "lucide-react"

export function CustodiaFirmas() {
  const {
    assets,
    currentAssetId,
    custodians,
    custodyActs,
    createCustodyAct,
    signAct,
    rejectAct,
    addNotification,
    selectAsset,
  } = useAppStore()

  const currentAsset = assets.find((a) => a.id === currentAssetId) || null
  const eligibleAssets = assets.filter(
    (a) => a.status === "LISTO_PARA_ASIGNACION" || a.status === "ASIGNADO"
  )

  const [processingId, setProcessingId] = useState<string | null>(null)
  const [showActaModal, setShowActaModal] = useState(false)
  const [selectedActId, setSelectedActId] = useState<string | null>(null)
  const [signatureText, setSignatureText] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)

  // Create act form
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedCustodian, setSelectedCustodian] = useState("")

  const pendingActs = custodyActs.filter((act) => act.status === "PENDIENTE")
  const selectedAct = custodyActs.find((act) => act.id === selectedActId)

  const handleCreateAct = () => {
    if (!currentAsset) {
      addNotification("Seleccione un activo primero.", "warning")
      return
    }
    if (!selectedCustodian) {
      addNotification("Seleccione un custodio.", "warning")
      return
    }
    createCustodyAct(currentAsset.id, selectedCustodian)
    addNotification(`Acta de custodia creada para ${selectedCustodian}.`, "success")
    setShowCreateForm(false)
    setSelectedCustodian("")
  }

  const handleSignAct = async (actId: string) => {
    if (!signatureText.trim()) {
      addNotification("Debe escribir su nombre completo para firmar.", "warning")
      return
    }
    if (!acceptTerms) {
      addNotification("Debe aceptar los términos de responsabilidad.", "warning")
      return
    }
    setProcessingId(actId)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    signAct(actId, signatureText)
    addNotification("Acta firmada exitosamente. Activo asignado al custodio.", "success")
    setProcessingId(null)
    setShowActaModal(false)
    setSignatureText("")
    setAcceptTerms(false)
  }

  const handleRejectAct = async (actId: string) => {
    if (!rejectReason.trim()) {
      addNotification("Debe indicar el motivo del rechazo.", "warning")
      return
    }
    setProcessingId(actId)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    rejectAct(actId, rejectReason)
    addNotification("Acta rechazada. Activo retornado a bodega.", "error")
    setProcessingId(null)
    setShowActaModal(false)
    setRejectReason("")
    setShowRejectForm(false)
  }

  const openActaModal = (actId: string) => {
    setSelectedActId(actId)
    setShowActaModal(true)
    setShowRejectForm(false)
    setSignatureText("")
    setAcceptTerms(false)
    setRejectReason("")
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <FileSignature className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Custodia y Firmas Digitales</h1>
            <p className="text-sm text-slate-400">Gestión de actas de responsabilidad</p>
          </div>
        </div>
        {currentAsset?.status === "LISTO_PARA_ASIGNACION" && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/30"
          >
            <Plus className="h-4 w-4" />
            Crear Acta
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Asset selector + create form */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Activos Disponibles</h2>

          {eligibleAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-8 text-center">
              <Package className="mb-3 h-10 w-10 text-slate-700" />
              <p className="text-sm text-slate-500">No hay activos listos para asignación</p>
            </div>
          ) : (
            <div className="space-y-2">
              {eligibleAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => selectAsset(asset.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                    currentAssetId === asset.id
                      ? "border-blue-500/50 bg-blue-500/5"
                      : "border-slate-800 bg-[#1A1D27] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{asset.name}</p>
                      <p className="text-xs text-slate-500">{asset.code} · {asset.custodian || "Sin custodio"}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    asset.status === "ASIGNADO"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {asset.status === "ASIGNADO" ? "Asignado" : "Disponible"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Create act form */}
          {showCreateForm && currentAsset && (
            <div className="rounded-xl border border-blue-500/30 bg-[#1A1D27] p-5">
              <h3 className="mb-4 font-semibold text-white">Crear Acta de Custodia</h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs text-slate-500">Activo seleccionado</p>
                  <div className="rounded-lg bg-[#0F1117] p-3 text-sm">
                    <span className="font-mono text-blue-400">{currentAsset.code}</span>
                    <span className="ml-2 text-white">{currentAsset.name}</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="cust-select" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Custodio Responsable <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="cust-select"
                    value={selectedCustodian}
                    onChange={(e) => setSelectedCustodian(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Seleccione custodio...</option>
                    {custodians.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} - {c.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 rounded-lg border border-slate-700 py-2 text-sm text-slate-400 hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateAct}
                    className="flex-1 rounded-lg bg-blue-500/20 py-2 text-sm font-medium text-blue-400 hover:bg-blue-500/30"
                  >
                    Crear Acta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Pending acts + history */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Actas de Custodia</h2>

          {pendingActs.length === 0 && custodyActs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-8 text-center">
              <FileText className="mb-3 h-10 w-10 text-slate-700" />
              <p className="text-sm text-slate-500">No hay actas registradas</p>
              <p className="mt-1 text-xs text-slate-600">Cree un acta seleccionando un activo disponible</p>
            </div>
          ) : (
            <>
              {/* Pending acts */}
              {pendingActs.length > 0 && (
                <div className="space-y-2">
                  {pendingActs.map((act) => (
                    <div key={act.id} className="rounded-xl border border-slate-800 bg-[#1A1D27] p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <FileText className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Acta de Responsabilidad</p>
                            <p className="text-sm text-slate-400">{act.assetName} ({act.assetCode})</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                          Pendiente
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-600" />
                          <span className="text-slate-400">Custodio:</span>
                          <span className="font-medium text-white">{act.custodian}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-600" />
                          <span className="text-slate-400">Fecha:</span>
                          <span className="font-medium text-white">{new Date(act.createdAt).toLocaleDateString("es-CL")}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => openActaModal(act.id)}
                        className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-600 hover:to-blue-700"
                      >
                        Ver Acta y Gestionar Firma
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* History */}
              {custodyActs.filter((a) => a.status !== "PENDIENTE").length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">Historial</h3>
                  <div className="space-y-2">
                    {custodyActs
                      .filter((a) => a.status !== "PENDIENTE")
                      .map((act) => (
                        <div
                          key={act.id}
                          className={`flex items-center justify-between rounded-lg border p-3 ${
                            act.status === "FIRMADA"
                              ? "border-emerald-500/20 bg-emerald-500/5"
                              : "border-red-500/20 bg-red-500/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {act.status === "FIRMADA" ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span className="text-sm font-medium text-white">
                              {act.assetCode} — {act.custodian}
                            </span>
                          </div>
                          <span className={`text-xs font-medium ${
                            act.status === "FIRMADA" ? "text-emerald-400" : "text-red-400"
                          }`}>
                            {act.status === "FIRMADA" ? "Firmada" : "Rechazada"}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal del Acta */}
      {showActaModal && selectedAct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#1A1D27] shadow-2xl">
            {/* Modal header */}
            <div className="border-b border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Acta de Responsabilidad</h3>
                    <p className="text-sm text-slate-400">Documento legal de custodia</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowActaModal(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal content */}
            <div className="p-6">
              <div className="rounded-xl border border-slate-700 bg-[#0F1117] p-6">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-white">ACTA DE RESPONSABILIDAD DE ACTIVO</h4>
                  <p className="text-sm text-slate-500">ASCONT — Oficina de Contadores</p>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <p className="text-slate-300">
                    Por medio de la presente, yo <strong className="text-white">{selectedAct.custodian}</strong>,
                    identificado como custodio designado, declaro recibir en calidad de
                    responsable el siguiente activo de la empresa:
                  </p>

                  <div className="rounded-lg bg-[#1A1D27] p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-slate-600" />
                        <span className="text-slate-500">Equipo:</span>
                        <span className="font-medium text-white">{selectedAct.assetName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-600" />
                        <span className="text-slate-500">Código:</span>
                        <span className="font-mono font-medium text-blue-400">{selectedAct.assetCode}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-300">
                    Me comprometo a hacer buen uso del equipo asignado, reportar cualquier
                    falla o incidencia al área de TI, y devolverlo en las condiciones recibidas
                    al momento de mi desvinculación o cuando sea requerido por la empresa.
                  </p>
                </div>
              </div>

              {/* Signature section */}
              {!showRejectForm ? (
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="cust-signature" className="mb-1.5 block text-sm font-medium text-slate-300">
                      Firma Digital — Nombre Completo <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="cust-signature"
                      type="text"
                      value={signatureText}
                      onChange={(e) => setSignatureText(e.target.value)}
                      placeholder="Escriba su nombre completo para firmar"
                      className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-sm text-slate-400">
                      Acepto la responsabilidad legal sobre el activo y me comprometo a cumplir con las condiciones establecidas en esta acta.
                    </span>
                  </label>

                  <div className="flex items-center gap-2 rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                    <p className="text-xs text-amber-400/80">
                      Al firmar este documento, acepta la responsabilidad legal sobre el activo.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRejectForm(true)}
                      disabled={processingId === selectedAct.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 font-medium text-red-400 transition-all hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <XCircle className="h-5 w-5" />
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleSignAct(selectedAct.id)}
                      disabled={processingId === selectedAct.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50"
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
              ) : (
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="cust-reject-reason" className="mb-1.5 block text-sm font-medium text-slate-300">
                      Motivo del Rechazo <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="cust-reject-reason"
                      rows={3}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Indique el motivo por el cual rechaza la firma..."
                      className="w-full resize-none rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="flex-1 rounded-lg border border-slate-700 py-3 text-sm text-slate-400 hover:bg-slate-800"
                    >
                      Volver
                    </button>
                    <button
                      onClick={() => handleRejectAct(selectedAct.id)}
                      disabled={processingId === selectedAct.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500/20 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/30 disabled:opacity-50"
                    >
                      {processingId === selectedAct.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      Confirmar Rechazo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
