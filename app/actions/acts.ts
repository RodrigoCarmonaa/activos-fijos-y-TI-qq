"use server"

import { prisma } from "@/auth"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function createCustodyActAction(assetId: string, custodianId: string) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    const asset = await prisma.asset.findUnique({ where: { id: assetId } })
    if (!asset) return { error: "Activo no encontrado" }

    const act = await prisma.custodyAct.create({
      data: {
        assetId,
        custodianId,
        status: "PENDIENTE"
      }
    })

    await prisma.auditLogEntry.create({
      data: {
        userId: session.user.id,
        action: "Asignación Custodia",
        details: `Se generó acta de custodia para el activo ${asset.code}`,
        assetId: asset.id
      }
    })

    revalidatePath("/")
    return { success: true, act }
  } catch (error) {
    console.error(error)
    return { error: "Error al generar acta" }
  }
}

export async function signActAction(actId: string, signature: string) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    const act = await prisma.custodyAct.update({
      where: { id: actId },
      data: {
        status: "FIRMADA",
        signedBy: signature
      },
      include: { asset: true }
    })

    // Actualizamos el activo para reflejar la custodia oficial
    await prisma.asset.update({
      where: { id: act.assetId },
      data: { 
        status: "ASIGNADO",
        custodianId: act.custodianId
      }
    })

    await prisma.auditLogEntry.create({
      data: {
        userId: session.user.id,
        action: "Firma de Acta",
        details: `Acta firmada digitalmente por ${signature} para el activo ${act.asset.code}`,
        assetId: act.assetId
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Error al firmar acta" }
  }
}

export async function rejectActAction(actId: string, reason: string) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    const act = await prisma.custodyAct.update({
      where: { id: actId },
      data: {
        status: "RECHAZADA",
        rejectionReason: reason
      },
      include: { asset: true }
    })

    await prisma.auditLogEntry.create({
      data: {
        userId: session.user.id,
        action: "Rechazo de Acta",
        details: `Acta de custodia rechazada para el activo ${act.asset.code}. Razón: ${reason}`,
        assetId: act.assetId
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Error al rechazar acta" }
  }
}
