"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

// ===== Tipos =====
export type Project = {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  deadline: string
  members: string[] // userIds
}

export type Member = {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

export type Task = {
  id: string
  description: string
  projectId: string
  status: string
  priority: string
  userId: string
  dateline: string
}

export type Settings = {
  companyName: string
  userName: string
  email: string
  language: string
  itemsPerPage: number
  darkMode: boolean
  notifications: boolean
  weeklyReport: boolean
}

export type Activity = {
  id: number
  user: string
  action: string
  target: string
  time: number
}

// ===== Datos iniciales (en memoria) =====
const initialMembers: Member[] = [
  { userId: "U001", role: "Desarrollador", name: "María García", email: "maria@example.com", position: "Frontend Developer", birthdate: "1998-04-12", phone: "987654321", projectId: "P001", isActive: true },
  { userId: "U002", role: "Desarrollador", name: "Juan Pérez", email: "juan@example.com", position: "Backend Developer", birthdate: "1995-09-30", phone: "912345678", projectId: "P004", isActive: true },
  { userId: "U003", role: "Diseñador", name: "Ana López", email: "ana@example.com", position: "UI/UX Designer", birthdate: "2000-01-22", phone: "934567812", projectId: "P002", isActive: false },
  { userId: "U004", role: "DevOps", name: "Carlos Ruiz", email: "carlos@example.com", position: "DevOps Engineer", birthdate: "1993-07-08", phone: "956781234", projectId: "P004", isActive: true },
  { userId: "U005", role: "Líder", name: "Laura Martínez", email: "laura@example.com", position: "Project Manager", birthdate: "1990-11-15", phone: "978123456", projectId: "P001", isActive: true },
  { userId: "U006", role: "QA", name: "Diego Torres", email: "diego@example.com", position: "QA Tester", birthdate: "1999-03-03", phone: "945612378", projectId: "P003", isActive: true },
]

const initialProjects: Project[] = [
  { id: "P001", title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "web", priority: "high", status: "En progreso", deadline: "2026-12-15", members: ["U001", "U002", "U005"] },
  { id: "P002", title: "Mobile App", description: "Aplicación móvil con React Native", category: "mobile", priority: "medium", status: "En revisión", deadline: "2026-11-30", members: ["U003", "U001"] },
  { id: "P003", title: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", category: "web", priority: "low", status: "Planificado", deadline: "2027-01-20", members: ["U006", "U005"] },
  { id: "P004", title: "API Gateway", description: "Microservicios con Node.js", category: "web", priority: "urgent", status: "En progreso", deadline: "2026-12-05", members: ["U002", "U004"] },
  { id: "P005", title: "Design System", description: "Librería de componentes reutilizables", category: "design", priority: "medium", status: "Completado", deadline: "2026-10-20", members: ["U003"] },
]

const initialTasks: Task[] = [
  { id: "T001", description: "Implementar autenticación", projectId: "P001", status: "En progreso", priority: "Alta", userId: "U001", dateline: "2026-11-15" },
  { id: "T002", description: "Diseñar pantalla de perfil", projectId: "P002", status: "Pendiente", priority: "Media", userId: "U003", dateline: "2026-11-20" },
  { id: "T003", description: "Configurar CI/CD", projectId: "P004", status: "Completado", priority: "Alta", userId: "U004", dateline: "2026-11-10" },
  { id: "T004", description: "Optimizar queries SQL", projectId: "P001", status: "En progreso", priority: "Urgente", userId: "U002", dateline: "2026-11-12" },
  { id: "T005", description: "Documentar API endpoints", projectId: "P004", status: "Pendiente", priority: "Baja", userId: "U002", dateline: "2026-11-25" },
  { id: "T006", description: "Crear carrito de compras", projectId: "P001", status: "Completado", priority: "Alta", userId: "U001", dateline: "2026-10-28" },
  { id: "T007", description: "Pruebas de usabilidad", projectId: "P002", status: "Completado", priority: "Media", userId: "U003", dateline: "2026-10-30" },
  { id: "T008", description: "Definir métricas del panel", projectId: "P003", status: "Pendiente", priority: "Baja", userId: "U005", dateline: "2026-12-01" },
  { id: "T009", description: "Componentes de botones y cards", projectId: "P005", status: "Completado", priority: "Media", userId: "U003", dateline: "2026-10-15" },
  { id: "T010", description: "Pruebas de carga del gateway", projectId: "P004", status: "En progreso", priority: "Urgente", userId: "U006", dateline: "2026-11-18" },
]

export const defaultSettings: Settings = {
  companyName: "Tecsup Projects",
  userName: "Sarai Soto",
  email: "sarai.soto@tecsup.edu.pe",
  language: "es",
  itemsPerPage: 5,
  darkMode: false,
  notifications: true,
  weeklyReport: false,
}

// ===== Utilidades =====
// Simula el tiempo de respuesta de un backend
export const fakeRequest = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

const nextId = (prefix: string, ids: string[]) => {
  const max = ids.reduce((acc, id) => Math.max(acc, Number(id.replace(prefix, "")) || 0), 0)
  return `${prefix}${String(max + 1).padStart(3, "0")}`
}

export const categoryLabels: Record<string, string> = {
  web: "Desarrollo Web",
  mobile: "Desarrollo Mobile",
  design: "Diseño",
  marketing: "Marketing",
  other: "Otro",
}

export const priorityLabels: Record<string, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
}

// ===== Contexto =====
type DashboardContextType = {
  loading: boolean
  projects: Project[]
  members: Member[]
  tasks: Task[]
  settings: Settings
  activity: Activity[]
  addProject: (data: Omit<Project, "id">) => Promise<void>
  updateProject: (data: Project) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  addMember: (data: Omit<Member, "userId">) => Promise<void>
  updateMember: (data: Member) => Promise<void>
  deleteMember: (userId: string) => Promise<void>
  addTask: (data: Omit<Task, "id">) => Promise<void>
  updateTask: (data: Task) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  saveSettings: (data: Settings) => Promise<void>
  getProgress: (projectId: string) => number
  getMemberName: (userId: string) => string
  getProjectTitle: (projectId: string) => string
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [activity, setActivity] = useState<Activity[]>([])

  // Simula la carga inicial desde el backend
  useEffect(() => {
    const load = async () => {
      await fakeRequest(1200)
      setProjects(initialProjects)
      setMembers(initialMembers)
      setTasks(initialTasks)
      setLoading(false)
    }
    load()
  }, [])

  // Modo oscuro desde configuración
  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode)
  }, [settings.darkMode])

  const log = (action: string, target: string) => {
    setActivity((prev) => [
      { id: Date.now() + Math.random(), user: settings.userName, action, target, time: Date.now() },
      ...prev,
    ].slice(0, 20))
  }

  // ----- Proyectos -----
  const addProject = async (data: Omit<Project, "id">) => {
    await fakeRequest()
    const id = nextId("P", projects.map((p) => p.id))
    setProjects((prev) => [...prev, { ...data, id }])
    log("creó el proyecto", data.title)
  }

  const updateProject = async (data: Project) => {
    await fakeRequest()
    setProjects((prev) => prev.map((p) => (p.id === data.id ? data : p)))
    log("actualizó el proyecto", data.title)
  }

  const deleteProject = async (id: string) => {
    await fakeRequest()
    const title = getProjectTitle(id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTasks((prev) => prev.filter((t) => t.projectId !== id))
    setMembers((prev) => prev.map((m) => (m.projectId === id ? { ...m, projectId: "" } : m)))
    log("eliminó el proyecto", title)
  }

  // ----- Miembros -----
  const syncMemberInProject = (userId: string, projectId: string) => {
    if (!projectId) return
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId && !p.members.includes(userId) ? { ...p, members: [...p.members, userId] } : p
      )
    )
  }

  const addMember = async (data: Omit<Member, "userId">) => {
    await fakeRequest()
    const userId = nextId("U", members.map((m) => m.userId))
    setMembers((prev) => [...prev, { ...data, userId }])
    syncMemberInProject(userId, data.projectId)
    log("agregó al miembro", data.name)
  }

  const updateMember = async (data: Member) => {
    await fakeRequest()
    setMembers((prev) => prev.map((m) => (m.userId === data.userId ? data : m)))
    syncMemberInProject(data.userId, data.projectId)
    log("actualizó al miembro", data.name)
  }

  const deleteMember = async (userId: string) => {
    await fakeRequest()
    const name = getMemberName(userId)
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
    setProjects((prev) => prev.map((p) => ({ ...p, members: p.members.filter((id) => id !== userId) })))
    setTasks((prev) => prev.map((t) => (t.userId === userId ? { ...t, userId: "" } : t)))
    log("eliminó al miembro", name)
  }

  // ----- Tareas -----
  const addTask = async (data: Omit<Task, "id">) => {
    await fakeRequest()
    const id = nextId("T", tasks.map((t) => t.id))
    setTasks((prev) => [...prev, { ...data, id }])
    log("creó la tarea", data.description)
  }

  const updateTask = async (data: Task) => {
    await fakeRequest(500)
    setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)))
    log(data.status === "Completado" ? "completó la tarea" : "actualizó la tarea", data.description)
  }

  const deleteTask = async (id: string) => {
    await fakeRequest()
    const task = tasks.find((t) => t.id === id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
    log("eliminó la tarea", task?.description ?? id)
  }

  // ----- Configuración -----
  const saveSettings = async (data: Settings) => {
    await fakeRequest(1000)
    setSettings(data)
    log("actualizó la", "configuración")
  }

  // ----- Helpers -----
  const getProgress = (projectId: string) => {
    const list = tasks.filter((t) => t.projectId === projectId)
    if (list.length === 0) return 0
    const done = list.filter((t) => t.status === "Completado").length
    return Math.round((done / list.length) * 100)
  }

  const getMemberName = (userId: string) => members.find((m) => m.userId === userId)?.name ?? "Sin asignar"

  const getProjectTitle = (projectId: string) => projects.find((p) => p.id === projectId)?.title ?? "Sin proyecto"

  return (
    <DashboardContext.Provider
      value={{
        loading, projects, members, tasks, settings, activity,
        addProject, updateProject, deleteProject,
        addMember, updateMember, deleteMember,
        addTask, updateTask, deleteTask,
        saveSettings, getProgress, getMemberName, getProjectTitle,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard debe usarse dentro de DashboardProvider")
  return ctx
}