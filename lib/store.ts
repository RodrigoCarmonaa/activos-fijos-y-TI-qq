"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useEffect, useState } from "react"
import type { 
  Asset, 
  AssetStatus, 
  SoftwareItem, 
  SupportTicket, 
  CustodyAct,
  User,
  UserRole,
  AssetEvent,
  ROLE_PERMISSIONS
} from "./types"

// Usuarios predefinidos del sistema
const systemUsers: User[] = [
  { id: "user-001", name: "Maria Gonzalez", role: "ENCARGADO_ADQUISICIONES", email: "maria.gonzalez@ascont.cl" },
  { id: "user-002", name: "Carlos Perez", role: "LOGISTICA", email: "carlos.perez@ascont.cl" },
  { id: "user-003", name: "Ana Rodriguez", role: "TECNICO_TI", email: "ana.rodriguez@ascont.cl" },
  { id: "user-004", name: "Rodrigo Carmona", role: "CUSTODIO", email: "rodrigo.carmona@ascont.cl" },
]

// Stack de software corporativo
const corporateSoftware: SoftwareItem[] = [
  { id: "sw-001", name: "Sistema Contable ASCONT", description: "Software de gestion contable y tributaria", installed: false },
  { id: "sw-002", name: "VPN Corporativa", description: "Conexion segura a la red interna de ASCONT", installed: false },
  { id: "sw-003", name: "Microsoft Office 365", description: "Suite de productividad y herramientas de oficina", installed: false },
  { id: "sw-004", name: "Antivirus Corporativo", description: "Proteccion contra malware y amenazas", installed: false },
  { id: "sw-005", name: "Cliente de Correo Outlook", description: "Gestion de correo electronico corporativo", installed: false },
]

interface AppState {
  // Autenticacion
  currentUser: User | null
  users: User[]
  login: (userId: string) => void
  logout: () => void
  
  // Inventario de activos
  assets: Asset[]
  addAsset: (asset: Omit<Asset, "id" | "createdAt" | "updatedAt" | "status" | "yearsInUse" | "custodian">) => void
  updateAssetStatus: (assetId: string, newStatus: AssetStatus, description?: string) => void
  getAssetByCode: (code: string) => Asset | undefined
  assignCustodian: (assetId: string, custodianName: string) => void
  
  // Historial de eventos (Hoja de Vida)
  events: AssetEvent[]
  addEvent: (assetId: string, assetCode: string, fromStatus: AssetStatus | null, toStatus: AssetStatus, description: string) => void
  getAssetEvents: (assetId: string) => AssetEvent[]

  // Software corporativo (por activo)
  softwareByAsset: Record<string, SoftwareItem[]>
  initializeSoftwareForAsset: (assetId: string) => void
  installSoftware: (assetId: string, softwareId: string) => void
  installAllSoftware: (assetId: string) => void
  getSoftwareForAsset: (assetId: string) => SoftwareItem[]

  // Actas de custodia
  custodyActs: CustodyAct[]
  createCustodyAct: (assetId: string, custodianName: string) => void
  signAct: (actId: string) => void
  rejectAct: (actId: string) => void

  // Tickets de soporte
  supportTickets: SupportTicket[]
  createTicket: (assetId: string, description: string, yearsInUse: number) => void
  evaluateRepair: (ticketId: string, repairCost: number) => { success: boolean; exceeds50Percent: boolean }
  completeRepair: (ticketId: string) => void

  // Navegacion
  currentScreen: number
  setCurrentScreen: (screen: number) => void
  
  // Activo seleccionado para operaciones
  selectedAssetId: string | null
  setSelectedAssetId: (id: string | null) => void

  // Reset del estado
  resetStore: () => void
}

