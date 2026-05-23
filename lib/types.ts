// Estados posibles del activo en el flujo
export type AssetStatus =
  | "EN_BODEGA"
  | "EN_CONFIGURACION"
  | "LISTO_PARA_ASIGNACION"
  | "ASIGNADO"
  | "EN_MANTENCION"

// Información del activo
export interface Asset {
  id: string
  code: string
  name: string
  description: string
  value: number
  provider: string
  custodian: string
  status: AssetStatus
  purchaseDate: string
  yearsInUse: number
}

// Software corporativo
export interface SoftwareItem {
  id: string
  name: string
  description: string
  installed: boolean
}

// Ticket de soporte
export interface SupportTicket {
  id: string
  assetId: string
  assetCode: string
  description: string
  yearsInUse: number
  createdAt: string
  status: "ABIERTO" | "EN_PROCESO" | "CERRADO"
}

// Acta de custodia
export interface CustodyAct {
  id: string
  assetId: string
  assetCode: string
  assetName: string
  custodian: string
  createdAt: string
  status: "PENDIENTE" | "FIRMADA" | "RECHAZADA"
}
