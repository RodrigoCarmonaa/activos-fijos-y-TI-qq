"use client"

import { create } from "zustand"
import type { Asset, AssetStatus, SoftwareItem, SupportTicket, CustodyAct } from "./types"

// Activo de prueba según especificación
const testAsset: Asset = {
  id: "asset-001",
  code: "QR-012",
  name: "Notebook HP ProBook 450 G10",
  description: "Notebook corporativo de alta gama para trabajo contable",
  value: 845900,
  provider: "SOLUCIONES TCP",
  custodian: "Rodrigo Carmona",
  status: "EN_CONFIGURACION",
  purchaseDate: "2024-01-15",
  yearsInUse: 0,
}

// Stack de software corporativo
const corporateSoftware: SoftwareItem[] = [
  {
    id: "sw-001",
    name: "Sistema Contable ASCONT",
    description: "Software de gestión contable y tributaria",
    installed: false,
  },
  {
    id: "sw-002",
    name: "VPN Corporativa",
    description: "Conexión segura a la red interna de ASCONT",
    installed: false,
  },
  {
    id: "sw-003",
    name: "Microsoft Office 365",
    description: "Suite de productividad y herramientas de oficina",
    installed: false,
  },
  {
    id: "sw-004",
    name: "Antivirus Corporativo",
    description: "Protección contra malware y amenazas",
    installed: false,
  },
  {
    id: "sw-005",
    name: "Cliente de Correo Outlook",
    description: "Gestión de correo electrónico corporativo",
    installed: false,
  },
]

interface AppState {
  // Estado del activo
  asset: Asset
  setAssetStatus: (status: AssetStatus) => void
  resetAsset: () => void

  // Software corporativo
  software: SoftwareItem[]
  installSoftware: (id: string) => void
  installAllSoftware: () => void
  resetSoftware: () => void

  // Actas de custodia
  custodyActs: CustodyAct[]
  signAct: (id: string) => void
  rejectAct: (id: string) => void

  // Tickets de soporte
  supportTickets: SupportTicket[]
  createTicket: (description: string, yearsInUse: number) => void

  // Notificaciones
  notifications: { id: string; message: string; type: "success" | "error" | "warning" }[]
  addNotification: (message: string, type: "success" | "error" | "warning") => void
  removeNotification: (id: string) => void

  // Navegación
  currentScreen: number
  setCurrentScreen: (screen: number) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Estado inicial del activo
  asset: testAsset,
  setAssetStatus: (status) =>
    set((state) => ({
      asset: { ...state.asset, status },
    })),
  resetAsset: () => set({ asset: testAsset }),

  // Software
  software: corporateSoftware,
  installSoftware: (id) =>
    set((state) => ({
      software: state.software.map((sw) =>
        sw.id === id ? { ...sw, installed: true } : sw
      ),
    })),
  installAllSoftware: () =>
    set((state) => ({
      software: state.software.map((sw) => ({ ...sw, installed: true })),
    })),
  resetSoftware: () => set({ software: corporateSoftware }),

  // Actas de custodia
  custodyActs: [
    {
      id: "act-001",
      assetId: "asset-001",
      assetCode: "QR-012",
      assetName: "Notebook HP ProBook 450 G10",
      custodian: "Rodrigo Carmona",
      createdAt: new Date().toISOString(),
      status: "PENDIENTE",
    },
  ],
  signAct: (id) =>
    set((state) => {
      const updatedActs = state.custodyActs.map((act) =>
        act.id === id ? { ...act, status: "FIRMADA" as const } : act
      )
      return {
        custodyActs: updatedActs,
        asset: { ...state.asset, status: "ASIGNADO" },
      }
    }),
  rejectAct: (id) =>
    set((state) => {
      const updatedActs = state.custodyActs.map((act) =>
        act.id === id ? { ...act, status: "RECHAZADA" as const } : act
      )
      return {
        custodyActs: updatedActs,
        asset: { ...state.asset, status: "EN_BODEGA" },
      }
    }),

  // Tickets de soporte
  supportTickets: [],
  createTicket: (description, yearsInUse) =>
    set((state) => {
      const newTicket: SupportTicket = {
        id: `ticket-${Date.now()}`,
        assetId: state.asset.id,
        assetCode: state.asset.code,
        description,
        yearsInUse,
        createdAt: new Date().toISOString(),
        status: "ABIERTO",
      }
      return {
        supportTickets: [...state.supportTickets, newTicket],
        asset: { ...state.asset, status: "EN_MANTENCION", yearsInUse },
      }
    }),

  // Notificaciones
  notifications: [],
  addNotification: (message, type) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: `notif-${Date.now()}`, message, type },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  // Navegación
  currentScreen: 2,
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
}))
