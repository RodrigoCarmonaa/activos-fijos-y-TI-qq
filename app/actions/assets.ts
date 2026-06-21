"use server"

import { prisma } from "@/auth"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { AssetStatus } from "@prisma/client"

export async function createAssetAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    const rawValue = formData.get("value") as string
    const value = parseInt(rawValue.replace(/\D/g, ""), 10) || 0

    const newAsset = await prisma.asset.create({
      data: {
        code: `ASCONT-${Date.now().toString().slice(-6)}`,
        name: formData.get("name") as string || `${formData.get("brand")} ${formData.get("model")}`,
        description: formData.get("description") as string,
        value,
        provider: formData.get("provider") as string,
        category: formData.get("category") as string,
        brand: formData.get("brand") as string,
        model: formData.get("model") as string,
        status: "ADQUIRIDO",
        purchaseDate: new Date(),
      }
    })

    await prisma.auditLogEntry.create({
      data: {
        userId: session.user.id,
        action: "Adquisición",
        details: `Activo ${newAsset.code} adquirido a ${newAsset.provider}`,
        assetId: newAsset.id
      }
    })

    revalidatePath("/")
    return { success: true, asset: newAsset }
  } catch (error) {
    console.error(error)
    return { error: "Error al crear activo" }
  }
}

export async function receiveAssetAction(assetId: string, usefulLife: number, residualValue: number) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        status: "EN_BODEGA",
        usefulLife,
        residualValue,
        physicalCheckCompleted: true
      }
    })

    await prisma.auditLogEntry.create({
      data: {
        userId: session.user.id,
        action: "Recepción",
        details: `Activo ${asset.code} verificado físicamente y almacenado en bodega`,
        assetId: asset.id
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Error al recibir activo" }
  }
}

export async function rejectAssetAction(assetId: string, reason: string) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        status: "RECHAZADO",
        rejectionReason: reason
      }
    })

    await prisma.auditLogEntry.create({
      data: {
        userId: session.user.id,
        action: "Rechazo de Recepción",
        details: `Activo ${asset.code} rechazado. Razón: ${reason}`,
        assetId: asset.id
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Error al rechazar activo" }
  }
}

export async function configureAssetAction(assetId: string, notes: string) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        status: "LISTO_PARA_ASIGNACION",
        technicianNotes: notes
      }
    })

    await prisma.auditLogEntry.create({
      data: {
        userId: session.user.id,
        action: "Configuración TI",
        details: `Activo ${asset.code} configurado. Notas: ${notes}`,
        assetId: asset.id
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Error al configurar activo" }
  }
}

export async function updateAssetStatusAction(assetId: string, status: AssetStatus) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: { status }
    })

    await prisma.auditLogEntry.create({
      data: {
        userId: session.user.id,
        action: "Cambio de Estado",
        details: `Estado del activo ${asset.code} cambiado a ${status}`,
        assetId: asset.id
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Error al actualizar estado" }
  }
}

export async function retireAssetAction(assetId: string, reason: string) {
  const session = await auth()
  if (!session?.user) return { error: "No autorizado" }

  try {
    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        status: "DADO_DE_BAJA",
        retirementReason: reason
      }
    })

    await prisma.auditLogEntry.create({
      data: {
        userId: session.user.id,
        action: "Baja",
        details: `Activo ${asset.code} dado de baja. Razón: ${reason}`,
        assetId: asset.id
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Error al dar de baja" }
  }
}
