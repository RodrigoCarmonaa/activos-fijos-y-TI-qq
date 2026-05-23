"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { AssetCard } from "@/components/asset-card"
import { 
  Wrench, 
  Plus, 
  AlertCircle, 
  Clock, 
  FileText,
  Loader2,
  CheckCircle,
  QrCode
} from "lucide-react"

export function SoporteTecnico() {
  const { asset, supportTickets, createTicket, addNotification } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    assetId: asset.code,
    yearsInUse: 2,
    description: "",
  })

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description.trim()) {
      addNotification("Por favor, describe el problema reportado.", "warning")
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    createTicket(formData.description, formData.yearsInUse)
    addNotification(
      `Ticket creado. Activo ${asset.code} ingresado a mantencion.`,
      "success"
    )
    
    setIsSubmitting(false)
    setShowForm(false)
    setFormData({ ...formData, description: "" })
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
              <h1 className="text-xl font-semibold text-card-foreground">Soporte Tecnico y Mantencion</h1>
              <p className="text-sm text-muted-foreground">Interfaz de Soporte</p>
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

          {/* Sistema de Tickets */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Reporte de Fallas</h2>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-600"
              >
                <Plus className="h-4 w-4" />
                Nuevo Ticket
              </button>
            </div>

            {/* Lista de Tickets */}
            {supportTickets.length === 0 && !showForm ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <FileText className="h-6 w-6 text-slate-500" />
                </div>
                <p className="font-medium text-card-foreground">No hay tickets registrados</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Crea un nuevo ticket para reportar una falla
                </p>
              </div>
            ) : (
              <div className="space-y-3">
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
                            Ticket #{ticket.id.split("-")[1]}
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

            {/* Formulario de Ticket */}
            {showForm && (
              <div className="mt-4 rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold text-card-foreground">Ingresar Nuevo Ticket</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete los datos para reportar la falla
                  </p>
                </div>

                <form onSubmit={handleSubmitTicket} className="p-4">
                  <div className="space-y-4">
                    {/* ID del Activo */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        ID del Activo
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{formData.assetId}</span>
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          Autocompletado
                        </span>
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
                        Descripcion del Problema
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
                        onClick={() => setShowForm(false)}
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
                            <Wrench className="h-4 w-4" />
                            Ingresar a Soporte Tecnico
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Estado Actual */}
            {supportTickets.length > 0 && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-emerald-800">Activo en Mantencion</p>
                    <p className="text-sm text-emerald-700">
                      El equipo {asset.code} ha sido ingresado al sistema de soporte
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
