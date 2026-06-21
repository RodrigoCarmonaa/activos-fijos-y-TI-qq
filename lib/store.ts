"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  Asset,
  AssetStatus,
  SoftwareItem,
  SupportTicket,
  CustodyAct,
  User,
  UserRole,
  AuditLogEntry,
  Custodian,
  TicketPriority,
  TicketCategory,
} from "./types"

// ─── Usuarios predefinidos ───────────────────────────────────────────
const predefinedUsers: User[] = [
  {
    id: "user-001",
    name: "Diego Leiva",
    email: "diego.leiva@ascont.cl",
    role: "ADMIN",
    department: "Administración",
  },
  {
    id: "user-002",
    name: "Rodrigo Carmona",
    email: "rodrigo.carmona@ascont.cl",
    role: "TECNICO_TI",
    department: "Tecnología",
  },
  {
    id: "user-003",
    name: "María González",
    email: "maria.gonzalez@ascont.cl",
    role: "CUSTODIO",
    department: "Contabilidad",
  },
]

// ─── Custodios disponibles ───────────────────────────────────────────
const defaultCustodians: Custodian[] = [
  { id: "cust-001", name: "Rodrigo Carmona", department: "Tecnología", email: "rodrigo.carmona@ascont.cl" },
  { id: "cust-002", name: "María González", department: "Contabilidad", email: "maria.gonzalez@ascont.cl" },
  { id: "cust-003", name: "Diego Leiva", department: "Administración", email: "diego.leiva@ascont.cl" },
  { id: "cust-004", name: "Ana Martínez", department: "Recursos Humanos", email: "ana.martinez@ascont.cl" },
  { id: "cust-005", name: "Carlos Pérez", department: "Finanzas", email: "carlos.perez@ascont.cl" },
]

// ─── Software corporativo por defecto ───────────────────────────────
const defaultSoftware: SoftwareItem[] = [
  { id: "sw-001", name: "Sistema Contable ASCONT", description: "Software de gestión contable y tributaria", installed: false },
  { id: "sw-002", name: "VPN Corporativa", description: "Conexión segura a la red interna de ASCONT", installed: false },
  { id: "sw-003", name: "Microsoft Office 365", description: "Suite de productividad y herramientas de oficina", installed: false },
  { id: "sw-004", name: "Antivirus Corporativo", description: "Protección contra malware y amenazas", installed: false },
  { id: "sw-005", name: "Cliente de Correo Outlook", description: "Gestión de correo electrónico corporativo", installed: false },
]

// ─── Generador de código QR ──────────────────────────────────────────
function generateAssetCode(existingAssets: Asset[]): string {
  const maxNum = existingAssets.reduce((max, a) => {
    const match = a.code.match(/^QR-(\d+)$/)
    return match ? Math.max(max, parseInt(match[1])) : max
  }, 0)
  return `QR-${String(maxNum + 1).padStart(3, "0")}`
}

export const allScreens = [
  { id: 0, title: "Dashboard", icon: "Monitor" },
  { id: 1, title: "Adquisición", icon: "DollarSign" },
  { id: 2, title: "Recepción", icon: "QrCode" },
  { id: 3, title: "Configuración TI", icon: "Monitor" },
  { id: 4, title: "Custodia", icon: "User" },
  { id: 5, title: "Soporte", icon: "Wrench" },
  { id: 6, title: "Bajas", icon: "Trash2" },
  { id: 7, title: "Inventario", icon: "Building2" },
  { id: 8, title: "Usuarios", icon: "Users" },
]

// ─── Pantallas por rol ───────────────────────────────────────────────
export const screensByRole: Record<UserRole, number[]> = {
  ADMIN: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  TECNICO_TI: [0, 3, 5, 7],
  CUSTODIO: [0, 4],
}

// ─── Estado de la app ────────────────────────────────────────────────
interface AppState {
  // User & Auth
  currentUser: User | null
  setSessionUser: (user: any) => void
  users: User[]
  login: (email: string, password: string) => boolean
  logout: () => void

  // Assets (múltiples)
  assets: Asset[]
  currentAssetId: string | null
  getCurrentAsset: () => Asset | null
  createAsset: (data: Omit<Asset, "id" | "code" | "status" | "yearsInUse" | "createdAt">) => Asset
  updateAsset: (id: string, data: Partial<Asset>) => void
  setAssetStatus: (id: string, status: AssetStatus) => void
  rejectAsset: (id: string, reason: string) => void
  selectAsset: (id: string) => void

