"use client"

import { useEffect, useState } from "react"
import { CheckCircle2Icon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormErrors } from "@/components/FormErrors"
import { defaultSettings, useDashboard } from "@/lib/store"

export function SettingsForm() {
  const { settings, saveSettings } = useDashboard()
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (!saved) return
    const timer = setTimeout(() => setSaved(false), 3000)
    return () => clearTimeout(timer)
  }, [saved])

  const validate = () => {
    const list: string[] = []
    if (!form.companyName.trim()) list.push("Ingresa el nombre de la organización.")
    if (form.userName.trim().length < 3) list.push("El nombre de usuario debe tener al menos 3 caracteres.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) list.push("Ingresa un email válido.")
    return list
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const list = validate()
    setErrors(list)
    setSaved(false)
    if (list.length > 0) return

    setSaving(true)
    await saveSettings(form)
    setSaving(false)
    setSaved(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
        <CardDescription>Administra las preferencias de tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormErrors errors={errors} />

          {saved && (
            <Alert>
              <CheckCircle2Icon />
              <AlertTitle>¡Configuración guardada!</AlertTitle>
              <AlertDescription>Tus preferencias se actualizaron correctamente.</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="s-company">Organización</Label>
              <Input id="s-company" value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="s-user">Nombre de usuario</Label>
              <Input id="s-user" value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="s-email">Email</Label>
              <Input id="s-email" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Idioma</Label>
              <Select value={form.language} onValueChange={(value) => setForm({ ...form, language: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">Inglés</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tareas por página</Label>
              <Select
                value={String(form.itemsPerPage)}
                onValueChange={(value) => setForm({ ...form, itemsPerPage: Number(value) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="s-dark">Modo oscuro</Label>
                <p className="text-xs text-muted-foreground">Cambia la apariencia del dashboard.</p>
              </div>
              <Switch id="s-dark" checked={form.darkMode}
                onCheckedChange={(checked) => setForm({ ...form, darkMode: checked })} />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="s-notif">Notificaciones</Label>
                <p className="text-xs text-muted-foreground">Recibe avisos cuando se asignen tareas.</p>
              </div>
              <Switch id="s-notif" checked={form.notifications}
                onCheckedChange={(checked) => setForm({ ...form, notifications: checked })} />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="s-weekly">Reporte semanal</Label>
                <p className="text-xs text-muted-foreground">Envía un resumen semanal por email.</p>
              </div>
              <Switch id="s-weekly" checked={form.weeklyReport}
                onCheckedChange={(checked) => setForm({ ...form, weeklyReport: checked })} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" disabled={saving}
              onClick={() => { setForm(defaultSettings); setErrors([]) }}>
              Restablecer
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner />}
              {saving ? "Guardando..." : "Guardar configuración"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}