const initialState = {
  currentUser: null,
  users: systemUsers,
  assets: [],
  events: [],
  softwareByAsset: {},
  custodyActs: [],
  supportTickets: [],
  currentScreen: 6, // Dashboard por defecto
  selectedAssetId: null,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Autenticacion
      login: (userId) => {
        const user = get().users.find((u) => u.id === userId)
        if (user) {
          set({ currentUser: user })
        }
      },
      logout: () => set({ currentUser: null, currentScreen: 6 }),

      // Inventario de activos
      addAsset: (assetData) => {
        const currentUser = get().currentUser
        if (!currentUser) return

        const newAsset: Asset = {
          ...assetData,
          id: `asset-${Date.now()}`,
          status: "PENDIENTE",
          yearsInUse: 0,
          custodian: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          assets: [...state.assets, newAsset],
        }))

        // Registrar evento
        get().addEvent(newAsset.id, newAsset.code, null, "PENDIENTE", `Activo registrado en el sistema por ${currentUser.name}`)
      },

      updateAssetStatus: (assetId, newStatus, description = "") => {
        const currentUser = get().currentUser
        if (!currentUser) return

        const asset = get().assets.find((a) => a.id === assetId)
        if (!asset) return

        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === assetId
              ? { ...a, status: newStatus, updatedAt: new Date().toISOString() }
              : a
          ),
        }))

        get().addEvent(
          assetId, 
          asset.code, 
          asset.status, 
          newStatus, 
          description || `Estado cambiado de ${asset.status} a ${newStatus}`
        )
      },

      getAssetByCode: (code) => {
        return get().assets.find((a) => a.code.toUpperCase() === code.toUpperCase())
      },

      assignCustodian: (assetId, custodianName) => {
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === assetId
              ? { ...a, custodian: custodianName, updatedAt: new Date().toISOString() }
              : a
          ),
        }))
      },

      // Historial de eventos
      addEvent: (assetId, assetCode, fromStatus, toStatus, description) => {
        const currentUser = get().currentUser
        if (!currentUser) return

        const newEvent: AssetEvent = {
          id: `event-${Date.now()}`,
          assetId,
          assetCode,
          fromStatus,
          toStatus,
          description,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          timestamp: new Date().toISOString(),
        }

        set((state) => ({
          events: [...state.events, newEvent],
        }))
      },

      getAssetEvents: (assetId) => {
        return get().events.filter((e) => e.assetId === assetId).sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      },

      // Software corporativo
      initializeSoftwareForAsset: (assetId) => {
        if (!get().softwareByAsset[assetId]) {
          set((state) => ({
            softwareByAsset: {
              ...state.softwareByAsset,
              [assetId]: corporateSoftware.map((sw) => ({ ...sw, installed: false })),
            },
          }))
        }
      },

      installSoftware: (assetId, softwareId) => {
        set((state) => ({
          softwareByAsset: {
            ...state.softwareByAsset,
            [assetId]: (state.softwareByAsset[assetId] || []).map((sw) =>
              sw.id === softwareId ? { ...sw, installed: true } : sw
            ),
          },
        }))
      },

      installAllSoftware: (assetId) => {
        set((state) => ({
          softwareByAsset: {
            ...state.softwareByAsset,
            [assetId]: (state.softwareByAsset[assetId] || []).map((sw) => ({ ...sw, installed: true })),
          },
        }))
      },

      getSoftwareForAsset: (assetId) => {
        const software = get().softwareByAsset[assetId]
        if (!software) {
          get().initializeSoftwareForAsset(assetId)
          return corporateSoftware.map((sw) => ({ ...sw, installed: false }))
        }
        return software
      },

      // Actas de custodia
      createCustodyAct: (assetId, custodianName) => {
        const asset = get().assets.find((a) => a.id === assetId)
        if (!asset) return

        const newAct: CustodyAct = {
          id: `act-${Date.now()}`,
          assetId,
          assetCode: asset.code,
          assetName: asset.name,
          custodian: custodianName,
          createdAt: new Date().toISOString(),
          status: "PENDIENTE",
        }

        set((state) => ({
          custodyActs: [...state.custodyActs, newAct],
        }))
      },

      signAct: (actId) => {
        const act = get().custodyActs.find((a) => a.id === actId)
        if (!act) return

        set((state) => ({
          custodyActs: state.custodyActs.map((a) =>
            a.id === actId ? { ...a, status: "FIRMADA" } : a
          ),
        }))

        get().assignCustodian(act.assetId, act.custodian)
        get().updateAssetStatus(act.assetId, "ASIGNADO", `Acta firmada por ${act.custodian}. Activo asignado.`)
      },

      rejectAct: (actId) => {
        const act = get().custodyActs.find((a) => a.id === actId)
        if (!act) return

        set((state) => ({
          custodyActs: state.custodyActs.map((a) =>
            a.id === actId ? { ...a, status: "RECHAZADA" } : a
          ),
        }))

        get().updateAssetStatus(act.assetId, "EN_BODEGA", `Acta rechazada por ${act.custodian}. Conflicto escalado a RRHH.`)
      },

      // Tickets de soporte
      createTicket: (assetId, description, yearsInUse) => {
        const asset = get().assets.find((a) => a.id === assetId)
        if (!asset) return

        const newTicket: SupportTicket = {
          id: `ticket-${Date.now()}`,
          assetId,
          assetCode: asset.code,
          description,
          yearsInUse,
          createdAt: new Date().toISOString(),
          status: "ABIERTO",
        }

        set((state) => ({
          supportTickets: [...state.supportTickets, newTicket],
          assets: state.assets.map((a) =>
            a.id === assetId ? { ...a, yearsInUse, status: "EN_MANTENCION", updatedAt: new Date().toISOString() } : a
          ),
        }))

        get().addEvent(assetId, asset.code, asset.status, "EN_MANTENCION", `Ticket de soporte creado: ${description}`)
      },

      evaluateRepair: (ticketId, repairCost) => {
        const currentUser = get().currentUser
        if (!currentUser) return { success: false, exceeds50Percent: false }

        const ticket = get().supportTickets.find((t) => t.id === ticketId)
        if (!ticket) return { success: false, exceeds50Percent: false }

        const asset = get().assets.find((a) => a.id === ticket.assetId)
        if (!asset) return { success: false, exceeds50Percent: false }

        const threshold = asset.value * 0.5
        const exceeds50Percent = repairCost > threshold

        if (exceeds50Percent) {
          // Regla del 50%: dar de baja el activo
          set((state) => ({
            supportTickets: state.supportTickets.map((t) =>
              t.id === ticketId
                ? { ...t, repairCost, status: "DADO_DE_BAJA" as const, evaluatedAt: new Date().toISOString(), evaluatedBy: currentUser.name }
                : t
            ),
            assets: state.assets.map((a) =>
              a.id === ticket.assetId
                ? { ...a, status: "DADO_DE_BAJA" as const, updatedAt: new Date().toISOString() }
                : a
            ),
          }))

          get().addEvent(
            ticket.assetId,
            ticket.assetCode,
            "EN_MANTENCION",
            "DADO_DE_BAJA",
            `Reparacion bloqueada: costo $${repairCost.toLocaleString("es-CL")} excede 50% del valor de compra ($${threshold.toLocaleString("es-CL")}). Activo dado de baja.`
          )

          return { success: true, exceeds50Percent: true }
        } else {
          // Reparacion aprobada
          set((state) => ({
            supportTickets: state.supportTickets.map((t) =>
              t.id === ticketId
                ? { ...t, repairCost, status: "EN_PROCESO" as const, evaluatedAt: new Date().toISOString(), evaluatedBy: currentUser.name }
                : t
            ),
          }))

          get().addEvent(
            ticket.assetId,
            ticket.assetCode,
            "EN_MANTENCION",
            "EN_MANTENCION",
            `Reparacion aprobada: costo $${repairCost.toLocaleString("es-CL")} dentro del limite (50% = $${threshold.toLocaleString("es-CL")})`
          )

          return { success: true, exceeds50Percent: false }
        }
      },

      completeRepair: (ticketId) => {
        const currentUser = get().currentUser
        if (!currentUser) return

        const ticket = get().supportTickets.find((t) => t.id === ticketId)
        if (!ticket || ticket.status !== "EN_PROCESO") return

        set((state) => ({
          supportTickets: state.supportTickets.map((t) =>
            t.id === ticketId ? { ...t, status: "CERRADO" as const } : t
          ),
          assets: state.assets.map((a) =>
            a.id === ticket.assetId
              ? { ...a, status: "ASIGNADO" as const, updatedAt: new Date().toISOString() }
              : a
          ),
        }))

        get().addEvent(
          ticket.assetId,
          ticket.assetCode,
          "EN_MANTENCION",
          "ASIGNADO",
          `Reparacion completada. Activo devuelto al custodio.`
        )
      },

      // Navegacion
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
      
      // Activo seleccionado
      setSelectedAssetId: (id) => set({ selectedAssetId: id }),

      // Reset
      resetStore: () => set(initialState),
    }),
    {
      name: "ascont-storage",
      version: 1,
    }
  )
)

// Hook para manejar la hidratacion de Zustand con SSR
export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