  // Recepción
  receiveAsset: (id: string, usefulLife: number, residualValue: number) => void
  retireAsset: (id: string, reason: string) => void
  repairAsset: (id: string) => void

  // Software
  software: Record<string, SoftwareItem[]>
  getSoftwareForAsset: (assetId: string) => SoftwareItem[]
  initSoftwareForAsset: (assetId: string) => void
  installSoftware: (assetId: string, swId: string) => void
  installAllSoftware: (assetId: string) => void
  addCustomSoftware: (assetId: string, name: string, description: string) => void
  removeSoftware: (assetId: string, swId: string) => void
  markAssetConfigured: (assetId: string, notes?: string) => void

  // Custodia
  custodians: Custodian[]
  custodyActs: CustodyAct[]
  createCustodyAct: (assetId: string, custodianName: string) => void
  signAct: (actId: string, signedBy: string) => void
  rejectAct: (actId: string, reason: string) => void

  // Soporte
  supportTickets: SupportTicket[]
  createTicket: (
    assetId: string,
    description: string,
    yearsInUse: number,
    priority: TicketPriority,
    category: TicketCategory
  ) => void
  resolveTicket: (ticketId: string, resolution: string) => void

  // Notifications
  notifications: { id: string; message: string; type: "success" | "error" | "warning" }[]
  addNotification: (message: string, type: "success" | "error" | "warning") => void
  removeNotification: (id: string) => void

  // Navigation
  currentScreen: number
  setCurrentScreen: (screen: number) => void

  // Audit log
  auditLog: AuditLogEntry[]

  // Reset
  resetAll: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ─── Auth ────────────────────────────────────────────
      currentUser: null,
      setSessionUser: (user) => set({ currentUser: user }),
      users: predefinedUsers,

