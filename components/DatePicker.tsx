"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// "2026-11-15" -> Date
export function toDate(value: string) {
  if (!value) return undefined
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, m - 1, d)
}

// Date -> "2026-11-15"
export function toDateString(date?: Date) {
  if (!date) return ""
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${m}-${d}`
}

// "2026-11-15" -> "15 nov 2026"
export function formatDate(value: string) {
  const date = toDate(value)
  if (!date) return "—"
  return date.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })
}

type DatePickerProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function DatePicker({ id, value, onChange, placeholder = "Selecciona una fecha" }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button id={id} type="button" variant="outline" className="w-full justify-start font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDate(value) : <span className="text-muted-foreground">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={toDate(value)}
          defaultMonth={toDate(value)}
          captionLayout="dropdown"
          startMonth={new Date(1960, 0)}
          endMonth={new Date(2035, 11)}
          onSelect={(date) => {
            onChange(toDateString(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}