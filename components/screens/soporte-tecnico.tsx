"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  Wrench, 
  Plus, 
  AlertCircle, 
  Clock, 
  FileText,
  Loader2,
  QrCode,
  Package,
  CheckCircle,
  DollarSign,
  AlertTriangle,
  XCircle,
  Calculator
} from "lucide-react"

// Schemas de validacion con Zod
const ticketSchema = z.object({
  yearsInUse: z.number().min(0, "Debe ser mayor o igual a 0").max(50, "Maximo 50 anios"),
  description: z.string().min(10, "La descripcion debe tener al menos 10 caracteres").max(500, "Maximo 500 caracteres"),
})

const evaluationSchema = z.object({
  repairCost: z.number().min(1, "El costo debe ser mayor a 0"),
})

type TicketFormData = z.infer<typeof ticketSchema>
type EvaluationFormData = z.infer<typeof evaluationSchema>

export function SoporteTecnico() {
  const { assets, supportTickets, createTicket, evaluateRepair, completeRepair, currentUser } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [showEvaluationForm, setShowEvaluationForm] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)

  const ticketForm = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { yearsInUse: 1, description: "" },
  })

  const evaluationForm = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: { repairCost: 0 },
  })

  const assignedAssets = assets.filter((a) => a.status === "ASIGNADO")
  const maintenanceAssets = assets.filter((a) => a.status === "EN_MANTENCION")
  const selectedAsset = assets.find((a) => a.id === selectedAssetId)
  const isTecnicoTI = currentUser?.role === "TECNICO_TI"

  const handleSubmitTicket = async (data: TicketFormData) => {
    if (!selectedAssetId) {
      toast.error("Selecciona un activo", {
        description: "Debes seleccionar un activo para reportar la falla.",
      })
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    createTicket(selectedAssetId, data.description, data.yearsInUse)
    
    toast.success("Ticket creado", {
      description: `Activo ingresado a mantencion tecnica.`,
    })
    
    setIsSubmitting(false)
    setShowForm(false)
    setSelectedAssetId(null)
    ticketForm.reset()
  }

  const handleEvaluateRepair = async (data: EvaluationFormData) => {
    if (!showEvaluationForm) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const result = evaluateRepair(showEvaluationForm, data.repairCost)

    if (result.exceeds50Percent) {
      toast.error("Costo excede regla del 50%", {
        description: "La reparacion ha sido bloqueada y el activo dado de baja automaticamente.",
        duration: 6000,
      })
    } else {
      toast.success("Reparacion aprobada", {
        description: "El costo esta dentro del limite. Proceda con la reparacion.",
      })
    }

    setIsSubmitting(false)
    setShowEvaluationForm(null)
    evaluationForm.reset()
  }

  const handleCompleteRepair = async (ticketId: string) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    completeRepair(ticketId)
    
    toast.success("Reparacion completada", {
      description: "El activo ha sido devuelto al custodio.",
    })
    
    setIsSubmitting(false)
  }

  const openTicketForm = (assetId: string) => {
    setSelectedAssetId(assetId)
    setShowForm(true)
  }

  const getTicketAsset = (ticket: typeof supportTickets[0]) => {
    return assets.find((a) => a.id === ticket.assetId)
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
              <p className="text-sm text-muted-foreground">Modulo P5 - Reporte de Fallas y Evaluacion</p>
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
                        <p className="text-xs text-muted-foreground mt-1">
                          Valor: ${asset.value.toLocaleString("es-CL")}
                        </p>
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

          {/* Tickets y Formularios */}
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
                    {supportTickets.map((ticket) => {
                      const ticketAsset = getTicketAsset(ticket)
                      const threshold = ticketAsset ? ticketAsset.value * 0.5 : 0

                      return (
                        <div
                          key={ticket.id}
                          className={`rounded-xl border p-4 ${
                            ticket.status === "DADO_DE_BAJA" 
                              ? "border-slate-300 bg-slate-50" 
                              : ticket.status === "CERRADO"
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-rose-200 bg-rose-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                ticket.status === "DADO_DE_BAJA" 
                                  ? "bg-slate-200" 
                                  : ticket.status === "CERRADO"
                                  ? "bg-emerald-100"
                                  : "bg-rose-100"
                              }`}>
                                {ticket.status === "DADO_DE_BAJA" ? (
                                  <XCircle className="h-5 w-5 text-slate-600" />
                                ) : ticket.status === "CERRADO" ? (
                                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-rose-600" />
                                )}
                              </div>
                              <div>
                                <p className={`font-medium ${
                                  ticket.status === "DADO_DE_BAJA" 
                                    ? "text-slate-700" 
                                    : ticket.status === "CERRADO"
                                    ? "text-emerald-900"
                                    : "text-rose-900"
                                }`}>
                                  Ticket #{ticket.id.split("-")[1]?.slice(-4)}
                                </p>
                                <p className={`text-sm ${
                                  ticket.status === "DADO_DE_BAJA" 
                                    ? "text-slate-600" 
                                    : ticket.status === "CERRADO"
                                    ? "text-emerald-700"
                                    : "text-rose-700"
                                }`}>
                                  Activo: {ticket.assetCode}
                                </p>
                              </div>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              ticket.status === "DADO_DE_BAJA"
                                ? "bg-slate-200 text-slate-700"
                                : ticket.status === "CERRADO"
                                ? "bg-emerald-200 text-emerald-800"
                                : ticket.status === "EN_PROCESO"
                                ? "bg-amber-200 text-amber-800"
                                : "bg-rose-200 text-rose-800"
                            }`}>
                              {ticket.status}
                            </span>
                          </div>

                          <div className={`mt-3 rounded-lg p-3 ${
                            ticket.status === "DADO_DE_BAJA" 
                              ? "bg-white/50" 
                              : ticket.status === "CERRADO"
                              ? "bg-white/50"
                              : "bg-white/50"
                          }`}>
                            <p className={`text-sm ${
                              ticket.status === "DADO_DE_BAJA" 
                                ? "text-slate-700" 
                                : ticket.status === "CERRADO"
                                ? "text-emerald-800"
                                : "text-rose-800"
                            }`}>{ticket.description}</p>
                          </div>

                          {/* Info adicional */}
                          <div className={`mt-3 flex items-center gap-4 text-xs ${
                            ticket.status === "DADO_DE_BAJA" 
                              ? "text-slate-600" 
                              : ticket.status === "CERRADO"
                              ? "text-emerald-700"
                              : "text-rose-700"
                          }`}>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {ticket.yearsInUse} anios de uso
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              {new Date(ticket.createdAt).toLocaleString("es-CL")}
                            </div>
                          </div>

                          {/* Mostrar costo si fue evaluado */}
                          {ticket.repairCost !== undefined && (
                            <div className={`mt-3 flex items-center gap-2 text-sm ${
                              ticket.status === "DADO_DE_BAJA" 
                                ? "text-slate-700" 
                                : "text-amber-700"
                            }`}>
                              <DollarSign className="h-4 w-4" />
                              <span>Costo evaluado: ${ticket.repairCost.toLocaleString("es-CL")}</span>
                              {ticketAsset && (
                                <span className="text-xs">
                                  (Limite 50%: ${threshold.toLocaleString("es-CL")})
                                </span>
                              )}
                            </div>
                          )}

                          {/* Boton Evaluar Reparacion - Solo para Tecnico TI */}
                          {isTecnicoTI && ticket.status === "ABIERTO" && (
                            <button
                              onClick={() => setShowEvaluationForm(ticket.id)}
                              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-amber-600"
                            >
                              <Calculator className="h-4 w-4" />
                              Evaluar Reparacion
                            </button>
                          )}

                          {/* Boton Completar Reparacion */}
                          {isTecnicoTI && ticket.status === "EN_PROCESO" && (
                            <button
                              onClick={() => handleCompleteRepair(ticket.id)}
                              disabled={isSubmitting}
                              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                            >
                              {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Completar Reparacion
                            </button>
                          )}

                          {/* Mensaje de baja */}
                          {ticket.status === "DADO_DE_BAJA" && (
                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-200 p-3 text-sm text-slate-700">
                              <AlertTriangle className="h-4 w-4 shrink-0" />
                              Activo dado de baja por regla del 50%
                            </div>
                          )}
                        </div>
                      )
                    })}
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

                <form onSubmit={ticketForm.handleSubmit(handleSubmitTicket)} className="p-4">
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
                      <p className="mt-1 text-xs text-muted-foreground">
                        Valor de compra: ${selectedAsset.value.toLocaleString("es-CL")} | Limite 50%: ${(selectedAsset.value * 0.5).toLocaleString("es-CL")}
                      </p>
                    </div>

                    {/* Tiempo de Uso */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Tiempo de Uso (anios) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        {...ticketForm.register("yearsInUse", { valueAsNumber: true })}
                        className={`w-full rounded-lg border px-3 py-2.5 text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${
                          ticketForm.formState.errors.yearsInUse 
                            ? "border-destructive bg-destructive/5" 
                            : "border-border bg-background focus:border-primary"
                        }`}
                      />
                      {ticketForm.formState.errors.yearsInUse && (
                        <p className="mt-1 text-xs text-destructive">
                          {ticketForm.formState.errors.yearsInUse.message}
                        </p>
                      )}
                    </div>

                    {/* Descripcion del Problema */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Descripcion del Problema *
                      </label>
                      <textarea
                        rows={4}
                        {...ticketForm.register("description")}
                        placeholder="Ej: El equipo no enciende despues de 2 anios de uso..."
                        className={`w-full resize-none rounded-lg border px-3 py-2.5 text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${
                          ticketForm.formState.errors.description 
                            ? "border-destructive bg-destructive/5" 
                            : "border-border bg-background focus:border-primary"
                        }`}
                      />
                      {ticketForm.formState.errors.description && (
                        <p className="mt-1 text-xs text-destructive">
                          {ticketForm.formState.errors.description.message}
                        </p>
                      )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false)
                          setSelectedAssetId(null)
                          ticketForm.reset()
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

            {/* Modal de Evaluacion de Reparacion */}
            {showEvaluationForm && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 shadow-sm">
                <div className="border-b border-amber-200 p-4">
                  <h3 className="font-semibold text-amber-900">Evaluar Reparacion</h3>
                  <p className="text-sm text-amber-700">
                    Ingrese el costo estimado de reparacion
                  </p>
                </div>

                <form onSubmit={evaluationForm.handleSubmit(handleEvaluateRepair)} className="p-4">
                  <div className="space-y-4">
                    {/* Info del ticket */}
                    {(() => {
                      const ticket = supportTickets.find((t) => t.id === showEvaluationForm)
                      const ticketAsset = ticket ? getTicketAsset(ticket) : null
                      if (!ticket || !ticketAsset) return null

                      return (
                        <div className="rounded-lg bg-white/50 p-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-amber-700">Activo:</span>
                            <span className="font-medium text-amber-900">{ticket.assetCode} - {ticketAsset.name}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-amber-700">Valor de compra:</span>
                            <span className="font-medium text-amber-900">${ticketAsset.value.toLocaleString("es-CL")}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-amber-700">Limite 50% (MPN):</span>
                            <span className="font-bold text-amber-900">${(ticketAsset.value * 0.5).toLocaleString("es-CL")}</span>
                          </div>
                        </div>
                      )
                    })()}

                    {/* Costo de Reparacion */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-amber-900">
                        <DollarSign className="h-4 w-4" />
                        Costo de Reparacion (CLP) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        {...evaluationForm.register("repairCost", { valueAsNumber: true })}
                        placeholder="Ingrese el costo estimado"
                        className={`w-full rounded-lg border px-3 py-2.5 text-foreground outline-none transition-colors focus:ring-2 focus:ring-amber-500/20 ${
                          evaluationForm.formState.errors.repairCost 
                            ? "border-destructive bg-destructive/5" 
                            : "border-amber-300 bg-white focus:border-amber-500"
                        }`}
                      />
                      {evaluationForm.formState.errors.repairCost && (
                        <p className="mt-1 text-xs text-destructive">
                          {evaluationForm.formState.errors.repairCost.message}
                        </p>
                      )}
                    </div>

                    {/* Advertencia */}
                    <div className="flex items-start gap-2 rounded-lg bg-amber-100 p-3 text-amber-800">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <p className="text-xs">
                        <strong>Regla del 50% (MPN):</strong> Si el costo de reparacion supera el 50% del valor de compra, el activo sera dado de baja automaticamente.
                      </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEvaluationForm(null)
                          evaluationForm.reset()
                        }}
                        className="flex-1 rounded-lg border border-amber-300 px-4 py-2.5 font-medium text-amber-800 transition-colors hover:bg-amber-100"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Evaluando...
                          </>
                        ) : (
                          <>
                            <Calculator className="h-4 w-4" />
                            Evaluar Costo
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Estado */}
            {maintenanceAssets.length > 0 && !showForm && !showEvaluationForm && (
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
