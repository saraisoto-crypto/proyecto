"use client"

import { ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
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

type ConfirmDeleteProps = {
  title: string
  description: string
  onConfirm: () => Promise<void>
  trigger: ReactNode
}

// Diálogo reutilizable para confirmar eliminaciones
export function ConfirmDelete({ title, description, onConfirm, trigger }: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !deleting && setOpen(value)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={deleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting && <Spinner />}
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}