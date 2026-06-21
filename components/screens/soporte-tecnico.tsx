"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import type { TicketPriority, TicketCategory } from "@/lib/types"
import {
  Wrench,
  Plus,
  AlertCircle,
  Clock,
  FileText,
  Loader2,
  CheckCircle,
  Package,
  MessageSquare,
  X,
} from "lucide-react"

const priorityConfig: Record<TicketPriority, { label: string; color: string; bg: string }> = {
  ALTA: { label: "Alta", color: "text-red-400", bg: "bg-red-500/10" },
  MEDIA: { label: "Media", color: "text-amber-400", bg: "bg-amber-500/10" },
  BAJA: { label: "Baja", color: "text-blue-400", bg: "bg-blue-500/10" },
}

const categoryConfig: Record<TicketCategory, { label: string }> = {
  HARDWARE: { label: "Hardware" },
  SOFTWARE: { label: "Software" },
  RED: { label: "Red" },
  OTRO: { label: "Otro" },
}

export function SoporteTecnico() {
  const {
    assets,
    currentAssetId,
    supportTickets,
    createTicket,
    resolveTicket,
    addNotification,
    selectAsset,
  } = useAppStore()

  const currentAsset = assets.find((a) => a.id === currentAssetId) || null
  const eligibleAssets = assets.filter(
    (a) => a.status === "ASIGNADO" || a.status === "EN_MANTENCION"
  )

  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    yearsInUse: 2,
    description: "",
    priority: "MEDIA" as TicketPriority,
    category: "HARDWARE" as TicketCategory,
  })

  // Resolve ticket
  const [resolvingId, setResolvingId] = useState<string | null>(null)
  const [resolution, setResolution] = useState("")

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description.trim()) {
      addNotification("Describa el problema reportado.", "warning")
      return
    }
    if (!currentAsset) {
      addNotification("Seleccione un activo.", "warning")
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    createTicket(currentAsset.id, formData.description, formData.yearsInUse, formData.priority, formData.category)
    addNotification(`Ticket creado. ${currentAsset.code} ingresado a mantención.`, "success")
    setIsSubmitting(false)
    setShowForm(false)
    setFormData({ ...formData, description: "" })
  }

  const handleResolveTicket = async (ticketId: string) => {
    if (!resolution.trim()) {
      addNotification("Describa la resolución del ticket.", "warning")
      return
    }
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    resolveTicket(ticketId, resolution)
    addNotification("Ticket resuelto exitosamente.", "success")
    setIsSubmitting(false)
    setResolvingId(null)
    setResolution("")
  }

  const assetTickets = currentAsset
    ? supportTickets.filter((t) => t.assetId === currentAsset.id)
    : supportTickets

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
            <Wrench className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Soporte Técnico y Mantención</h1>
            <p className="text-sm text-slate-400">Reporte de fallas y gestión de tickets</p>
          </div>
        </div>
        {currentAsset && currentAsset.status === "ASIGNADO" && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-400 transition-all hover:bg-rose-500/30"
          >
            <Plus className="h-4 w-4" />
            Nuevo Ticket
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Asset selector */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Seleccionar Equipo</h2>

          {eligibleAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-8 text-center">
              <Wrench className="mb-3 h-10 w-10 text-slate-700" />
              <p className="text-sm text-slate-500">No hay equipos asignados para reportar fallas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {eligibleAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => selectAsset(asset.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                    currentAssetId === asset.id
                      ? "border-rose-500/50 bg-rose-500/5"
                      : "border-slate-800 bg-[#1A1D27] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{asset.name}</p>
                      <p className="text-xs text-slate-500">{asset.code} · {asset.custodian}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    asset.status === "EN_MANTENCION"
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {asset.status === "EN_MANTENCION" ? "En Mantención" : "Asignado"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Ticket form */}
          {showForm && currentAsset && (
            <div className="rounded-xl border border-rose-500/30 bg-[#1A1D27] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-white">Nuevo Ticket de Soporte</h3>
                <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                {/* Asset info */}
                <div className="rounded-lg bg-[#0F1117] p-3 text-sm">
                  <span className="font-mono text-rose-400">{currentAsset.code}</span>
                  <span className="ml-2 text-white">{currentAsset.name}</span>
                </div>

                {/* Priority + Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="ticket-priority" className="mb-1.5 block text-sm font-medium text-slate-300">Prioridad</label>
                    <select
                      id="ticket-priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                      className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2.5 text-sm text-white outline-none focus:border-rose-500"
                    >
                      <option value="ALTA">Alta</option>
                      <option value="MEDIA">Media</option>
                      <option value="BAJA">Baja</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ticket-category" className="mb-1.5 block text-sm font-medium text-slate-300">Categoría</label>
                    <select
                      id="ticket-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
                      className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2.5 text-sm text-white outline-none focus:border-rose-500"
                    >
                      <option value="HARDWARE">Hardware</option>
                      <option value="SOFTWARE">Software</option>
                      <option value="RED">Red</option>
                      <option value="OTRO">Otro</option>
                    </select>
                  </div>
                </div>

                {/* Years in use */}
                <div>
                  <label htmlFor="ticket-years" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Tiempo de Uso (años)
                  </label>
                  <input
                    id="ticket-years"
                    type="number"
                    min="0"
                    max="20"
                    value={formData.yearsInUse}
                    onChange={(e) => setFormData({ ...formData, yearsInUse: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2.5 text-sm text-white outline-none focus:border-rose-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="ticket-desc" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Descripción del Problema <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="ticket-desc"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describa el problema en detalle..."
                    className="w-full resize-none rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm text-slate-400 hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:from-rose-600 hover:to-rose-700 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wrench className="h-4 w-4" />}
                    Crear Ticket
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right: Tickets list */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Tickets {currentAsset ? `— ${currentAsset.code}` : "— Todos"}
          </h2>

          {assetTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-8 text-center">
              <FileText className="mb-3 h-10 w-10 text-slate-700" />
              <p className="text-sm text-slate-500">No hay tickets registrados</p>
              {currentAsset?.status === "ASIGNADO" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-3 text-sm font-medium text-rose-400 hover:text-rose-300"
                >
                  Crear primer ticket →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {assetTickets.map((ticket) => {
                const priConf = priorityConfig[ticket.priority || "MEDIA"]
                const catConf = categoryConfig[ticket.category || "OTRO"]
                const isResolving = resolvingId === ticket.id

                return (
                  <div key={ticket.id} className="rounded-xl border border-slate-800 bg-[#1A1D27] p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          ticket.status === "CERRADO" ? "bg-emerald-500/10" : "bg-rose-500/10"
                        }`}>
                          {ticket.status === "CERRADO" ? (
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-rose-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">Ticket #{ticket.id.split("-")[1]?.slice(0, 6)}</p>
                          <p className="text-xs text-slate-500">Activo: {ticket.assetCode}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priConf.bg} ${priConf.color}`}>
                          {priConf.label}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          ticket.status === "CERRADO"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg bg-[#0F1117] p-3">
                      <p className="text-sm text-slate-300">{ticket.description}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {ticket.yearsInUse} años de uso
                      </span>
                      <span>{catConf.label}</span>
                      <span>{new Date(ticket.createdAt).toLocaleString("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>

                    {/* Resolution */}
                    {ticket.status === "CERRADO" && ticket.resolution && (
                      <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Resolución
                        </div>
                        <p className="text-sm text-slate-300">{ticket.resolution}</p>
                      </div>
                    )}

                    {/* Resolve button */}
                    {ticket.status !== "CERRADO" && (
                      <div className="mt-3">
                        {isResolving ? (
                          <div className="space-y-3">
                            <textarea
                              rows={2}
                              value={resolution}
                              onChange={(e) => setResolution(e.target.value)}
                              placeholder="Describa cómo se resolvió el problema..."
                              className="w-full resize-none rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-500"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setResolvingId(null); setResolution("") }}
                                className="flex-1 rounded-lg border border-slate-700 py-2 text-xs text-slate-400 hover:bg-slate-800"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleResolveTicket(ticket.id)}
                                disabled={isSubmitting}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500/20 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50"
                              >
                                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                                Resolver
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setResolvingId(ticket.id)}
                            className="w-full rounded-lg border border-emerald-500/30 bg-emerald-500/5 py-2 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/10"
                          >
                            Resolver Ticket
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
