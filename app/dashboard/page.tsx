"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TasksTable"
import { ProjectsSection } from "@/components/ProjectsSection"
import { TeamSection } from "@/components/TeamSection"
import { SettingsForm } from "@/components/SettingsForm"
import { OverviewSection } from "@/components/OverviewSection"
import { DashboardProvider, useDashboard } from "@/lib/store"

const tabClass =
  "rounded-xl px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white data-[state=active]:shadow-md"

function Dashboard() {
  const { loading, settings } = useDashboard()

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-slate-950 dark:via-slate-950 dark:to-violet-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header con imagen */}
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600"
            alt="Equipo de trabajo"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-700/95 via-violet-600/85 to-fuchsia-500/60" />
          <div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-end md:justify-between md:p-10">
            <div className="text-white">
              <p className="text-sm font-medium uppercase tracking-widest text-violet-200">
                {settings.companyName}
              </p>
              <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Dashboard de Proyectos</h1>
              <p className="mt-2 max-w-xl text-violet-100">
                Hola, {settings.userName}. Gestiona tus proyectos, equipo y tareas con shadcn/ui.
              </p>
            </div>
            <ProjectForm
              trigger={
                <Button size="lg" className="bg-white text-violet-700 shadow-lg hover:bg-violet-50">
                  + Nuevo Proyecto
                </Button>
              }
            />
          </div>
        </div>

        {loading ? (
          // Simula la carga de datos desde el backend
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
            <Spinner className="size-8 text-primary" />
            <p>Cargando datos del servidor...</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="h-auto flex-wrap gap-1 rounded-2xl bg-white/80 p-1.5 shadow-md backdrop-blur dark:bg-slate-900/70">
              <TabsTrigger value="overview" className={tabClass}>Resumen</TabsTrigger>
              <TabsTrigger value="projects" className={tabClass}>Proyectos</TabsTrigger>
              <TabsTrigger value="team" className={tabClass}>Equipo</TabsTrigger>
              <TabsTrigger value="tasks" className={tabClass}>Tareas</TabsTrigger>
              <TabsTrigger value="settings" className={tabClass}>Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewSection />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsSection />
            </TabsContent>

            <TabsContent value="team">
              <TeamSection />
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Tareas</CardTitle>
                  <CardDescription>Administra todas las tareas de tus proyectos</CardDescription>
                </CardHeader>
                <CardContent>
                  <TasksTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <SettingsForm />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}