// Estados posibles del activo en el flujo
export type AssetStatus =
  | "PENDIENTE_ADQUISICION"
  | "ADQUIRIDO"
  | "RECHAZADO"
  | "EN_BODEGA"
  | "EN_CONFIGURACION"
  | "LISTO_PARA_ASIGNACION"
  | "ASIGNADO"
  | "EN_MANTENCION"
  | "DADO_DE_BAJA"

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
  usefulLife?: number
  residualValue?: number
  serialNumber?: string
  category?: string
  location?: string
  department?: string
  brand?: string
  model?: string
  rejectionReason?: string
  retirementReason?: string
  repairCost?: number
  technicianNotes?: string
  physicalCheckCompleted?: boolean
  createdAt?: string
}

// Software corporativo
export interface SoftwareItem {
  id: string
  name: string
  description: string
  installed: boolean
  isCustom?: boolean
}

// Ticket de soporte
export type TicketPriority = "ALTA" | "MEDIA" | "BAJA"
export type TicketCategory = "HARDWARE" | "SOFTWARE" | "RED" | "OTRO"

export interface SupportTicket {
  id: string
  assetId: string
  assetCode: string
  description: string
  yearsInUse: number
  createdAt: string
  status: "ABIERTO" | "EN_PROCESO" | "CERRADO"
  priority?: TicketPriority
  category?: TicketCategory
  resolution?: string
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
  signedBy?: string
  rejectionReason?: string
}

// Roles de usuario
export type UserRole = "ADMIN" | "TECNICO_TI" | "CUSTODIO"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  avatar?: string
}

// Log de auditoría
export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  details: string
  assetId?: string
  assetCode?: string
}

// Custodios disponibles
export interface Custodian {
  id: string
  name: string
  department: string
  email: string
}
