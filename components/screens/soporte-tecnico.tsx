"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { 
  Wrench, 
  Plus, 
  AlertCircle, 
  Clock, 
  FileText,
  Loader2,
  QrCode,
  Package,
  CheckCircle
} from "lucide-react"

export function SoporteTecnico() {
  const { assets, supportTickets, createTicket } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    yearsInUse: 1,
    description: "",
  })

  const assignedAssets = assets.filter((a) => a.status === "ASIGNADO")
  const maintenanceAssets = assets.filter((a) => a.status === "EN_MANTENCION")
  const selectedAsset = assets.find((a) => a.id === selectedAssetId)

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedAssetId) {
      toast.error("Selecciona un activo", {
        description: "Debes seleccionar un activo para reportar la falla.",
      })
      return
    }

    if (!formData.description.trim()) {
      toast.error("Descripcion requerida", {
        description: "Por favor, describe el problema reportado.",
      })
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    createTicket(selectedAssetId, formData.description, formData.yearsInUse)
    
    toast.success("Ticket creado", {
      description: `Activo ingresado a mantencion tecnica.`,
    })
    
    setIsSubmitting(false)
    setShowForm(false)
    setSelectedAssetId(null)
    setFormData({ yearsInUse: 1, description: "" })
  }

  const openTicketForm = (assetId: string) => {
    setSelectedAssetId(assetId)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100">
              <Wrench className="h-5 w-5 text-rose-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground">Soporte Tecnico</h1>
              <p className="text-sm text-muted-foreground">Modulo P5 - Reporte de Fallas</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Activos Asignados */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Activos Asignados</h2>
            </div>

            {assignedAssets.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Package className="h-6 w-6 text-slate-500" />
                </div>
                <p className="font-medium text-card-foreground">Sin activos asignados</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  No hay activos disponibles para reportar fallas
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignedAssets.map((asset) => (
                  <div key={asset.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            {asset.code}
                          </span>
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            ASIGNADO
                          </span>
                        </div>
                        <p className="mt-2 font-medium text-card-foreground">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">Custodio: {asset.custodian}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => openTicketForm(asset.id)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-rose-600"
                    >
                      <AlertCircle className="h-4 w-4" />
                      Reportar Falla
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Activos en Mantencion */}
            {maintenanceAssets.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">En Mantencion</h3>
                <div className="space-y-2">
                  {maintenanceAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-rose-600" />
                        <span className="text-sm font-medium text-rose-800">
                          {asset.code} - {asset.name}
                        </span>
                      </div>
                      <span className="rounded-full bg-rose-200 px-2 py-0.5 text-xs font-medium text-rose-800">
                        EN_MANTENCION
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tickets y Formulario */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Tickets de Soporte</h2>

            {/* Lista de Tickets */}
            {supportTickets.length === 0 && !showForm ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <FileText className="h-6 w-6 text-slate-500" />
                </div>
                <p className="font-medium text-card-foreground">Sin tickets registrados</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Selecciona un activo para reportar una falla
                </p>
              </div>
            ) : (
              <>
                {supportTickets.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {supportTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-xl border border-rose-200 bg-rose-50 p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100">
                              <AlertCircle className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                              <p className="font-medium text-rose-900">
                                Ticket #{ticket.id.split("-")[1]?.slice(-4)}
                              </p>
                              <p className="text-sm text-rose-700">
                                Activo: {ticket.assetCode}
                              </p>
                            </div>
                          </div>
                          <span className="rounded-full bg-rose-200 px-2.5 py-1 text-xs font-medium text-rose-800">
                            {ticket.status}
                          </span>
                        </div>

                        <div className="mt-3 rounded-lg bg-white/50 p-3">
                          <p className="text-sm text-rose-800">{ticket.description}</p>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-xs text-rose-700">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {ticket.yearsInUse} anios de uso
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            {new Date(ticket.createdAt).toLocaleString("es-CL")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Formulario de Ticket */}
            {showForm && selectedAsset && (
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold text-card-foreground">Nuevo Ticket de Soporte</h3>
                  <p className="text-sm text-muted-foreground">
                    Reportando falla para {selectedAsset.name}
                  </p>
                </div>

                <form onSubmit={handleSubmitTicket} className="p-4">
                  <div className="space-y-4">
                    {/* ID del Activo */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Activo Seleccionado
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{selectedAsset.code}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-foreground">{selectedAsset.name}</span>
                      </div>
                    </div>

                    {/* Tiempo de Uso */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Tiempo de Uso (anios)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={formData.yearsInUse}
                        onChange={(e) =>
                          setFormData({ ...formData, yearsInUse: parseInt(e.target.value) || 0 })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Descripcion del Problema */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Descripcion del Problema *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Ej: El equipo no enciende despues de 2 anios de uso..."
                        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false)
                          setSelectedAssetId(null)
                        }}
                        className="flex-1 rounded-lg border border-border px-4 py-2.5 font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            Crear Ticket
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Estado */}
            {maintenanceAssets.length > 0 && !showForm && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-800">Activos en Soporte</p>
                    <p className="text-sm text-amber-700">
                      {maintenanceAssets.length} activo(s) actualmente en mantencion
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
