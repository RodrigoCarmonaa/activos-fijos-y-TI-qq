"use client"

import type { Asset } from "@/lib/types"
import { Monitor, QrCode, Building2, User, DollarSign, Calendar, Activity } from "lucide-react"

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  EN_BODEGA: { bg: "bg-slate-100", text: "text-slate-700", label: "En Bodega" },
  EN_CONFIGURACION: { bg: "bg-amber-100", text: "text-amber-700", label: "En Configuracion" },
  LISTO_PARA_ASIGNACION: { bg: "bg-blue-100", text: "text-blue-700", label: "Listo para Asignacion" },
  ASIGNADO: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Asignado" },
  EN_MANTENCION: { bg: "bg-rose-100", text: "text-rose-700", label: "En Mantencion" },
}

interface AssetCardProps {
  asset: Asset
  compact?: boolean
}

export function AssetCard({ asset, compact = false }: AssetCardProps) {
  const statusStyle = statusColors[asset.status] || statusColors.EN_BODEGA

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Monitor className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-card-foreground">{asset.name}</p>
            <p className="text-sm text-muted-foreground">{asset.code}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
          {statusStyle.label}
        </span>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Monitor className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{asset.name}</h3>
              <p className="text-sm text-muted-foreground">{asset.description}</p>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.label}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="flex items-center gap-2">
          <QrCode className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Codigo</p>
            <p className="font-medium text-card-foreground">{asset.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Valor</p>
            <p className="font-medium text-card-foreground">{formatCurrency(asset.value)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Proveedor</p>
            <p className="font-medium text-card-foreground">{asset.provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Custodio</p>
            <p className="font-medium text-card-foreground">{asset.custodian}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Fecha Compra</p>
            <p className="font-medium text-card-foreground">{asset.purchaseDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Tiempo en Uso</p>
            <p className="font-medium text-card-foreground">{asset.yearsInUse} anios</p>
          </div>
        </div>
      </div>
    </div>
  )
}
