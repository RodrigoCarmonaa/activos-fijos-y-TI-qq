"use server"

import { prisma } from "@/auth"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { TicketPriority, TicketCategory } from "@prisma/client"

export async function createTicketAction(
  assetId: string,
  description: string,
  yearsInUse: number,
  priority: TicketPriority,
  category: TicketCategory
) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    const asset = await prisma.asset.findUnique({ where: { id: assetId } })
    if (!asset) return { error: "Activo no encontrado" }

    const ticket = await prisma.supportTicket.create({
      data: {
        assetId,
        description,
        yearsInUse,
        priority,
        category,
        status: "ABIERTO"
      }
    })

    // Cambiamos el estado del activo a EN_MANTENCION automáticamente
    await prisma.asset.update({
      where: { id: assetId },
      data: { status: "EN_MANTENCION" }
    })

    await prisma.auditLogEntry.create({
      data: {
        userId: session.user.id,
        action: "Soporte (Nuevo Ticket)",
        details: `Ticket creado para el activo ${asset.code}. Prioridad: ${priority}`,
        assetId: asset.id
      }
    })

    revalidatePath("/")
    return { success: true, ticket }
  } catch (error) {
    console.error(error)
    return { error: "Error al crear ticket" }
  }
}

export async function resolveTicketAction(ticketId: string, resolution: string) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: "CERRADO",
        resolution
      },
      include: { asset: true }
    })

    // Devolver el activo a estado ASIGNADO o LISTO_PARA_ASIGNACION
    const newStatus = ticket.asset.custodianId ? "ASIGNADO" : "LISTO_PARA_ASIGNACION"
    
    await prisma.asset.update({
      where: { id: ticket.assetId },
      data: { status: newStatus }
    })

    await prisma.auditLogEntry.create({
      data: {
        userId: session.user.id,
        action: "Soporte (Resolución)",
        details: `Ticket resuelto para el activo ${ticket.asset.code}. Resolución: ${resolution}`,
        assetId: ticket.assetId
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Error al resolver ticket" }
  }
}
