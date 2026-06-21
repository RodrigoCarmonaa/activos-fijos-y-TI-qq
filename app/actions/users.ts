"use server"

import { auth } from "@/auth"
import { prisma } from "@/auth"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { UserRole } from "@prisma/client"

const userSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.nativeEnum(UserRole),
  department: z.string().min(2, "Departamento requerido")
})

export async function createUserAction(formData: FormData) {
  // Solo los ADMIN pueden crear usuarios
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "No autorizado" }
  }

  const data = Object.fromEntries(formData.entries())
  const parsed = userSchema.safeParse(data)

  if (!parsed.success) {
    return { error: "Datos inválidos: " + parsed.error.errors[0].message }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email }
    })

    if (existingUser) {
      return { error: "Ya existe un usuario con ese email" }
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12)

    const newUser = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: hashedPassword,
        role: parsed.data.role,
        department: parsed.data.department
      }
    })

    return { success: true, user: newUser }
  } catch (error) {
    console.error("Error creating user:", error)
    return { error: "Error interno del servidor al crear usuario" }
  }
}

export async function getUsersAction() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("No autorizado")
  }

  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  })
}
