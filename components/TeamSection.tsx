"use client"

import { ReactNode, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { initials } from "@/components/ProjectsSection"
import { Member, useDashboard } from "@/lib/store"

const NO_PROJECT = "none"

const emptyMember = {
  role: "",
  name: "",
  email: "",
  position: "",
  birthdate: "",
  phone: "",
  projectId: NO_PROJECT,
  isActive: true,
}

function MemberForm({ member, trigger }: { member?: Member; trigger: ReactNode }) {
  const { projects, addMember, updateMember } = useDashboard()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [form, setForm] = useState(emptyMember)

  const handleOpenChange = (value: boolean) => {
    if (saving) return
    if (value) {
      setErrors([])
      setForm(member ? { ...member, projectId: member.projectId || NO_PROJECT } : emptyMember)
    }
    setOpen(value)
  }

  const validate = () => {
    const list: string[] = []
    if (form.name.trim().length < 3) list.push("El nombre debe tener al menos 3 caracteres.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) list.push("Ingresa un email válido.")
    if (!form.role) list.push("Selecciona un rol.")
    if (!form.position.trim()) list.push("Ingresa el cargo.")
    if (!form.birthdate) list.push("Selecciona la fecha de nacimiento.")
    if (!/^9\d{8}$/.test(form.phone)) list.push("El teléfono debe tener 9 dígitos y empezar con 9.")
    return list
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const list = validate()
    setErrors(list)
    if (list.length > 0) return

    setSaving(true)
    const data = {
      ...form,
      name: form.name.trim(),
      position: form.position.trim(),
      projectId: form.projectId === NO_PROJECT ? "" : form.projectId,
    }
    if (member) {
      await updateMember({ ...data, userId: member.userId })
    } else {
      await addMember(data)
    }
    setSaving(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{member ? `Editar miembro ${member.userId}` : "Nuevo miembro"}</DialogTitle>
            <DialogDescription>Completa los datos del miembro del equipo.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormErrors errors={errors} />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="m-name">Nombre <span className="text-red-500">*</span></Label>
                <Input id="m-name" placeholder="Nombre completo" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="m-email">Email <span className="text-red-500">*</span></Label>
                <Input id="m-email" type="email" placeholder="correo@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Rol <span className="text-red-500">*</span></Label>
                <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Líder">Líder</SelectItem>
                    <SelectItem value="Desarrollador">Desarrollador</SelectItem>
                    <SelectItem value="Diseñador">Diseñador</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="QA">QA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="m-position">Cargo <span className="text-red-500">*</span></Label>
                <Input id="m-position" placeholder="Frontend Developer" value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Fecha de nacimiento <span className="text-red-500">*</span></Label>
                <DatePicker value={form.birthdate} onChange={(value) => setForm({ ...form, birthdate: value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="m-phone">Teléfono <span className="text-red-500">*</span></Label>
                <Input id="m-phone" placeholder="987654321" maxLength={9} value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Proyecto</Label>
              <Select value={form.projectId} onValueChange={(value) => setForm({ ...form, projectId: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PROJECT}>Sin proyecto</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="m-active">Miembro activo</Label>
                <p className="text-xs text-muted-foreground">Los miembros inactivos no reciben tareas nuevas.</p>
              </div>
              <Switch id="m-active" checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner />}
              {saving ? "Guardando..." : member ? "Guardar Cambios" : "Agregar Miembro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const PAGE_SIZE = 4

export function TeamSection() {
  const { members, deleteMember, getProjectTitle } = useDashboard()
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = members.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
        </div>
        <MemberForm trigger={<Button>+ Nuevo miembro</Button>} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visible.map((member) => (
            <div key={member.userId} className="flex flex-col gap-3 p-4 border rounded-lg md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{initials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {member.name} <span className="text-xs text-muted-foreground">({member.userId})</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{member.position} · {member.role}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email} · {member.phone} · Nac. {formatDate(member.birthdate)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Proyecto: {member.projectId ? getProjectTitle(member.projectId) : "Sin proyecto"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.isActive ? "default" : "secondary"}>
                  {member.isActive ? "Activo" : "Inactivo"}
                </Badge>
                <MemberForm member={member} trigger={<Button size="sm" variant="outline">Editar</Button>} />
                <ConfirmDelete
                  title="Eliminar miembro"
                  description={`¿Seguro que deseas eliminar a ${member.name}? Sus tareas quedarán sin asignar.`}
                  onConfirm={() => deleteMember(member.userId)}
                  trigger={<Button size="sm" variant="destructive">Eliminar</Button>}
                />
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-center text-muted-foreground py-6">No hay miembros registrados.</p>
          )}
        </div>
        {members.length > PAGE_SIZE && (
          <PaginationBar page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        )}
      </CardContent>
    </Card>
  )
}