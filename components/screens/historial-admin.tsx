"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import {
  ClipboardList,
  Trash2,
  Wrench,
  AlertOctagon,
  Clock,
  Package,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  DollarSign
} from "lucide-react"

export function HistorialAdmin() {
  const { assets, supportTickets } = useAppStore()
  const [activeTab, setActiveTab] = useState<"bajas" | "tickets">("bajas")

  const retiredAssets = assets.filter((a) => a.status === "DADO_DE_BAJA")
  const allTickets = [...supportTickets].reverse() // Show newest first

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
          <ClipboardList className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Reportes e Historial (Admin)</h1>
          <p className="text-sm text-slate-400">Vista global de bajas y tickets de soporte</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab("bajas")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-all ${
            activeTab === "bajas"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Trash2 className="h-4 w-4" />
          Activos de Baja ({retiredAssets.length})
        </button>
        <button
          onClick={() => setActiveTab("tickets")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-all ${
            activeTab === "tickets"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Wrench className="h-4 w-4" />
          Historial de Tickets ({allTickets.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {/* ─── PESTAÑA BAJAS ─────────────────────────────────────────── */}
        {activeTab === "bajas" && (
          <div className="space-y-4">
            {retiredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-12 text-center">
                <Package className="mb-3 h-12 w-12 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-400">Sin activos dados de baja</h2>
                <p className="mt-1 text-sm text-slate-500">No hay registros de equipos desincorporados en el sistema.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {retiredAssets.map((asset) => (
                  <div key={asset.id} className="rounded-xl border border-red-500/20 bg-[#1A1D27] p-5 shadow-lg">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      {/* Info básica */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                          <Trash2 className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-white">{asset.name}</h3>
                            <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
                              Dado de Baja
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-400">
                            Código: <span className="font-mono text-white">{asset.code}</span> · 
                            Categoría: <span className="text-white">{asset.category}</span>
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              {asset.yearsInUse} años de uso
                            </span>
                            <span className="flex items-center gap-1.5">
                              <DollarSign className="h-3.5 w-3.5" />
                              Valor Original: ${asset.value?.toLocaleString("es-CL")}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Wrench className="h-3.5 w-3.5" />
                              Costo Rep.: ${asset.repairCost?.toLocaleString("es-CL") || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Motivo de baja (destacado) */}
                      <div className="flex-1 md:max-w-md">
                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <AlertOctagon className="h-4 w-4 text-red-400" />
                            <h4 className="text-sm font-semibold text-red-400">Motivo de la Baja</h4>
                          </div>
                          <p className="text-sm leading-relaxed text-slate-300">
                            {asset.retirementReason || "Motivo no especificado en el registro."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── PESTAÑA TICKETS ───────────────────────────────────────── */}
        {activeTab === "tickets" && (
          <div className="space-y-4">
            {allTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-12 text-center">
                <Wrench className="mb-3 h-12 w-12 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-400">Sin tickets de soporte</h2>
                <p className="mt-1 text-sm text-slate-500">No hay historial de fallas reportadas.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {allTickets.map((ticket) => {
                  const isClosed = ticket.status === "CERRADO"
                  return (
                    <div
                      key={ticket.id}
                      className={`flex flex-col justify-between rounded-xl border p-5 shadow-lg ${
                        isClosed ? "border-emerald-500/20 bg-[#1A1D27]" : "border-rose-500/30 bg-rose-500/5"
                      }`}
                    >
                      <div>
                        {/* Cabecera del ticket */}
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              isClosed ? "bg-emerald-500/10" : "bg-rose-500/10"
                            }`}>
                              {isClosed ? (
                                <CheckCircle className={`h-5 w-5 text-emerald-400`} />
                              ) : (
                                <AlertCircle className={`h-5 w-5 text-rose-400`} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                Ticket #{ticket.id.split("-")[1]?.slice(0, 6)}
                              </p>
                              <p className="text-xs text-slate-400">
                                Fecha: {new Date(ticket.createdAt).toLocaleDateString("es-CL")}
                              </p>
                            </div>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isClosed ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                          }`}>
                            {ticket.status}
                          </span>
                        </div>

                        {/* Metadatos (Activo, Prioridad, Categoría) */}
                        <div className="mb-4 flex flex-wrap gap-2 text-xs">
                          <span className="rounded bg-[#0F1117] px-2 py-1 font-mono text-slate-300 border border-slate-800">
                            Activo: {ticket.assetCode}
                          </span>
                          <span className="rounded bg-[#0F1117] px-2 py-1 text-slate-300 border border-slate-800">
                            {ticket.category}
                          </span>
                          <span className={`rounded px-2 py-1 border ${
                            ticket.priority === "ALTA" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                            ticket.priority === "MEDIA" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}>
                            Prioridad {ticket.priority}
                          </span>
                        </div>

                        {/* Descripción del problema */}
                        <div className="mb-4">
                          <p className="mb-1 text-xs font-medium text-slate-500">Problema Reportado:</p>
                          <div className="rounded-lg bg-[#0F1117] p-3 text-sm text-slate-300 border border-slate-800">
                            {ticket.description}
                          </div>
                        </div>
                      </div>

                      {/* Resolución (si aplica) */}
                      {isClosed && ticket.resolution && (
                        <div className="mt-auto">
                          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                              <MessageSquare className="h-3.5 w-3.5" />
                              Resolución del Técnico
                            </div>
                            <p className="text-sm text-slate-300">{ticket.resolution}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
