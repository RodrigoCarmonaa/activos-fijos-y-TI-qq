"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  Warehouse, 
  QrCode,
  Package,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Search
} from "lucide-react"

// Schema de validacion con Zod
const recepcionSchema = z.object({
  qrCode: z.string()
    .min(1, "El codigo QR es requerido")
    .regex(/^[A-Za-z0-9-]+$/, "Formato de codigo invalido"),
})

type RecepcionFormData = z.infer<typeof recepcionSchema>

export function Recepcion() {
  const { assets, updateAssetStatus, getAssetByCode } = useAppStore()
  const [isScanning, setIsScanning] = useState(false)
  const [scannedAsset, setScannedAsset] = useState<typeof assets[0] | null>(null)

  const form = useForm<RecepcionFormData>({
    resolver: zodResolver(recepcionSchema),
    defaultValues: { qrCode: "" },
  })

  const acquiredAssets = assets.filter((a) => a.status === "ADQUIRIDO")
  const receivedToday = assets.filter(
    (a) => a.status === "EN_BODEGA" && 
    new Date(a.updatedAt).toDateString() === new Date().toDateString()
  )

  const handleScanQR = async (data: RecepcionFormData) => {
    setIsScanning(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const asset = getAssetByCode(data.qrCode.trim())

    if (!asset) {
      toast.error("Activo no encontrado", {
        description: `No existe un activo con el codigo "${data.qrCode.toUpperCase()}" en el sistema.`,
      })
      setScannedAsset(null)
      setIsScanning(false)
      return
    }

    if (asset.status !== "ADQUIRIDO") {
      toast.error("Estado invalido", {
        description: `El activo ${asset.code} tiene estado "${asset.status}". Solo se pueden recibir activos en estado "ADQUIRIDO".`,
      })
      setScannedAsset(null)
      setIsScanning(false)
      return
    }

    setScannedAsset(asset)
    toast.success("Activo encontrado", {
      description: `${asset.name} (${asset.code}) listo para recepcion.`,
    })
    setIsScanning(false)
  }

  const handleConfirmReception = async () => {
    if (!scannedAsset) return

    await new Promise((resolve) => setTimeout(resolve, 1000))
    updateAssetStatus(scannedAsset.id, "EN_BODEGA", "Activo recibido en bodega. Listo para configuracion de TI.")
    
    toast.success("Recepcion confirmada", {
      description: `${scannedAsset.name} ha sido ingresado a bodega.`,
    })

    setScannedAsset(null)
    form.reset()
  }

  const handleSelectAsset = (code: string) => {
    form.setValue("qrCode", code)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Warehouse className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground">Recepcion en Bodega</h1>
              <p className="text-sm text-muted-foreground">Modulo P1.5 - Logistica</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Escaner QR */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Escanear Codigo QR</h2>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-dashed border-blue-200 bg-blue-50">
                  <QrCode className="h-12 w-12 text-blue-500" />
                </div>
              </div>

              <form onSubmit={form.handleSubmit(handleScanQR)} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Codigo QR / Inventario *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      {...form.register("qrCode")}
                      placeholder="Ingresa o escanea el codigo..."
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-foreground uppercase outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${
                        form.formState.errors.qrCode 
                          ? "border-destructive bg-destructive/5" 
                          : "border-border bg-background focus:border-primary"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={isScanning}
                      className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isScanning ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.qrCode && (
                    <p className="mt-1 text-xs text-destructive">{form.formState.errors.qrCode.message}</p>
                  )}
                </div>

                {/* Resultado del Escaneo */}
                {scannedAsset && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium text-emerald-800">Activo Validado</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Codigo:</span>
                        <span className="font-medium text-emerald-900">{scannedAsset.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Nombre:</span>
                        <span className="font-medium text-emerald-900">{scannedAsset.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Proveedor:</span>
                        <span className="font-medium text-emerald-900">{scannedAsset.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Valor:</span>
                        <span className="font-medium text-emerald-900">
                          ${scannedAsset.value.toLocaleString("es-CL")}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmReception}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-emerald-600"
                    >
                      <Warehouse className="h-5 w-5" />
                      Confirmar Ingreso a Bodega
                    </button>
                  </div>
                )}

                {/* Info */}
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-amber-700">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="text-xs">
                    Solo se pueden recibir activos en estado ADQUIRIDO. Verifica que el codigo coincida con la orden de compra.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Activos Pendientes */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Pendientes de Recepcion</h2>
            {acquiredAssets.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Package className="h-6 w-6 text-slate-500" />
                </div>
                <p className="font-medium text-card-foreground">Sin activos pendientes</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  No hay activos en estado ADQUIRIDO esperando recepcion
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {acquiredAssets.map((asset) => (
                  <div key={asset.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {asset.code}
                          </span>
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            ADQUIRIDO
                          </span>
                        </div>
                        <p className="mt-2 font-medium text-card-foreground">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.provider}</p>
                      </div>
                      <button
                        onClick={() => handleSelectAsset(asset.code)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        Seleccionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recibidos Hoy */}
            {receivedToday.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Recibidos Hoy</h3>
                <div className="space-y-2">
                  {receivedToday.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">
                          {asset.code} - {asset.name}
                        </span>
                      </div>
                      <span className="text-xs text-emerald-600">EN_BODEGA</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
