"use client"

import { create } from "zustand"
import type { Asset, AssetStatus, SoftwareItem, SupportTicket, CustodyAct } from "./types"

const emptyAsset: Asset = {
  id: "",
  code: "",
  name: "",
  description: "",
  value: 0,
  provider: "",
  custodian: "",
  status: "PENDIENTE_ADQUISICION",
  purchaseDate: "",
  yearsInUse: 0,
}

const testAsset: Asset = {
  id: "asset-001",
  code: "QR-012",
  name: "Notebook HP ProBook 450 G10",
  description: "Notebook corporativo de alta gama para trabajo contable",
  value: 845900,
  provider: "SOLUCIONES TCP",
  custodian: "Diego Leiva",
  status: "ADQUIRIDO",
  purchaseDate: new Date().toISOString().split("T")[0],
  yearsInUse: 0,
}

const corporateSoftware: SoftwareItem[] = [
  { id: "sw-001", name: "Sistema Contable ASCONT", description: "Software de gestion contable y tributaria", installed: false },
  { id: "sw-002", name: "VPN Corporativa", description: "Conexion segura a la red interna de ASCONT", installed: false },
  { id: "sw-003", name: "Microsoft Office 365", description: "Suite de productividad y herramientas de oficina", installed: false },
  { id: "sw-004", name: "Antivirus Corporativo", description: "Proteccion contra malware y amenazas", installed: false },
  { id: "sw-005", name: "Cliente de Correo Outlook", description: "Gestion de correo electronico corporativo", installed: false },
]

const initialCustodyActs: CustodyAct[] = [
  { id: "act-001", assetId: "asset-001", assetCode: "QR-012", assetName: "Notebook HP ProBook 450 G10", custodian: "Rodrigo Carmona", createdAt: new Date().toISOString(), status: "PENDIENTE" },
]

interface AppState {
  asset: Asset
  setAssetStatus: (status: AssetStatus) => void
  resetAsset: () => void
  acquireAsset: (success: boolean) => void
  receiveAsset: (usefulLife: number, residualValue: number) => void
  retireAsset: () => void
  software: SoftwareItem[]
  installSoftware: (id: string) => void
  installAllSoftware: () => void
  resetSoftware: () => void
  custodyActs: CustodyAct[]
  signAct: (id: string) => void
  rejectAct: (id: string) => void
  supportTickets: SupportTicket[]
  createTicket: (description: string, yearsInUse: number) => void
  notifications: { id: string; message: string; type: "success" | "error" | "warning" }[]
  addNotification: (message: string, type: "success" | "error" | "warning") => void
  removeNotification: (id: string) => void
  currentScreen: number
  setCurrentScreen: (screen: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  asset: emptyAsset,
  setAssetStatus: (status) => set((state) => ({ asset: { ...state.asset, status } })),
  resetAsset: () => set({ asset: emptyAsset, supportTickets: [], currentScreen: 1 }),

  acquireAsset: (success) => set((state) => {
    if (success) return { asset: { ...testAsset } }
    return { asset: { ...state.asset, name: "Notebook HP ProBook 450 G10", value: 845900, provider: "SOLUCIONES TCP", custodian: "Diego Leiva", status: "RECHAZADO" as AssetStatus } }
  }),

  receiveAsset: (usefulLife, residualValue) => set((state) => ({
    asset: { ...state.asset, status: "EN_BODEGA" as AssetStatus, usefulLife, residualValue },
  })),

  retireAsset: () => set((state) => ({
    asset: { ...state.asset, status: "DADO_DE_BAJA" as AssetStatus },
  })),

  software: corporateSoftware,
  installSoftware: (id) => set((state) => ({ software: state.software.map((sw) => sw.id === id ? { ...sw, installed: true } : sw) })),
  installAllSoftware: () => set((state) => ({ software: state.software.map((sw) => ({ ...sw, installed: true })) })),
  resetSoftware: () => set({ software: corporateSoftware }),

  custodyActs: initialCustodyActs,
  signAct: (id) => set((state) => ({
    custodyActs: state.custodyActs.map((act) => act.id === id ? { ...act, status: "FIRMADA" as const } : act),
    asset: { ...state.asset, status: "ASIGNADO" as AssetStatus },
  })),
  rejectAct: (id) => set((state) => ({
    custodyActs: state.custodyActs.map((act) => act.id === id ? { ...act, status: "RECHAZADA" as const } : act),
    asset: { ...state.asset, status: "EN_BODEGA" as AssetStatus },
  })),

  supportTickets: [],
  createTicket: (description, yearsInUse) => set((state) => {
    const newTicket: SupportTicket = { id: "ticket-" + Date.now(), assetId: state.asset.id, assetCode: state.asset.code, description, yearsInUse, createdAt: new Date().toISOString(), status: "ABIERTO" }
    return { supportTickets: [...state.supportTickets, newTicket], asset: { ...state.asset, status: "EN_MANTENCION" as AssetStatus, yearsInUse } }
  }),

  notifications: [],
  addNotification: (message, type) => set((state) => ({
    notifications: [...state.notifications, { id: "notif-" + Date.now(), message, type }],
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),

  currentScreen: 1,
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
}))