      login: (email, password) => {
        // Password simple: "ascont123" para todos
        const user = predefinedUsers.find((u) => u.email === email)
        if (user && password === "ascont123") {
          set({ currentUser: user, currentScreen: 0 })
          const log: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userId: user.id,
            userName: user.name,
            action: "LOGIN",
            details: `${user.name} inició sesión como ${user.role}`,
          }
          set((state) => ({ auditLog: [log, ...state.auditLog] }))
          return true
        }
        return false
      },

      logout: () => {
        const user = get().currentUser
        if (user) {
          const log: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userId: user.id,
            userName: user.name,
            action: "LOGOUT",
            details: `${user.name} cerró sesión`,
          }
          set((state) => ({
            currentUser: null,
            currentScreen: 0,
            auditLog: [log, ...state.auditLog],
          }))
        } else {
          set({ currentUser: null, currentScreen: 0 })
        }
      },

      // ─── Assets ──────────────────────────────────────────
      assets: [],
      currentAssetId: null,

      getCurrentAsset: () => {
        const { assets, currentAssetId } = get()
        return assets.find((a) => a.id === currentAssetId) || null
      },

      createAsset: (data) => {
        const state = get()
        const user = state.currentUser
        const code = generateAssetCode(state.assets)
        const newAsset: Asset = {
          ...data,
          id: `asset-${Date.now()}`,
          code,
          status: "ADQUIRIDO",
          yearsInUse: 0,
          createdAt: new Date().toISOString(),
        }
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "CREAR_ACTIVO",
          details: `Activo ${code} creado: ${newAsset.name}`,
          assetId: newAsset.id,
          assetCode: code,
        }
        set((state) => ({
          assets: [...state.assets, newAsset],
          currentAssetId: newAsset.id,
          auditLog: [log, ...state.auditLog],
        }))
        return newAsset
      },

      updateAsset: (id, data) => {
        set((state) => ({
          assets: state.assets.map((a) => (a.id === id ? { ...a, ...data } : a)),
        }))
      },

      setAssetStatus: (id, status) => {
        const user = get().currentUser
        const asset = get().assets.find((a) => a.id === id)
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "CAMBIO_ESTADO",
          details: `Estado cambiado a ${status.replace(/_/g, " ")}`,
          assetId: id,
          assetCode: asset?.code || "",
        }
        set((state) => ({
          assets: state.assets.map((a) => (a.id === id ? { ...a, status } : a)),
          auditLog: [log, ...state.auditLog],
        }))
      },

      rejectAsset: (id, reason) => {
        const user = get().currentUser
        const asset = get().assets.find((a) => a.id === id)
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "RECHAZAR_ACTIVO",
          details: `Activo rechazado: ${reason}`,
          assetId: id,
          assetCode: asset?.code || "",
        }
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id ? { ...a, status: "RECHAZADO" as AssetStatus, rejectionReason: reason } : a
          ),
          auditLog: [log, ...state.auditLog],
        }))
      },

      selectAsset: (id) => set({ currentAssetId: id }),

      // ─── Recepción ───────────────────────────────────────
      receiveAsset: (id, usefulLife, residualValue) => {
        const user = get().currentUser
        const asset = get().assets.find((a) => a.id === id)
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "RECIBIR_ACTIVO",
          details: `Activo recibido en bodega. Vida útil: ${usefulLife} años, Valor residual: $${residualValue.toLocaleString("es-CL")}`,
          assetId: id,
          assetCode: asset?.code || "",
        }
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id
              ? { ...a, status: "EN_BODEGA" as AssetStatus, usefulLife, residualValue, physicalCheckCompleted: true }
              : a
          ),
          auditLog: [log, ...state.auditLog],
        }))
      },

      retireAsset: (id, reason) => {
        const user = get().currentUser
        const asset = get().assets.find((a) => a.id === id)
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "BAJA_ACTIVO",
          details: `Activo dado de baja: ${reason}`,
          assetId: id,
          assetCode: asset?.code || "",
        }
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id
              ? { ...a, status: "DADO_DE_BAJA" as AssetStatus, retirementReason: reason }
              : a
          ),
          auditLog: [log, ...state.auditLog],
        }))
      },

      repairAsset: (id) => {
        const user = get().currentUser
        const asset = get().assets.find((a) => a.id === id)
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "REPARAR_ACTIVO",
          details: `Activo reparado, retorna a estado ASIGNADO`,
          assetId: id,
          assetCode: asset?.code || "",
        }
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id ? { ...a, status: "ASIGNADO" as AssetStatus } : a
          ),
          auditLog: [log, ...state.auditLog],
        }))
      },

      // ─── Software ─────────────────────────────────────────
      software: {},

      getSoftwareForAsset: (assetId) => {
        return get().software[assetId] || []
      },

      initSoftwareForAsset: (assetId) => {
        const existing = get().software[assetId]
        if (!existing || existing.length === 0) {
          set((state) => ({
            software: {
              ...state.software,
              [assetId]: defaultSoftware.map((sw) => ({ ...sw, id: `${sw.id}-${assetId}` })),
            },
          }))
        }
      },

      installSoftware: (assetId, swId) => {
        set((state) => ({
          software: {
            ...state.software,
            [assetId]: (state.software[assetId] || []).map((sw) =>
              sw.id === swId ? { ...sw, installed: true } : sw
            ),
          },
        }))
      },

      installAllSoftware: (assetId) => {
        set((state) => ({
          software: {
            ...state.software,
            [assetId]: (state.software[assetId] || []).map((sw) => ({ ...sw, installed: true })),
          },
        }))
      },

      addCustomSoftware: (assetId, name, description) => {
        const newSw: SoftwareItem = {
          id: `sw-custom-${Date.now()}`,
          name,
          description,
          installed: false,
          isCustom: true,
        }
        set((state) => ({
          software: {
            ...state.software,
            [assetId]: [...(state.software[assetId] || []), newSw],
          },
        }))
      },

      removeSoftware: (assetId, swId) => {
        set((state) => ({
          software: {
            ...state.software,
            [assetId]: (state.software[assetId] || []).filter((sw) => sw.id !== swId),
          },
        }))
      },

      markAssetConfigured: (assetId, notes) => {
        const user = get().currentUser
        const asset = get().assets.find((a) => a.id === assetId)
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "CONFIGURAR_ACTIVO",
          details: `Software instalado y activo configurado${notes ? `. Notas: ${notes}` : ""}`,
          assetId,
          assetCode: asset?.code || "",
        }
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === assetId
              ? { ...a, status: "LISTO_PARA_ASIGNACION" as AssetStatus, technicianNotes: notes }
              : a
          ),
          auditLog: [log, ...state.auditLog],
        }))
      },

      // ─── Custodia ─────────────────────────────────────────
      custodians: defaultCustodians,
      custodyActs: [],

      createCustodyAct: (assetId, custodianName) => {
        const asset = get().assets.find((a) => a.id === assetId)
        if (!asset) return
        const user = get().currentUser
        const newAct: CustodyAct = {
          id: `act-${Date.now()}`,
          assetId,
          assetCode: asset.code,
          assetName: asset.name,
          custodian: custodianName,
          createdAt: new Date().toISOString(),
          status: "PENDIENTE",
        }
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "CREAR_ACTA",
          details: `Acta de custodia creada para ${custodianName}`,
          assetId,
          assetCode: asset.code,
        }
        set((state) => ({
          custodyActs: [...state.custodyActs, newAct],
          assets: state.assets.map((a) =>
            a.id === assetId ? { ...a, custodian: custodianName } : a
          ),
          auditLog: [log, ...state.auditLog],
        }))
      },

      signAct: (actId, signedBy) => {
        const act = get().custodyActs.find((a) => a.id === actId)
        if (!act) return
        const user = get().currentUser
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "FIRMAR_ACTA",
          details: `Acta firmada por ${signedBy}. Activo asignado.`,
          assetId: act.assetId,
          assetCode: act.assetCode,
        }
        set((state) => ({
          custodyActs: state.custodyActs.map((a) =>
            a.id === actId ? { ...a, status: "FIRMADA" as const, signedBy } : a
          ),
          assets: state.assets.map((a) =>
            a.id === act.assetId ? { ...a, status: "ASIGNADO" as AssetStatus } : a
          ),
          auditLog: [log, ...state.auditLog],
        }))
      },

      rejectAct: (actId, reason) => {
        const act = get().custodyActs.find((a) => a.id === actId)
        if (!act) return
        const user = get().currentUser
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "RECHAZAR_ACTA",
          details: `Acta rechazada: ${reason}`,
          assetId: act.assetId,
          assetCode: act.assetCode,
        }
        set((state) => ({
          custodyActs: state.custodyActs.map((a) =>
            a.id === actId ? { ...a, status: "RECHAZADA" as const, rejectionReason: reason } : a
          ),
          assets: state.assets.map((a) =>
            a.id === act.assetId ? { ...a, status: "EN_BODEGA" as AssetStatus } : a
          ),
          auditLog: [log, ...state.auditLog],
        }))
      },

      // ─── Soporte ──────────────────────────────────────────
      supportTickets: [],

      createTicket: (assetId, description, yearsInUse, priority, category) => {
        const asset = get().assets.find((a) => a.id === assetId)
        if (!asset) return
        const user = get().currentUser
        const newTicket: SupportTicket = {
          id: `ticket-${Date.now()}`,
          assetId,
          assetCode: asset.code,
          description,
          yearsInUse,
          createdAt: new Date().toISOString(),
          status: "ABIERTO",
          priority,
          category,
        }
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "CREAR_TICKET",
          details: `Ticket creado [${priority}/${category}]: ${description.substring(0, 60)}...`,
          assetId,
          assetCode: asset.code,
        }
        set((state) => ({
          supportTickets: [...state.supportTickets, newTicket],
          assets: state.assets.map((a) =>
            a.id === assetId ? { ...a, status: "EN_MANTENCION" as AssetStatus, yearsInUse } : a
          ),
          auditLog: [log, ...state.auditLog],
        }))
      },

      resolveTicket: (ticketId, resolution) => {
        const ticket = get().supportTickets.find((t) => t.id === ticketId)
        if (!ticket) return
        const user = get().currentUser
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          userName: user?.name || "Sistema",
          action: "RESOLVER_TICKET",
          details: `Ticket resuelto: ${resolution}`,
          assetId: ticket.assetId,
          assetCode: ticket.assetCode,
        }
        set((state) => ({
          supportTickets: state.supportTickets.map((t) =>
            t.id === ticketId ? { ...t, status: "CERRADO" as const, resolution } : t
          ),
          auditLog: [log, ...state.auditLog],
        }))
      },

      // ─── Notificaciones ───────────────────────────────────
      notifications: [],
      addNotification: (message, type) =>
        set((state) => ({
          notifications: [...state.notifications, { id: `notif-${Date.now()}`, message, type }],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      // ─── Navegación ───────────────────────────────────────
      currentScreen: 0,
      setCurrentScreen: (screen) => set({ currentScreen: screen }),

      // ─── Audit Log ────────────────────────────────────────
      auditLog: [],

      // ─── Reset ────────────────────────────────────────────
      resetAll: () =>
        set({
          assets: [],
          currentAssetId: null,
          software: {},
          custodyActs: [],
          supportTickets: [],
          notifications: [],
          currentScreen: 0,
          auditLog: [],
        }),
    }),
    {
      name: "ascont-storage",
      partialize: (state) => ({
        assets: state.assets,
        currentAssetId: state.currentAssetId,
        software: state.software,
        custodyActs: state.custodyActs,
        supportTickets: state.supportTickets,
        currentUser: state.currentUser,
        currentScreen: state.currentScreen,
        auditLog: state.auditLog,
      }),
    }
  )
)