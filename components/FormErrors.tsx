import { AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Muestra los errores de validación de un formulario con el componente Alert
export function FormErrors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Revisa el formulario</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-4">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}