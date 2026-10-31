# 📊 Dashboard de Proyectos — shadcn/ui

Laboratorio **GLAB-S11 – Componentes y Estilización**
Curso: **Desarrollo de Aplicaciones Web Avanzado** · Tecsup
Docente: Edwin William Arévalo Sermeño
Alumna: **Sarai Sthefanie Soto López**

🔗 **Demo en Vercel:** https://dashboard-shadcn-soto.vercel.app/dashboard

---

## 🚀 Tecnologías

- **Next.js 16** con App Router y Turbopack
- **React** y **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** con Radix UI
- **lucide-react** para íconos

## 🧩 Componentes de shadcn/ui utilizados

| Componente | Uso en el proyecto |
|---|---|
| **Spinner** | Simula peticiones al backend al cargar, guardar y eliminar |
| **Alert** | Muestra validaciones de formularios y mensajes de éxito |
| **Calendar** | Selección de fechas de entrega, nacimiento y fecha límite |
| **Pagination** | Paginación de tareas y miembros del equipo |
| Card, Tabs, Dialog, Select, Input, Label, Badge, Avatar, Switch, Table, Checkbox, Popover, Button | Estructura y formularios del dashboard |

## ✨ Funcionalidades

### 📈 Resumen
- Métricas calculadas en tiempo real con los datos en memoria
- Tareas por estado, proyectos destacados y actividad reciente

### 📁 Proyectos
- Crear y editar proyectos con selección de miembros del equipo
- Ver detalles: equipo, tareas, progreso y fecha de entrega
- Eliminar proyectos con confirmación

### 👥 Equipo
- CRUD completo de miembros
- Campos: `userId`, `role`, `name`, `email`, `position`, `birthdate`, `phone`, `projectId`, `isActive`

### ✅ Tareas
- CRUD completo de tareas con paginación y filtro por estado
- Campos: `description`, `projectId`, `status`, `priority`, `userId`, `dateline`
- Marcar tareas como completadas desde la tabla

### ⚙️ Configuración
- Formulario con organización, usuario, email, idioma y tareas por página
- Modo oscuro, notificaciones y reporte semanal
- Guardado simulado con Spinner y Alert de confirmación

### 🎨 Tema
- Tema personalizado en color violeta con soporte para modo oscuro

## 📂 Estructura
