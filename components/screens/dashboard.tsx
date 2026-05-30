"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { ROLE_NAMES, type AssetStatus } from "@/lib/types"
import { 
  LayoutDashboard, 
  Package,
  Clock,
  Eye,
  X,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Wrench
} from "lucide-react"

const STATUS_CONFIG: Record<AssetStatus, { label: string; color: string; bgColor: string }> = {
  PENDIENTE: { label: "Pendiente", color: "text-slate-700", bgColor: "bg-slate-100" },
  ADQUIRIDO: { label: "Adquirido", color: "text-blue-700", bgColor: "bg-blue-100" },
  EN_BODEGA: { label: "En Bodega", color: "text-cyan-700", bgColor: "bg-cyan-100" },
  EN_CONFIGURACION: { label: "En Configuracion", color: "text-amber-700", bgColor: "bg-amber-100" },
  LISTO_PARA_ASIGNACION: { label: "Listo para Asignar", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  ASIGNADO: { label: "Asignado", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  EN_MANTENCION: { label: "En Mantencion", color: "text-rose-700", bgColor: "bg-rose-100" },
  DADO_DE_BAJA: { label: "Dado de Baja", color: "text-gray-700", bgColor: "bg-gray-100" },
}

export function Dashboard() {
  const { assets, events, getAssetEvents } = useAppStore()
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<AssetStatus | "ALL">("ALL")

  const selectedAsset = assets.find((a) => a.id === selectedAssetId)
  const assetEvents = selectedAssetId ? getAssetEvents(selectedAssetId) : []

  const filteredAssets = filterStatus === "ALL" 
    ? assets 
    : assets.filter((a) => a.status === filterStatus)

  // Estadisticas
  const stats = {
    total: assets.length,
    asignados: assets.filter((a) => a.status === "ASIGNADO").length,
    mantencion: assets.filter((a) => a.status === "EN_MANTENCION").length,
    pendientes: assets.filter((a) => !["ASIGNADO", "DADO_DE_BAJA"].includes(a.status)).length,
  }

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground">Dashboard - Inventario General</h1>
              <p className="text-sm text-muted-foreground">Vision general de activos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Activos</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Asignados</p>
                <p className="mt-1 text-3xl font-bold text-emerald-600">{stats.asignados}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Mantencion</p>
                <p className="mt-1 text-3xl font-bold text-rose-600">{stats.mantencion}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                <Wrench className="h-6 w-6 text-rose-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  ${totalValue.toLocaleString("es-CL")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Filtrar:</span>
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filterStatus === "ALL"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Todos
          </button>
          {(Object.keys(STATUS_CONFIG) as AssetStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filterStatus === status
                  ? `${STATUS_CONFIG[status].bgColor} ${STATUS_CONFIG[status].color}`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {STATUS_CONFIG[status].label}
            </button>
          ))}
        </div>

        {/* Assets Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {filteredAssets.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Package className="h-6 w-6 text-slate-500" />
              </div>
              <p className="font-medium text-card-foreground">Sin activos registrados</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Los activos creados apareceran aqui
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Codigo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Custodio</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="rounded bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                          {asset.code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">{asset.provider}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CONFIG[asset.status].bgColor} ${STATUS_CONFIG[asset.status].color}`}>
                          {STATUS_CONFIG[asset.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {asset.custodian || <span className="text-muted-foreground">-</span>}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        ${asset.value.toLocaleString("es-CL")}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedAssetId(asset.id)}
                          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Hoja de Vida
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Hoja de Vida */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-card shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="border-b border-border p-6 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Hoja de Vida</h3>
                    <p className="text-sm text-muted-foreground">{selectedAsset.code} - {selectedAsset.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAssetId(null)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Info del Activo */}
            <div className="border-b border-border p-6 shrink-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Marca/Modelo:</span>
                  <p className="font-medium text-foreground">{selectedAsset.marca} {selectedAsset.modelo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Estado Actual:</span>
                  <p className={`font-medium ${STATUS_CONFIG[selectedAsset.status].color}`}>
                    {STATUS_CONFIG[selectedAsset.status].label}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Proveedor:</span>
                  <p className="font-medium text-foreground">{selectedAsset.provider}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor:</span>
                  <p className="font-medium text-foreground">${selectedAsset.value.toLocaleString("es-CL")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Custodio:</span>
                  <p className="font-medium text-foreground">{selectedAsset.custodian || "Sin asignar"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Solicitante:</span>
                  <p className="font-medium text-foreground">{selectedAsset.solicitante}</p>
                </div>
              </div>
            </div>

            {/* Timeline de Eventos */}
            <div className="p-6 overflow-y-auto flex-1">
              <h4 className="mb-4 font-semibold text-foreground">Historial de Cambios</h4>
              {assetEvents.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Sin eventos registrados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assetEvents.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <ChevronRight className="h-4 w-4 text-primary" />
                        </div>
                        {index < assetEvents.length - 1 && (
                          <div className="h-full w-0.5 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {event.fromStatus && (
                            <>
                              <span className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_CONFIG[event.fromStatus].bgColor} ${STATUS_CONFIG[event.fromStatus].color}`}>
                                {STATUS_CONFIG[event.fromStatus].label}
                              </span>
                              <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            </>
                          )}
                          <span className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_CONFIG[event.toStatus].bgColor} ${STATUS_CONFIG[event.toStatus].color}`}>
                            {STATUS_CONFIG[event.toStatus].label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-foreground">{event.description}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{event.userName}</span>
                          <span>-</span>
                          <span>{ROLE_NAMES[event.userRole]}</span>
                          <span>-</span>
                          <span>{new Date(event.timestamp).toLocaleString("es-CL")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
