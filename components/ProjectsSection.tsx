"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProjectForm } from "@/components/ProjectForm"
import { ConfirmDelete } from "@/components/ConfirmDelete"
import { formatDate } from "@/components/DatePicker"
import { Project, categoryLabels, priorityLabels, useDashboard } from "@/lib/store"

export const projectStatusVariant = (status: string) =>
  status === "Completado" ? "default" : status === "En revisión" ? "secondary" : "outline"

export const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

function ProgressBar({ value }: { value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-muted-foreground">Progreso</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function ProjectDetails({ project }: { project: Project }) {
  const { members, tasks, getProgress, getMemberName } = useDashboard()
  const team = members.filter((m) => project.members.includes(m.userId))
  const projectTasks = tasks.filter((t) => t.projectId === project.id)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          Ver detalles
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{project.title}</DialogTitle>
            <Badge variant={projectStatusVariant(project.status)}>{project.status}</Badge>
          </div>
          <DialogDescription>{project.description || "Sin descripción"}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Código</p>
              <p className="font-medium">{project.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Categoría</p>
              <p className="font-medium">{categoryLabels[project.category] ?? project.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Prioridad</p>
              <p className="font-medium">{priorityLabels[project.priority] ?? project.priority}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha de entrega</p>
              <p className="font-medium">{formatDate(project.deadline)}</p>
            </div>
          </div>

          <ProgressBar value={getProgress(project.id)} />

          <div>
            <p className="text-sm font-medium mb-2">Equipo ({team.length})</p>
            <div className="space-y-2">
              {team.map((m) => (
                <div key={m.userId} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials(m.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.position}</p>
                  </div>
                </div>
              ))}
              {team.length === 0 && <p className="text-sm text-muted-foreground">Sin miembros asignados.</p>}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Tareas ({projectTasks.length})</p>
            <div className="space-y-2">
              {projectTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {getMemberName(t.userId)} · {formatDate(t.dateline)}
                    </p>
                  </div>
                  <Badge variant={t.status === "Completado" ? "default" : "outline"}>{t.status}</Badge>
                </div>
              ))}
              {projectTasks.length === 0 && <p className="text-sm text-muted-foreground">Sin tareas registradas.</p>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ProjectsSection() {
  const { projects, deleteProject, getProgress } = useDashboard()

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No hay proyectos. Crea uno con el botón &quot;Nuevo Proyecto&quot;.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </div>
              <Badge variant={projectStatusVariant(project.status)}>{project.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ProgressBar value={getProgress(project.id)} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {project.members.length} miembros
                </div>
                <ProjectDetails project={project} />
              </div>
              <div className="flex gap-2 pt-1">
                <ProjectForm
                  project={project}
                  trigger={
                    <Button size="sm" variant="outline" className="flex-1">
                      Editar
                    </Button>
                  }
                />
                <ConfirmDelete
                  title="Eliminar proyecto"
                  description={`¿Seguro que deseas eliminar "${project.title}"? También se eliminarán sus tareas.`}
                  onConfirm={() => deleteProject(project.id)}
                  trigger={
                    <Button size="sm" variant="destructive" className="flex-1">
                      Eliminar
                    </Button>
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}