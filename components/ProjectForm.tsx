"use client"

import { ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { DatePicker } from "@/components/DatePicker"
import { FormErrors } from "@/components/FormErrors"
import { Project, useDashboard } from "@/lib/store"

type ProjectFormProps = {
  project?: Project // si viene, el formulario edita
  trigger?: ReactNode
}

const emptyForm = {
  name: "",
  description: "",
  category: "",
  priority: "",
  status: "Planificado",
  deadline: "",
  members: [] as string[],
}

export function ProjectForm({ project, trigger }: ProjectFormProps) {
  const { members, addProject, updateProject } = useDashboard()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [formData, setFormData] = useState(emptyForm)

  const isEdit = Boolean(project)

  const handleOpenChange = (value: boolean) => {
    if (saving) return
    if (value) {
      setErrors([])
      setFormData(
        project
          ? {
              name: project.title,
              description: project.description,
              category: project.category,
              priority: project.priority,
              status: project.status,
              deadline: project.deadline,
              members: project.members,
            }
          : emptyForm
      )
    }
    setOpen(value)
  }

  const toggleMember = (userId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      members: checked ? [...prev.members, userId] : prev.members.filter((id) => id !== userId),
    }))
  }

  const validate = () => {
    const list: string[] = []
    if (formData.name.trim().length < 3) list.push("El nombre debe tener al menos 3 caracteres.")
    if (!formData.category) list.push("Selecciona una categoría.")
    if (!formData.priority) list.push("Selecciona una prioridad.")
    if (!formData.deadline) list.push("Selecciona la fecha de entrega.")
    if (formData.members.length === 0) list.push("Agrega al menos un miembro del equipo.")
    return list
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const list = validate()
    setErrors(list)
    if (list.length > 0) return

    setSaving(true)
    const data = {
      title: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      deadline: formData.deadline,
      members: formData.members,
    }
    if (project) {
      await updateProject({ ...data, id: project.id })
    } else {
      await addProject(data)
    }
    setSaving(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Nuevo Proyecto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Click en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormErrors errors={errors} />

            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Mi Proyecto Increíble"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Breve descripción del proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Desarrollo Web</SelectItem>
                    <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
                    <SelectItem value="design">Diseño</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>
                  Prioridad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planificado">Planificado</SelectItem>
                    <SelectItem value="En progreso">En progreso</SelectItem>
                    <SelectItem value="En revisión">En revisión</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>
                  Fecha de entrega <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  value={formData.deadline}
                  onChange={(value) => setFormData({ ...formData, deadline: value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>
                Miembros del equipo <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2 rounded-md border p-3">
                {members.map((member) => (
                  <label key={member.userId} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={formData.members.includes(member.userId)}
                      onCheckedChange={(checked) => toggleMember(member.userId, checked === true)}
                    />
                    {member.name}
                  </label>
                ))}
                {members.length === 0 && (
                  <p className="text-sm text-muted-foreground">No hay miembros registrados.</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner />}
              {saving ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}