"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { Users, UserPlus, Shield, Wrench, UserCheck, AlertCircle, CheckCircle2 } from "lucide-react"
import { createUserAction, getUsersAction } from "@/app/actions/users"

const roleInfo = {
  ADMIN: { label: "Administrador", icon: Shield, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  TECNICO_TI: { label: "Técnico TI", icon: Wrench, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  CUSTODIO: { label: "Custodio", icon: UserCheck, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
}

export function Usuarios() {
  const { addNotification } = useAppStore()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("CUSTODIO")
  const [department, setDepartment] = useState("")
  const [error, setError] = useState("")

  const loadUsers = async () => {
    try {
      const data = await getUsersAction()
      setUsers(data)
    } catch (err) {
      console.error(err)
      addNotification("Error al cargar usuarios", "error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("role", role)
    formData.append("department", department)

    const result = await createUserAction(formData)

    if (result.error) {
      setError(result.error)
    } else {
      addNotification("Usuario creado", "success")
      setName("")
      setEmail("")
      setPassword("")
      setDepartment("")
      setRole("CUSTODIO")
      loadUsers() // Recargar lista
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-500" />
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-slate-400">
            Administra las cuentas de acceso al sistema ASCONT.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Crear Usuario */}
        <div className="col-span-1">
          <div className="rounded-xl border border-slate-800 bg-[#1A1D27]/50 backdrop-blur-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[80px] rounded-full" />
            
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 relative z-10">
              <UserPlus className="h-5 w-5 text-emerald-400" />
              Nuevo Usuario
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="juan.perez@ascont.cl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Contraseña Temporal</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Rol del Sistema</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="CUSTODIO">Custodio (Básico)</option>
                  <option value="TECNICO_TI">Técnico TI (Soporte)</option>
                  <option value="ADMIN">Administrador (Total)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Departamento</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F1117] px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Ej: Finanzas, TI, RRHH"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 mt-4"
              >
                {isSubmitting ? "Creando..." : "Crear Usuario"}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Usuarios */}
        <div className="col-span-1 lg:col-span-2">
          <div className="rounded-xl border border-slate-800 bg-[#1A1D27]/50 backdrop-blur-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white">Usuarios Registrados</h2>
            </div>
            
            <div className="flex-1 overflow-auto p-0">
              {isLoading ? (
                <div className="p-8 text-center text-sm text-slate-500">Cargando usuarios...</div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No hay usuarios registrados</div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {users.map((user) => {
                    const RoleIcon = roleInfo[user.role as keyof typeof roleInfo].icon
                    return (
                      <div key={user.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                            <RoleIcon className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-400">{user.department}</p>
                            <p className="text-[10px] text-slate-500">
                              Creado el {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-medium ${roleInfo[user.role as keyof typeof roleInfo].color}`}>
                            {roleInfo[user.role as keyof typeof roleInfo].label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
