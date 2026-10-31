"use client"

import { useState } from "react"

const marcas = ["Toyota", "Hyundai", "Kia", "Nissan", "Chevrolet", "Suzuki", "Mazda", "Volkswagen"]
const anios = Array.from({ length: 16 }, (_, i) => String(2026 - i))

const pasos = [
  { n: "01", t: "Cotiza en línea", d: "Ingresa los datos de tu auto y recibe una oferta estimada en menos de 2 minutos." },
  { n: "02", t: "Inspección gratis", d: "Agenda una revisión de 30 minutos en nuestra sede o en la puerta de tu casa." },
  { n: "03", t: "Recibe tu pago", d: "Firmamos los documentos y te depositamos el mismo día. Sin vueltas." },
]

const beneficios = [
  { icon: "⚡", t: "Pago en 24 horas", d: "Transferencia inmediata a tu cuenta apenas firmes." },
  { icon: "🛡️", t: "Trámites incluidos", d: "Nos encargamos de la transferencia notarial y SUNARP." },
  { icon: "💰", t: "Precio justo", d: "Ofertas basadas en datos reales del mercado peruano." },
  { icon: "🚗", t: "Cualquier estado", d: "Compramos autos con deudas, choques leves o kilometraje alto." },
]

const faqs = [
  { q: "¿Cuánto demora todo el proceso?", a: "Desde la cotización hasta el pago, normalmente menos de 24 horas." },
  { q: "¿Tiene algún costo la inspección?", a: "No. La inspección es totalmente gratuita y sin compromiso." },
  { q: "¿Compran autos financiados?", a: "Sí. Cancelamos la deuda con el banco y te entregamos la diferencia." },
  { q: "¿Qué documentos necesito?", a: "Tu DNI, la tarjeta de propiedad y el SOAT vigente." },
]

const galeria = [
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
]

