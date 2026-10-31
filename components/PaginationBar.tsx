"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"

type PaginationBarProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Paginación reutilizable con el componente Pagination de shadcn/ui
export function PaginationBar({ page, totalPages, onPageChange }: PaginationBarProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const goTo = (e: React.MouseEvent, value: number) => {
    e.preventDefault()
    if (value >= 1 && value <= totalPages) onPageChange(value)
  }

  return (
    <Pagination className="pt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            href="#"
            size="default"
            onClick={(e) => goTo(e, page - 1)}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Anterior
          </PaginationLink>
        </PaginationItem>

        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href="#" isActive={p === page} onClick={(e) => goTo(e, p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink
            href="#"
            size="default"
            onClick={(e) => goTo(e, page + 1)}
            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
          >
            Siguiente
            <ChevronRightIcon className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}