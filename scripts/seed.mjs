import pkg from '@prisma/client'
const { PrismaClient } = pkg
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("Comprobando si existe un administrador...")
  const adminExists = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (adminExists) {
    console.log("Ya existe un administrador en la base de datos.")
    return
  }

  const hashedPassword = await bcrypt.hash('ascont123', 12)

  const admin = await prisma.user.create({
    data: {
      name: 'Diego Leiva',
      email: 'diego.leiva@ascont.cl',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      department: 'Administración'
    }
  })

  console.log(`✅ Administrador creado exitosamente: ${admin.email} (Contraseña: ascont123)`)
}

main()
  .catch((e) => {
    console.error("Error al sembrar la base de datos:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
