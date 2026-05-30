// Estados posibles del activo en el flujo estricto
export type AssetStatus =
  | "PENDIENTE"
  | "ADQUIRIDO"
  | "EN_BODEGA"
  | "EN_CONFIGURACION"
  | "LISTO_PARA_ASIGNACION"
  | "ASIGNADO"
  | "EN_MANTENCION"
  | "DADO_DE_BAJA"

// Roles del sistema
export type UserRole =
  | "ENCARGADO_ADQUISICIONES"
  | "LOGISTICA"
  | "TECNICO_TI"
  | "CUSTODIO"

export interface User {
  id: string
  name: string
  role: UserRole
  email: string
}

// Informacion del activo
export interface Asset {
  id: string
  code: string
  name: string
  marca: string
  modelo: string
  description: string
  value: number
  provider: string
  solicitante: string
  custodian: string | null
  status: AssetStatus
  purchaseDate: string
  yearsInUse: number
  createdAt: string
  updatedAt: string
}

// Evento del historial (Hoja de Vida)
export interface AssetEvent {
  id: string
  assetId: string
  assetCode: string
  fromStatus: AssetStatus | null
  toStatus: AssetStatus
  description: string
  userId: string
  userName: string
  userRole: UserRole
  timestamp: string
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

// Permisos por rol - modulos accesibles
export const ROLE_PERMISSIONS: Record<UserRole, number[]> = {
  ENCARGADO_ADQUISICIONES: [0, 6], // Adquisicion, Dashboard
  LOGISTICA: [1, 6], // Recepcion, Dashboard
  TECNICO_TI: [2, 5, 6], // Configuracion TI, Soporte, Dashboard
  CUSTODIO: [3, 5, 6], // Custodia, Soporte, Dashboard
}

export const ROLE_NAMES: Record<UserRole, string> = {
  ENCARGADO_ADQUISICIONES: "Encargado de Adquisiciones",
  LOGISTICA: "Logistica",
  TECNICO_TI: "Tecnico de TI",
  CUSTODIO: "Custodio",
}

// Flujo de estados validos
export const VALID_TRANSITIONS: Record<AssetStatus, AssetStatus[]> = {
  PENDIENTE: ["ADQUIRIDO"],
  ADQUIRIDO: ["EN_BODEGA"],
  EN_BODEGA: ["EN_CONFIGURACION"],
  EN_CONFIGURACION: ["LISTO_PARA_ASIGNACION"],
  LISTO_PARA_ASIGNACION: ["ASIGNADO"],
  ASIGNADO: ["EN_MANTENCION", "DADO_DE_BAJA"],
  EN_MANTENCION: ["ASIGNADO", "DADO_DE_BAJA"],
  DADO_DE_BAJA: [],
}
