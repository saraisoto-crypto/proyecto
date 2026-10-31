"use client"

import { ReactNode, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker, formatDate } from "@/components/DatePicker"
import { FormErrors } from "@/components/FormErrors"
import { ConfirmDelete } from "@/components/ConfirmDelete"
import { PaginationBar } from "@/components/PaginationBar"
import { Task, useDashboard } from "@/lib/store"

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    case "Pendiente":
      return "outline"
    default:
      return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "destructive"
    case "Alta":
      return "default"
    case "Media":
      return "secondary"
    case "Baja":
      return "outline"
    default:
      return "outline"
  }
}

const emptyTask = {
  description: "",
  projectId: "",
  status: "Pendiente",
  priority: "",
  userId: "",
  dateline: "",
}

function TaskForm({ task, trigger }: { task?: Task; trigger: ReactNode }) {
  const { projects, members, addTask, updateTask } = useDashboard()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [form, setForm] = useState(emptyTask)

  // Solo se asignan tareas a miembros activos (o al que ya la tenía)
  const assignable = members.filter((m) => m.isActive || m.userId === task?.userId)

  const handleOpenChange = (value: boolean) => {
    if (saving) return
    if (value) {
      setErrors([])
      setForm(task ? { ...task } : emptyTask)
    }
    setOpen(value)
  }

  const validate = () => {
    const list: string[] = []
    if (form.description.trim().length < 5) list.push("La descripción debe tener al menos 5 caracteres.")
    if (!form.projectId) list.push("Selecciona un proyecto.")
    if (!form.priority) list.push("Selecciona una prioridad.")
    if (!form.userId) list.push("Asigna la tarea a un miembro.")
    if (!form.dateline) list.push("Selecciona la fecha límite.")
    return list
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const list = validate()
    setErrors(list)
    if (list.length > 0) return

    setSaving(true)
    const data = { ...form, description: form.description.trim() }
    if (task) {
      await updateTask({ ...data, id: task.id })
    } else {
      await addTask(data)
    }
    setSaving(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? `Editar tarea ${task.id}` : "Nueva tarea"}</DialogTitle>
            <DialogDescription>Completa la información de la tarea.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormErrors errors={errors} />

            <div className="grid gap-2">
              <Label htmlFor="t-description">Descripción <span className="text-red-500">*</span></Label>
              <Input id="t-description" placeholder="Ej. Implementar login" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="grid gap-2">
              <Label>Proyecto <span className="text-red-500">*</span></Label>
              <Select value={form.projectId} onValueChange={(value) => setForm({ ...form, projectId: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En progreso">En progreso</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Prioridad <span className="text-red-500">*</span></Label>
                <Select value={form.priority} onValueChange={(value) => setForm({ ...form, priority: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Asignado a <span className="text-red-500">*</span></Label>
                <Select value={form.userId} onValueChange={(value) => setForm({ ...form, userId: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignable.map((m) => (
                      <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Fecha límite <span className="text-red-500">*</span></Label>
                <DatePicker value={form.dateline} onChange={(value) => setForm({ ...form, dateline: value })} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner />}
              {saving ? "Guardando..." : task ? "Guardar Cambios" : "Crear Tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function TasksTable() {
  const { tasks, settings, updateTask, deleteTask, getMemberName, getProjectTitle } = useDashboard()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState("all")
  const [toggling, setToggling] = useState<string | null>(null)

  const pageSize = settings.itemsPerPage
  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter)
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Marcar / desmarcar como completada con el checkbox
  const toggleDone = async (task: Task, checked: boolean) => {
    setToggling(task.id)
    await updateTask({ ...task, status: checked ? "Completado" : "Pendiente" })
    setToggling(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={filter}
          onValueChange={(value) => {
            setFilter(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="En progreso">En progreso</SelectItem>
            <SelectItem value="Completado">Completado</SelectItem>
          </SelectContent>
        </Select>
        <TaskForm trigger={<Button>+ Nueva tarea</Button>} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Mostrando {visible.length} de {filtered.length} tareas
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Hecha</TableHead>
              <TableHead>Tarea</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  {toggling === task.id ? (
                    <Spinner />
                  ) : (
                    <Checkbox
                      checked={task.status === "Completado"}
                      onCheckedChange={(checked) => toggleDone(task, checked === true)}
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{task.description}</TableCell>
                <TableCell>{getProjectTitle(task.projectId)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                </TableCell>
                <TableCell>{getMemberName(task.userId)}</TableCell>
                <TableCell>{formatDate(task.dateline)}</TableCell>
                <TableCell className="text-right space-x-1">
                  <TaskForm task={task} trigger={<Button variant="ghost" size="sm">Editar</Button>} />
                  <ConfirmDelete
                    title="Eliminar tarea"
                    description={`¿Seguro que deseas eliminar "${task.description}"?`}
                    onConfirm={() => deleteTask(task.id)}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Eliminar
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                  No hay tareas para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationBar page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}