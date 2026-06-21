"use client"

import { useAppStore } from "@/lib/store"
import {
  Package,
  ShoppingCart,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Clock,
  Plus,
  ChevronRight,
  Activity,
} from "lucide-react"

const statusLabels: Record<string, string> = {
  PENDIENTE_ADQUISICION: "Pendiente",
  ADQUIRIDO: "Adquirido",
  RECHAZADO: "Rechazado",
  EN_BODEGA: "En Bodega",
  EN_CONFIGURACION: "En Configuración",
  LISTO_PARA_ASIGNACION: "Listo p/ Asignar",
  ASIGNADO: "Asignado",
  EN_MANTENCION: "En Mantención",
  DADO_DE_BAJA: "Dado de Baja",
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  ADQUIRIDO: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  EN_BODEGA: { bg: "bg-indigo-500/10", text: "text-indigo-400", dot: "bg-indigo-400" },
  EN_CONFIGURACION: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  LISTO_PARA_ASIGNACION: { bg: "bg-teal-500/10", text: "text-teal-400", dot: "bg-teal-400" },
  ASIGNADO: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  EN_MANTENCION: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  DADO_DE_BAJA: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  RECHAZADO: { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400" },
}

export function Dashboard() {
  const { assets, auditLog, supportTickets, custodyActs, setCurrentScreen, selectAsset, currentUser } = useAppStore()

  const totalAssets = assets.length
  const activeAssets = assets.filter((a) => a.status === "ASIGNADO").length
  const inMaintenance = assets.filter((a) => a.status === "EN_MANTENCION").length
  const retired = assets.filter((a) => a.status === "DADO_DE_BAJA").length
  const openTickets = supportTickets.filter((t) => t.status !== "CERRADO").length
  const pendingActs = custodyActs.filter((a) => a.status === "PENDIENTE").length

  const recentLogs = auditLog.slice(0, 8)

  const handleAssetClick = (assetId: string) => {
    selectAsset(assetId)
    setCurrentScreen(1)
  }

  const statCards = [
    { label: "Total Activos", value: totalAssets, icon: Package, color: "from-blue-500 to-blue-600", shadowColor: "shadow-blue-500/20" },
    { label: "Asignados", value: activeAssets, icon: CheckCircle, color: "from-emerald-500 to-emerald-600", shadowColor: "shadow-emerald-500/20" },
    { label: "En Mantención", value: inMaintenance, icon: Wrench, color: "from-amber-500 to-amber-600", shadowColor: "shadow-amber-500/20" },
    { label: "Dados de Baja", value: retired, icon: Trash2, color: "from-red-500 to-red-600", shadowColor: "shadow-red-500/20" },
  ]

  const actionIcons: Record<string, typeof Activity> = {
    LOGIN: Activity,
    LOGOUT: Activity,
    CREAR_ACTIVO: ShoppingCart,
    CAMBIO_ESTADO: Package,
    RECIBIR_ACTIVO: Package,
    CONFIGURAR_ACTIVO: Activity,
    CREAR_ACTA: Activity,
    FIRMAR_ACTA: CheckCircle,
    RECHAZAR_ACTA: AlertTriangle,
    CREAR_TICKET: Wrench,
    RESOLVER_TICKET: CheckCircle,
    BAJA_ACTIVO: Trash2,
    REPARAR_ACTIVO: Wrench,
    RECHAZAR_ACTIVO: AlertTriangle,
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Bienvenido, {currentUser?.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Resumen general del sistema de gestión de activos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`rounded-xl border border-slate-800 bg-[#1A1D27] p-5 shadow-lg ${card.shadowColor}`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">{card.value}</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions + Alerts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <button
          onClick={() => setCurrentScreen(1)}
          className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#1A1D27] p-5 text-left transition-all hover:border-emerald-500/50 hover:bg-[#1A1D27]/80"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
            <Plus className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Nuevo Activo</p>
            <p className="text-sm text-slate-400">Registrar adquisición</p>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 text-slate-600" />
        </button>

        {openTickets > 0 && (
          <button
            onClick={() => setCurrentScreen(5)}
            className="flex items-center gap-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-left transition-all hover:border-amber-500/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-white">{openTickets} Tickets Abiertos</p>
              <p className="text-sm text-amber-400/80">Requieren atención</p>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 text-slate-600" />
          </button>
        )}

        {pendingActs > 0 && (
          <button
            onClick={() => setCurrentScreen(3)}
            className="flex items-center gap-4 rounded-xl border border-blue-500/30 bg-blue-500/5 p-5 text-left transition-all hover:border-blue-500/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-white">{pendingActs} Actas Pendientes</p>
              <p className="text-sm text-blue-400/80">Esperando firma</p>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 text-slate-600" />
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Assets */}
        <div className="rounded-xl border border-slate-800 bg-[#1A1D27] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Activos Registrados</h2>
            <span className="text-xs text-slate-500">{assets.length} total</span>
          </div>

          {assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="mb-3 h-10 w-10 text-slate-700" />
              <p className="text-sm text-slate-500">No hay activos registrados</p>
              <button
                onClick={() => setCurrentScreen(1)}
                className="mt-3 text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                Registrar primer activo →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {assets.slice(0, 6).map((asset) => {
                const sc = statusColors[asset.status] || { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400" }
                return (
                  <button
                    key={asset.id}
                    onClick={() => handleAssetClick(asset.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-[#0F1117] p-3 text-left transition-all hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                        <Package className="h-4 w-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{asset.name}</p>
                        <p className="text-xs text-slate-500">{asset.code} · ${asset.value.toLocaleString("es-CL")}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${sc.bg} ${sc.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                      {statusLabels[asset.status] || asset.status}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Activity Log */}
        <div className="rounded-xl border border-slate-800 bg-[#1A1D27] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Actividad Reciente</h2>
            <span className="text-xs text-slate-500">{auditLog.length} registros</span>
          </div>

          {recentLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="mb-3 h-10 w-10 text-slate-700" />
              <p className="text-sm text-slate-500">Sin actividad registrada</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentLogs.map((log) => {
                const Icon = actionIcons[log.action] || Activity
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-slate-800/50"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-800">
                      <Icon className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-slate-300">{log.details}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-600">
                        <span>{log.userName}</span>
                        <span>·</span>
                        <span>{new Date(log.timestamp).toLocaleString("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
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