export default function AutosPage() {
  const [form, setForm] = useState({ marca: "", modelo: "", anio: "", km: "", nombre: "", telefono: "", email: "" })
  const [errores, setErrores] = useState<string[]>([])
  const [cargando, setCargando] = useState(false)
  const [oferta, setOferta] = useState<number | null>(null)
  const [faqAbierta, setFaqAbierta] = useState<number | null>(0)

  const cambiar = (campo: string, valor: string) => setForm({ ...form, [campo]: valor })

  const cotizar = (e: React.FormEvent) => {
    e.preventDefault()
    const lista: string[] = []
    if (!form.marca) lista.push("Selecciona la marca")
    if (form.modelo.trim().length < 2) lista.push("Ingresa el modelo")
    if (!form.anio) lista.push("Selecciona el año")
    if (!form.km || Number(form.km) < 0) lista.push("Ingresa el kilometraje")
    if (form.nombre.trim().length < 3) lista.push("Ingresa tu nombre")
    if (!/^9\d{8}$/.test(form.telefono)) lista.push("Teléfono de 9 dígitos")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) lista.push("Email válido")
    setErrores(lista)
    if (lista.length) return

    setCargando(true)
    setOferta(null)
    setTimeout(() => {
      const base = 65000 - (2026 - Number(form.anio)) * 3500 - Number(form.km) * 0.05
      setOferta(Math.max(8000, Math.round(base / 100) * 100))
      setCargando(false)
    }, 1500)
  }

  const input =
    "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none transition focus:border-emerald-400 focus:bg-white/15 focus:ring-2 focus:ring-emerald-400/30"

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950">A</span>
            Auto<span className="text-emerald-400">Ya</span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#como" className="transition hover:text-white">Cómo funciona</a>
            <a href="#beneficios" className="transition hover:text-white">Beneficios</a>
            <a href="#faq" className="transition hover:text-white">Preguntas</a>
          </div>
          <a href="#cotizar" className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/30">
            Cotizar ahora
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section id="cotizar" className="relative overflow-hidden pt-28 pb-20">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920"
          alt="Auto deportivo"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              +2,500 autos comprados en Lima
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Vende tu auto <br />
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                hoy mismo.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/70">
              Recibe una oferta al instante, inspección gratuita y el pago en tu cuenta en menos de 24 horas.
            </p>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {[["24h", "Pago"], ["0%", "Comisión"], ["4.9★", "Calificación"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-3xl font-bold text-white">{v}</p>
                  <p className="text-sm text-white/50">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <h2 className="text-2xl font-bold">Cotiza tu auto gratis</h2>
            <p className="mt-1 text-sm text-white/60">Completa los datos y recibe tu oferta estimada.</p>

            <form onSubmit={cotizar} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <select className={input} value={form.marca} onChange={(e) => cambiar("marca", e.target.value)}>
                  <option value="" className="text-slate-900">Marca</option>
                  {marcas.map((m) => <option key={m} className="text-slate-900">{m}</option>)}
                </select>
                <input className={input} placeholder="Modelo" value={form.modelo} onChange={(e) => cambiar("modelo", e.target.value)} />
                <select className={input} value={form.anio} onChange={(e) => cambiar("anio", e.target.value)}>
                  <option value="" className="text-slate-900">Año</option>
                  {anios.map((a) => <option key={a} className="text-slate-900">{a}</option>)}
                </select>
                <input className={input} type="number" placeholder="Kilometraje" value={form.km} onChange={(e) => cambiar("km", e.target.value)} />
              </div>
              <input className={input} placeholder="Nombre completo" value={form.nombre} onChange={(e) => cambiar("nombre", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input className={input} placeholder="Celular" maxLength={9} value={form.telefono} onChange={(e) => cambiar("telefono", e.target.value.replace(/\D/g, ""))} />
                <input className={input} type="email" placeholder="Email" value={form.email} onChange={(e) => cambiar("email", e.target.value)} />
              </div>

              {errores.length > 0 && (
                <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                  Completa: {errores.join(", ")}.
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 py-3.5 font-bold text-slate-950 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-400/30 disabled:opacity-70"
              >
                {cargando && <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />}
                {cargando ? "Calculando oferta..." : "Obtener mi oferta →"}
              </button>
            </form>

            {oferta && (
              <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-center">
                <p className="text-sm text-emerald-200">Oferta estimada para tu {form.marca} {form.modelo} {form.anio}</p>
                <p className="mt-1 text-4xl font-extrabold text-emerald-300">S/ {oferta.toLocaleString("es-PE")}</p>
                <p className="mt-2 text-xs text-white/50">Un asesor te llamará para agendar la inspección.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como" className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-emerald-400">Proceso simple</p>
        <h2 className="mt-3 text-center text-4xl font-bold">Así de fácil es vender</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pasos.map((p) => (
            <div key={p.n} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-8 transition hover:-translate-y-1 hover:border-emerald-400/40">
              <span className="text-6xl font-black text-white/5 transition group-hover:text-emerald-400/20">{p.n}</span>
              <h3 className="mt-4 text-xl font-bold">{p.t}</h3>
              <p className="mt-2 text-white/60">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFICIOS CON IMAGEN */}
      <section id="beneficios" className="bg-gradient-to-b from-slate-900 to-slate-950 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1000"
              alt="Auto en carretera"
              className="h-[480px] w-full rounded-3xl object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-4 rounded-2xl border border-white/10 bg-slate-900/90 p-5 shadow-xl backdrop-blur md:-right-8">
              <p className="text-sm text-white/60">Pagado hoy</p>
              <p className="text-2xl font-bold text-emerald-400">S/ 1.2M</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">¿Por qué elegirnos?</p>
            <h2 className="mt-3 text-4xl font-bold">Vender tu auto nunca fue tan tranquilo</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {beneficios.map((b) => (
                <div key={b.t} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
                  <span className="text-3xl">{b.icon}</span>
                  <h3 className="mt-3 font-bold">{b.t}</h3>
                  <p className="mt-1 text-sm text-white/60">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-4xl font-bold">Compramos todo tipo de autos</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {galeria.map((src, i) => (
            <div key={src} className="group overflow-hidden rounded-3xl">
              <img
                src={src}
                alt={`Auto ${i + 1}`}
                className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="text-center text-4xl font-bold">Preguntas frecuentes</h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <button
                onClick={() => setFaqAbierta(faqAbierta === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left font-semibold"
              >
                {f.q}
                <span className={`text-emerald-400 transition ${faqAbierta === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {faqAbierta === i && <p className="px-6 pb-5 text-white/60">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-400 to-cyan-400 p-12 text-center text-slate-950 md:p-16">
          <h2 className="text-4xl font-extrabold md:text-5xl">¿Listo para vender?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-900/80">
            Cotiza gratis en 2 minutos y recibe tu dinero mañana.
          </p>
          <a href="#cotizar" className="mt-8 inline-block rounded-full bg-slate-950 px-8 py-4 font-bold text-white transition hover:scale-105">
            Cotizar mi auto
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-white/40">
        © 2026 AutoYa · Lima, Perú · Todos los derechos reservados
      </footer>
    </div>
  )
}