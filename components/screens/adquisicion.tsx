"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { ShoppingCart, CheckCircle, XCircle, AlertTriangle, Loader2, Package, ArrowRight } from "lucide-react"

const categories = [
  "Notebook",
  "Desktop",
  "Monitor",
  "Impresora",
  "Servidor",
  "Red / Switch",
  "Periférico",
  "Otro",
]

interface FormErrors {
  name?: string
  brand?: string
  model?: string
  value?: string
  provider?: string
  custodian?: string
  category?: string
  description?: string
}

export function Adquisicion() {
  const { assets, currentAssetId, createAsset, rejectAsset, selectAsset, setCurrentScreen, addNotification } = useAppStore()
  const currentAsset = assets.find((a) => a.id === currentAssetId) || null

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    value: "",
    provider: "",
    custodian: "",
    category: "",
    description: "",
    serialNumber: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.brand.trim()) {
      newErrors.brand = "La marca es obligatoria"
    }
    if (!formData.model.trim()) {
      newErrors.model = "El modelo es obligatorio"
    }
    const numValue = parseInt(formData.value.replace(/\D/g, ""))
    if (!formData.value || isNaN(numValue) || numValue <= 0) {
      newErrors.value = "Ingrese un valor válido mayor a $0"
    }
    if (!formData.provider.trim()) {
      newErrors.provider = "El proveedor es obligatorio"
    }
    if (!formData.custodian.trim()) {
      newErrors.custodian = "El solicitante es obligatorio"
    }
    if (!formData.category) {
      newErrors.category = "Seleccione una categoría"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      addNotification("Corrige los errores del formulario antes de continuar.", "error")
      return
    }

    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 800))

    const numValue = parseInt(formData.value.replace(/\D/g, ""))
    const asset = createAsset({
      name: `${formData.brand} ${formData.model}`,
      brand: formData.brand,
      model: formData.model,
      description: formData.description || `${formData.category} - ${formData.brand} ${formData.model}`,
      value: numValue,
      provider: formData.provider,
      custodian: formData.custodian,
      category: formData.category,
      serialNumber: formData.serialNumber,
      purchaseDate: new Date().toISOString().split("T")[0],
    })

    addNotification(`Activo ${asset.code} registrado exitosamente.`, "success")
    setIsProcessing(false)
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      addNotification("Debe indicar el motivo del rechazo.", "error")
      return
    }
    if (!currentAsset) return

    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 800))
    rejectAsset(currentAsset.id, rejectionReason)
    addNotification("Adquisición rechazada. Motivo registrado.", "error")
    setIsProcessing(false)
    setShowRejectForm(false)
  }

  const handleNewAcquisition = () => {
    setFormData({ name: "", brand: "", model: "", value: "", provider: "", custodian: "", category: "", description: "", serialNumber: "" })
    setErrors({})
    setShowRejectForm(false)
    setRejectionReason("")
    // Deselect to show form
    useAppStore.setState({ currentAssetId: null })
  }

  const handleValueChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "")
    if (digits) {
      setFormData({ ...formData, value: parseInt(digits).toLocaleString("es-CL") })
    } else {
      setFormData({ ...formData, value: "" })
    }
  }

  // Show existing asset detail if one is selected and it's acquired
  const showAssetResult = currentAsset && (currentAsset.status === "ADQUIRIDO" || currentAsset.status === "RECHAZADO")

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <ShoppingCart className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Adquisición de Activos</h1>
            <p className="text-sm text-slate-400">Registre la compra de nuevos equipos</p>
          </div>
        </div>
        {showAssetResult && (
          <button
            onClick={handleNewAcquisition}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#1A1D27] px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:text-white"
          >
            <ShoppingCart className="h-4 w-4" />
            Nueva Adquisición
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulario o resultado */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            {showAssetResult ? "Detalle del Activo" : "Registro de Compra"}
          </h2>

          {showAssetResult ? (
            // Show result
            <div className={`rounded-xl border p-6 ${
              currentAsset.status === "ADQUIRIDO"
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-red-500/30 bg-red-500/5"
            }`}>
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  currentAsset.status === "ADQUIRIDO" ? "bg-emerald-500/20" : "bg-red-500/20"
                }`}>
                  {currentAsset.status === "ADQUIRIDO" ? (
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white">
                    {currentAsset.status === "ADQUIRIDO" ? "Activo Adquirido" : "Adquisición Rechazada"}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {currentAsset.status === "ADQUIRIDO"
                      ? "El activo ha sido ingresado al sistema."
                      : currentAsset.rejectionReason}
                  </p>
                </div>
              </div>

              <div className="space-y-2 rounded-lg bg-[#0F1117]/50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Código:</span>
                  <span className="font-mono font-medium text-emerald-400">{currentAsset.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Equipo:</span>
                  <span className="font-medium text-white">{currentAsset.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valor:</span>
                  <span className="font-mono font-medium text-white">${currentAsset.value.toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Proveedor:</span>
                  <span className="font-medium text-white">{currentAsset.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fecha:</span>
                  <span className="font-medium text-white">{currentAsset.purchaseDate}</span>
                </div>
              </div>

              {currentAsset.status === "ADQUIRIDO" && (
                <button
                  onClick={() => setCurrentScreen(1.5)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700"
                >
                  Continuar a Recepción
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            // Show form
            <div className="rounded-xl border border-slate-800 bg-[#1A1D27] p-6">
              <p className="mb-5 text-sm text-slate-400">
                Complete los datos de la compra para integrar el activo al sistema ASCONT.
              </p>
              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label htmlFor="acq-category" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Categoría <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="acq-category"
                    value={formData.category}
                    onChange={(e) => { setFormData({ ...formData, category: e.target.value }); setErrors({ ...errors, category: undefined }) }}
                    className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Seleccione categoría...</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category}</p>}
                </div>

                {/* Brand + Model */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="acq-brand" className="mb-1.5 block text-sm font-medium text-slate-300">
                      Marca <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="acq-brand"
                      type="text"
                      value={formData.brand}
                      onChange={(e) => { setFormData({ ...formData, brand: e.target.value }); setErrors({ ...errors, brand: undefined }) }}
                      placeholder="Ej: HP, Dell, Lenovo"
                      className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    {errors.brand && <p className="mt-1 text-xs text-red-400">{errors.brand}</p>}
                  </div>
                  <div>
                    <label htmlFor="acq-model" className="mb-1.5 block text-sm font-medium text-slate-300">
                      Modelo <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="acq-model"
                      type="text"
                      value={formData.model}
                      onChange={(e) => { setFormData({ ...formData, model: e.target.value }); setErrors({ ...errors, model: undefined }) }}
                      placeholder="Ej: ProBook 450 G10"
                      className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    {errors.model && <p className="mt-1 text-xs text-red-400">{errors.model}</p>}
                  </div>
                </div>

                {/* Value + Serial */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="acq-value" className="mb-1.5 block text-sm font-medium text-slate-300">
                      Precio (CLP) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
                      <input
                        id="acq-value"
                        type="text"
                        value={formData.value}
                        onChange={(e) => { handleValueChange(e.target.value); setErrors({ ...errors, value: undefined }) }}
                        placeholder="0"
                        className="w-full rounded-lg border border-slate-700 bg-[#0F1117] py-2.5 pl-7 pr-4 text-sm font-mono text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    {errors.value && <p className="mt-1 text-xs text-red-400">{errors.value}</p>}
                  </div>
                  <div>
                    <label htmlFor="acq-serial" className="mb-1.5 block text-sm font-medium text-slate-300">
                      N° Serie
                    </label>
                    <input
                      id="acq-serial"
                      type="text"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      placeholder="Opcional"
                      className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Provider */}
                <div>
                  <label htmlFor="acq-provider" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Proveedor <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="acq-provider"
                    type="text"
                    value={formData.provider}
                    onChange={(e) => { setFormData({ ...formData, provider: e.target.value }); setErrors({ ...errors, provider: undefined }) }}
                    placeholder="Nombre del proveedor"
                    className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  {errors.provider && <p className="mt-1 text-xs text-red-400">{errors.provider}</p>}
                </div>

                {/* Solicitante */}
                <div>
                  <label htmlFor="acq-custodian" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Solicitante <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="acq-custodian"
                    type="text"
                    value={formData.custodian}
                    onChange={(e) => { setFormData({ ...formData, custodian: e.target.value }); setErrors({ ...errors, custodian: undefined }) }}
                    placeholder="Nombre del solicitante"
                    className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  {errors.custodian && <p className="mt-1 text-xs text-red-400">{errors.custodian}</p>}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="acq-description" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Descripción
                  </label>
                  <textarea
                    id="acq-description"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción opcional del equipo..."
                    className="w-full resize-none rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Registrar Adquisición
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel derecho: Estado / Rechazo / Lista de activos recientes */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Activos Recientes
          </h2>

          {assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#1A1D27]/50 p-10 text-center">
              <Package className="mb-3 h-10 w-10 text-slate-700" />
              <p className="text-sm text-slate-500">Esperando registro de compra...</p>
              <p className="mt-1 text-xs text-slate-600">Complete el formulario para crear el primer activo</p>
            </div>
          ) : (
            <div className="space-y-2">
              {assets.slice(-5).reverse().map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => selectAsset(asset.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                    currentAssetId === asset.id
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-slate-800 bg-[#1A1D27] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{asset.name}</p>
                      <p className="text-xs text-slate-500">
                        {asset.code} · {asset.category} · ${asset.value.toLocaleString("es-CL")}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    asset.status === "ADQUIRIDO"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : asset.status === "RECHAZADO"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-slate-500/10 text-slate-400"
                  }`}>
                    {asset.status.replace(/_/g, " ")}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Reject form for current asset */}
          {currentAsset?.status === "ADQUIRIDO" && (
            <div className="rounded-xl border border-slate-800 bg-[#1A1D27] p-4">
              {!showRejectForm ? (
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
                >
                  <XCircle className="h-4 w-4" />
                  Rechazar Adquisición
                </button>
              ) : (
                <div className="space-y-3">
                  <label htmlFor="acq-reject-reason" className="block text-sm font-medium text-slate-300">
                    Motivo del Rechazo <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="acq-reject-reason"
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Indique el motivo del rechazo..."
                    className="w-full resize-none rounded-lg border border-slate-700 bg-[#0F1117] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:bg-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={isProcessing}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/30 disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      Confirmar Rechazo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}