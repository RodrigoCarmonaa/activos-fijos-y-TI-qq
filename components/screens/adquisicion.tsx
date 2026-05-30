"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { 
  ShoppingCart, 
  Plus, 
  Package,
  DollarSign,
  Building,
  User,
  Tag,
  FileText,
  Loader2,
  CheckCircle
} from "lucide-react"

interface FormData {
  code: string
  name: string
  marca: string
  modelo: string
  description: string
  value: string
  provider: string
  solicitante: string
}

const initialFormData: FormData = {
  code: "",
  name: "",
  marca: "",
  modelo: "",
  description: "",
  value: "",
  provider: "",
  solicitante: "",
}

export function Adquisicion() {
  const { addAsset, assets, updateAssetStatus, currentUser } = useAppStore()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const pendingAssets = assets.filter((a) => a.status === "PENDIENTE")

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.code.trim()) {
      newErrors.code = "El codigo QR es requerido"
    } else if (assets.some((a) => a.code.toUpperCase() === formData.code.toUpperCase())) {
      newErrors.code = "Este codigo ya existe en el sistema"
    }

    if (!formData.marca.trim()) {
      newErrors.marca = "La marca es requerida"
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = "El modelo es requerido"
    }

    if (!formData.value.trim()) {
      newErrors.value = "El precio es requerido"
    } else if (parseFloat(formData.value) <= 0) {
      newErrors.value = "El precio debe ser mayor a 0"
    }

    if (!formData.provider.trim()) {
      newErrors.provider = "El proveedor es requerido"
    }

    if (!formData.solicitante.trim()) {
      newErrors.solicitante = "El solicitante es requerido"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0]
      toast.error("Error de validacion", {
        description: firstError,
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const assetName = `${formData.marca} ${formData.modelo}`
    
    addAsset({
      code: formData.code.toUpperCase(),
      name: assetName,
      marca: formData.marca,
      modelo: formData.modelo,
      description: formData.description || `${assetName} adquirido por ${currentUser?.name}`,
      value: parseFloat(formData.value),
      provider: formData.provider,
      solicitante: formData.solicitante,
      purchaseDate: new Date().toISOString().split("T")[0],
    })

    toast.success("Activo registrado", {
      description: `${assetName} (${formData.code.toUpperCase()}) ha sido registrado exitosamente.`,
    })

    setFormData(initialFormData)
    setIsSubmitting(false)
  }

  const handleConfirmPurchase = async (assetId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    updateAssetStatus(assetId, "ADQUIRIDO", "Compra confirmada. Activo listo para recepcion en bodega.")
    toast.success("Compra confirmada", {
      description: "El activo ahora puede ser recibido en bodega.",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <ShoppingCart className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground">Registro de Adquisicion</h1>
              <p className="text-sm text-muted-foreground">Modulo P1 - Encargado de Adquisiciones</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Formulario */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Nuevo Activo</h2>
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Codigo QR */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Codigo QR / Inventario *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="Ej: QR-013"
                      className={`w-full rounded-lg border px-3 py-2.5 text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${
                        errors.code ? "border-destructive bg-destructive/5" : "border-border bg-background focus:border-primary"
                      }`}
                    />
                    {errors.code && <p className="mt-1 text-xs text-destructive">{errors.code}</p>}
                  </div>

                  {/* Marca y Modelo */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        Marca *
                      </label>
                      <input
                        type="text"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        placeholder="Ej: HP"
                        className={`w-full rounded-lg border px-3 py-2.5 text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${
                          errors.marca ? "border-destructive bg-destructive/5" : "border-border bg-background focus:border-primary"
                        }`}
                      />
                      {errors.marca && <p className="mt-1 text-xs text-destructive">{errors.marca}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Modelo *
                      </label>
                      <input
                        type="text"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        placeholder="Ej: ProBook 450 G10"
                        className={`w-full rounded-lg border px-3 py-2.5 text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${
                          errors.modelo ? "border-destructive bg-destructive/5" : "border-border bg-background focus:border-primary"
                        }`}
                      />
                      {errors.modelo && <p className="mt-1 text-xs text-destructive">{errors.modelo}</p>}
                    </div>
                  </div>

                  {/* Precio */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      Precio (CLP) *
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      placeholder="Ej: 845900"
                      min="0"
                      step="1"
                      className={`w-full rounded-lg border px-3 py-2.5 text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${
                        errors.value ? "border-destructive bg-destructive/5" : "border-border bg-background focus:border-primary"
                      }`}
                    />
                    {errors.value && <p className="mt-1 text-xs text-destructive">{errors.value}</p>}
                  </div>

                  {/* Proveedor */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      Proveedor *
                    </label>
                    <input
                      type="text"
                      name="provider"
                      value={formData.provider}
                      onChange={handleChange}
                      placeholder="Ej: SOLUCIONES TCP"
                      className={`w-full rounded-lg border px-3 py-2.5 text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${
                        errors.provider ? "border-destructive bg-destructive/5" : "border-border bg-background focus:border-primary"
                      }`}
                    />
                    {errors.provider && <p className="mt-1 text-xs text-destructive">{errors.provider}</p>}
                  </div>

                  {/* Solicitante */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Solicitante *
                    </label>
                    <input
                      type="text"
                      name="solicitante"
                      value={formData.solicitante}
                      onChange={handleChange}
                      placeholder="Ej: Gerencia de Operaciones"
                      className={`w-full rounded-lg border px-3 py-2.5 text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${
                        errors.solicitante ? "border-destructive bg-destructive/5" : "border-border bg-background focus:border-primary"
                      }`}
                    />
                    {errors.solicitante && <p className="mt-1 text-xs text-destructive">{errors.solicitante}</p>}
                  </div>

                  {/* Descripcion */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Descripcion (Opcional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Descripcion adicional del activo..."
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        Registrar Activo
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Lista de Pendientes */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Pendientes de Confirmacion</h2>
            {pendingAssets.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Package className="h-6 w-6 text-slate-500" />
                </div>
                <p className="font-medium text-card-foreground">Sin activos pendientes</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Los activos registrados apareceran aqui
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAssets.map((asset) => (
                  <div key={asset.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            {asset.code}
                          </span>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            PENDIENTE
                          </span>
                        </div>
                        <p className="mt-2 font-medium text-card-foreground">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.provider}</p>
                        <p className="mt-1 text-sm font-semibold text-emerald-600">
                          ${asset.value.toLocaleString("es-CL")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConfirmPurchase(asset.id)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Confirmar Compra
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
