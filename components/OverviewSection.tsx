"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { initials } from "@/components/ProjectsSection"
import { useDashboard } from "@/lib/store"

const timeAgo = (time: number) => {
  const minutes = Math.floor((Date.now() - time) / 60000)
  if (minutes < 1) return "Hace un momento"
  if (minutes < 60) return `Hace ${minutes} min`
  return `Hace ${Math.floor(minutes / 60)} h`
}

type StatCardProps = {
  title: string
  value: string
  detail: string
  gradient: string
  icon: React.ReactNode
}

// Tarjeta de métrica con degradado de color
function StatCard({ title, value, detail, gradient, icon }: StatCardProps) {
  return (
    <Card className={`relative overflow-hidden border-0 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${gradient}`}>
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15" />
      <div className="absolute -bottom-10 -right-2 h-24 w-24 rounded-full bg-white/10" />
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/90">{title}</CardTitle>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur">{icon}</div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-4xl font-extrabold">{value}</div>
        <p className="mt-1 text-xs text-white/80">{detail}</p>
      </CardContent>
    </Card>
  )
}

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: "2",
  className: "h-5 w-5 text-white",
}

const statusColors: Record<string, string> = {
  Pendiente: "bg-gradient-to-r from-amber-400 to-orange-500",
  "En progreso": "bg-gradient-to-r from-sky-400 to-blue-600",
  Completado: "bg-gradient-to-r from-emerald-400 to-green-600",
}

const statusDot: Record<string, string> = {
  Pendiente: "bg-amber-500",
  "En progreso": "bg-sky-500",
  Completado: "bg-emerald-500",
}

const avatarColors = [
  "bg-violet-500",
  "bg-pink-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
]

export function OverviewSection() {
  const { projects, members, tasks, activity, getProgress } = useDashboard()

  // Métricas calculadas con los datos en memoria
  const completedProjects = projects.filter((p) => p.status === "Completado").length
  const completedTasks = tasks.filter((t) => t.status === "Completado").length
  const taskPercent = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0
  const activeMembers = members.filter((m) => m.isActive).length
  const avgProgress = projects.length
    ? Math.round(projects.reduce((acc, p) => acc + getProgress(p.id), 0) / projects.length)
    : 0

  const byStatus = ["Pendiente", "En progreso", "Completado"].map((status) => {
    const count = tasks.filter((t) => t.status === status).length
    return { status, count, percent: tasks.length ? Math.round((count / tasks.length) * 100) : 0 }
  })

  // Top 3 proyectos por progreso
  const topProjects = [...projects]
    .map((p) => ({ ...p, progress: getProgress(p.id) }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Proyectos"
          value={String(projects.length)}
          detail={`${completedProjects} completados`}
          gradient="bg-gradient-to-br from-violet-500 to-purple-700"
          icon={
            <svg {...iconProps}>
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          }
        />
        <StatCard
          title="Tareas Completadas"
          value={`${completedTasks}/${tasks.length}`}
          detail={`${taskPercent}% del total de tareas`}
          gradient="bg-gradient-to-br from-emerald-400 to-teal-600"
          icon={
            <svg {...iconProps}>
              <path d="M20 6 9 17l-5-5" />
            </svg>
          }
        />
        <StatCard
          title="Progreso Promedio"
          value={`${avgProgress}%`}
          detail="Según tareas completadas"
          gradient="bg-gradient-to-br from-pink-500 to-rose-600"
          icon={
            <svg {...iconProps}>
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          }
        />
        <StatCard
          title="Miembros Activos"
          value={`${activeMembers}`}
          detail={`de ${members.length} miembros registrados`}
          gradient="bg-gradient-to-br from-amber-400 to-orange-600"
          icon={
            <svg {...iconProps}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Tareas por Estado</CardTitle>
            <CardDescription>Distribución actual de las tareas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {byStatus.map((item) => (
              <div key={item.status}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span className={`h-2.5 w-2.5 rounded-full ${statusDot[item.status]}`} />
                    {item.status}
                  </span>
                  <span className="text-muted-foreground">{item.count} ({item.percent}%)</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${statusColors[item.status]}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Proyectos Destacados</CardTitle>
            <CardDescription>Los más avanzados del momento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProjects.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 rounded-xl border p-3 transition hover:bg-muted/50">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg font-bold text-white ${avatarColors[i]}`}>
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.title}</p>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                <Badge variant="secondary">{p.progress}%</Badge>
              </div>
            ))}
            {topProjects.length === 0 && <p className="text-sm text-muted-foreground">No hay proyectos.</p>}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.slice(0, 5).map((item, i) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className={`${avatarColors[i % avatarColors.length]} text-white`}>
                      {initials(item.user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      <span className="font-medium">{item.user}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>{" "}
                      <span className="font-medium">{item.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo(item.time)}</p>
                  </div>
                </div>
              ))}
              {activity.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 text-2xl">
                    ✨
                  </div>
                  <p className="text-sm font-medium">Todo tranquilo por aquí</p>
                  <p className="text-xs text-muted-foreground">
                    Crea, edita o elimina proyectos, miembros o tareas y aparecerán aquí.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}