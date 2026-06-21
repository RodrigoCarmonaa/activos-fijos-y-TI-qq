"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
})

export async function loginAction(formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")

  const validatedFields = loginSchema.safeParse({ email, password })

  if (!validatedFields.success) {
    return { error: "Datos de login inválidos" }
  }

  try {
    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales incorrectas." }
        default:
          return { error: "Algo salió mal." }
      }
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirect: true, redirectTo: "/" })
}
