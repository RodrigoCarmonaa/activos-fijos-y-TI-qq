"use server"

import { prisma } from "@/auth"
import { auth } from "@/auth"

// Función para obtener todo el estado inicial para la UI
export async function getInitialAppState() {
  const session = await auth()
  if (!session?.user) {
    return null
  }

  const [assets, users, custodyActs, supportTickets, auditLog, softwareItems] = await Promise.all([
    prisma.asset.findMany({ include: { software: true } }),
    prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, department: true } }),
    prisma.custodyAct.findMany(),
    prisma.supportTicket.findMany(),
    prisma.auditLogEntry.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100 // Limitar a los últimos 100 logs para la UI
    }),
    prisma.softwareItem.findMany()
  ])

  return {
    assets: assets.map(a => ({
      ...a,
      purchaseDate: a.purchaseDate.toISOString().split('T')[0],
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      installedSoftware: a.software.map((s: any) => s.softwareItemId)
    })),
    users,
    custodyActs: custodyActs.map(a => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })),
    supportTickets: supportTickets.map(t => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })),
    auditLog: auditLog.map(l => ({
      ...l,
      timestamp: l.timestamp.toISOString(),
    })),
    software: softwareItems
  }
}
