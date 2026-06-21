"use client"

import type { Asset } from "@/lib/types"
import { Monitor, QrCode, Building2, User, DollarSign, Calendar, Activity } from "lucide-react"

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDIENTE_ADQUISICION: { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400", label: "Pendiente" },
  ADQUIRIDO: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Adquirido" },
  RECHAZADO: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rechazado" },
  EN_BODEGA: { bg: "bg-indigo-500/10", text: "text-indigo-400", dot: "bg-indigo-400", label: "En Bodega" },
  EN_CONFIGURACION: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "En Configuración" },
  LISTO_PARA_ASIGNACION: { bg: "bg-teal-500/10", text: "text-teal-400", dot: "bg-teal-400", label: "Listo p/ Asignación" },
  ASIGNADO: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Asignado" },
  EN_MANTENCION: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400", label: "En Mantención" },
  DADO_DE_BAJA: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Dado de Baja" },
}

interface AssetCardProps {
  asset: Asset
  compact?: boolean
}

export function AssetCard({ asset, compact = false }: AssetCardProps) {
  const statusStyle = statusConfig[asset.status] || statusConfig.PENDIENTE_ADQUISICION

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#1A1D27] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
            <Monitor className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <p className="font-medium text-white">{asset.name || "Sin asignar"}</p>
            <p className="text-sm text-slate-500">{asset.code || "---"}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
          {statusStyle.label}
        </span>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-[#1A1D27] shadow-lg">
      <div className="border-b border-slate-800 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800">
              <Monitor className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{asset.name || "Sin asignar"}</h3>
              <p className="text-sm text-slate-500">{asset.description || "Activo pendiente de registro"}</p>
            </div>
          </div>
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
            {statusStyle.label}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="flex items-center gap-2">
          <QrCode className="h-4 w-4 text-slate-600" />
          <div>
            <p className="text-xs text-slate-500">Código</p>
            <p className="font-mono font-medium text-emerald-400">{asset.code || "---"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-slate-600" />
          <div>
            <p className="text-xs text-slate-500">Valor</p>
            <p className="font-mono font-medium text-white">{asset.value ? formatCurrency(asset.value) : "---"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-slate-600" />
          <div>
            <p className="text-xs text-slate-500">Proveedor</p>
            <p className="font-medium text-white">{asset.provider || "---"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-600" />
          <div>
            <p className="text-xs text-slate-500">Custodio</p>
            <p className="font-medium text-white">{asset.custodian || "---"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-600" />
          <div>
            <p className="text-xs text-slate-500">Fecha Compra</p>
            <p className="font-medium text-white">{asset.purchaseDate || "---"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-600" />
          <div>
            <p className="text-xs text-slate-500">Tiempo en Uso</p>
            <p className="font-medium text-white">{asset.yearsInUse} años</p>
          </div>
        </div>
      </div>
    </div>
  )
}