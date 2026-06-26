import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

/* ─── Shared layout wrapper ─────────────────────────────────── */
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full max-w-300 mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Data ─────────────────────────────────────────────────── */

const services = [
  {
    slug: "cv",
    name: "CV professionnel",
    description: "Un CV moderne et convaincant, adapté au marché algérien. Format ATS-friendly.",
    price: 500,
    active: true,
    badge: "Populaire",
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className="text-emerald-700">
        <rect x="3" y="2" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 7h8M7 11h8M7 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    slug: "facture",
    name: "Facture",
    description: "Format légal algérien avec NIF, RC, TVA et calculs automatiques.",
    price: 300,
    active: true,
    badge: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className="text-emerald-700">
        <path d="M4 3h14a1 1 0 0 1 1 1v15l-2-1.5L15 19l-2-1.5L11 19l-2-1.5L7 19l-2 1.5V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 8h6M8 11h6M8 14h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    slug: "visa",
    name: "Dossier visa",
    description: "Préparation complète de votre dossier de demande de visa.",
    price: null,
    active: false,
    badge: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className="text-ink-500">
        <rect x="2" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="8" cy="11.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13 9h4M13 12h4M13 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    slug: "auto-entrepreneur",
    name: "Auto-entrepreneur",
    description: "Tout le dossier pour votre carte d'auto-entrepreneur.",
    price: null,
    active: false,
    badge: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className="text-ink-500">
        <rect x="3" y="7" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 7V5a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="11" cy="13" r="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

const steps = [
  {
    number: "01",
    title: "Remplir le formulaire",
    description: "Complétez notre formulaire guidé en quelques minutes, depuis n'importe quel appareil.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-700">
        <path d="M11 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L13 14l-4 1 1-4 8.5-8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: "02",
    title: "Payer en ligne",
    description: "Réglez en toute sécurité par CIB ou Edahabia. Votre paiement est protégé.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-700">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: "03",
    title: "Recevoir le document",
    description: "Votre document est prêt. Téléchargez-le ou recevez-le directement sur WhatsApp.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-700">
        <path d="M12 16V4M12 16l-4-4M12 16l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const trustStats = [
  {
    value: "500+",
    label: "Documents livrés",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-emerald-700">
        <path d="M4 4h8l4 4v8H4V4z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M12 4v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: "< 24h",
    label: "Délai de livraison",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-emerald-700">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M10 6v4.5l3 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    value: "100%",
    label: "Satisfait ou refait",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-emerald-700">
        <path d="M4 10.5l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "Amine B.",
    role: "Ingénieur, Alger",
    text: "J'ai reçu mon CV en moins de 12h, très professionnel. Le design est moderne et j'ai décroché un entretien la semaine suivante.",
  },
  {
    name: "Sara K.",
    role: "Gérante, Oran",
    text: "La facture était parfaite du premier coup, avec tous les éléments légaux. Gain de temps énorme — je n'ai plus besoin de faire la queue.",
  },
];

/* ─── Section heading ───────────────────────────────────────── */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-14">
      <p className="text-emerald-700 text-xs font-semibold uppercase tracking-widest mb-2.5">
        {eyebrow}
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-ink-900 mb-2 tracking-tight">
        {title}
      </h2>
      <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto">{subtitle}</p>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full">

        {/* ── Hero ──────────────────────────────────────── */}
        <section className="relative w-full bg-white overflow-hidden py-12 md:py-20">
          {/* Dot grid — contained */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #E2E8F0 1px, transparent 0)",
              backgroundSize: "32px 32px",
              opacity: 0.45,
            }}
          />
          {/* Glow — fully contained by section overflow-hidden */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 w-80 h-80 md:w-125 md:h-125 translate-x-1/3 -translate-y-1/3 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(14,124,90,0.09) 0%, transparent 65%)" }}
          />

          <Container className="relative text-center">
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5 md:mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse shrink-0" />
              Service en ligne · Algérie
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-ink-900 leading-tight md:leading-[1.15] max-w-3xl mx-auto mb-4 md:mb-5 tracking-tight">
              Vos documents administratifs prêts,{" "}
              <span className="text-emerald-700">depuis chez vous.</span>
            </h1>

            <p className="text-slate-600 text-sm md:text-lg max-w-md mx-auto mb-7 md:mb-10 leading-relaxed">
              CV, facture, et bientôt bien plus — préparés par des professionnels
              et livrés en moins de 24h.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-8 md:mb-14">
              <Link
                href="/#services"
                className="flex items-center justify-center gap-2 bg-emerald-700 text-white px-6 py-3.5 md:py-4 rounded-xl font-semibold text-sm md:text-base hover:bg-emerald-500 active:scale-[.98] transition-all duration-200"
              >
                Commander maintenant
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href="/#how-it-works"
                className="flex items-center justify-center gap-1.5 text-ink-700 font-semibold text-sm md:text-base py-3.5 hover:text-ink-900 transition-colors duration-200"
              >
                Comment ça marche
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* Stats strip — flex on all sizes, no overflow */}
            <div className="flex justify-center">
              <div className="inline-grid grid-cols-3 divide-x divide-border rounded-2xl border border-border overflow-hidden bg-white shadow-sm w-full max-w-sm sm:w-auto">
                {[
                  { value: "500+", label: "Documents livrés" },
                  { value: "24h", label: "Délai moyen" },
                  { value: "100%", label: "Satisfait ou refait" },
                ].map((s) => (
                  <div key={s.label} className="px-3 sm:px-7 py-3.5 text-center">
                    <p className="text-base sm:text-xl font-semibold text-ink-900">{s.value}</p>
                    <p className="text-[10px] sm:text-xs text-ink-500 mt-0.5 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── Services ──────────────────────────────────── */}
        <section id="services" className="w-full bg-white py-14 md:py-24">
          <Container>
            <SectionHeading
              eyebrow="Catalogue"
              title="Nos services"
              subtitle="Des documents professionnels livrés rapidement — sans se déplacer."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {services.map((service) =>
                service.active ? (
                  <div
                    key={service.slug}
                    className="relative bg-white border border-border rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-emerald-700" />
                    {service.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        {service.badge}
                      </span>
                    )}
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-ink-900 mb-1">{service.name}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">{service.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] text-ink-500 mb-0.5">À partir de</p>
                        <p className="text-base font-semibold text-ink-900 whitespace-nowrap">
                          {service.price?.toLocaleString("fr-DZ")}{" "}
                          <span className="text-xs font-normal text-slate-600">DZD</span>
                        </p>
                      </div>
                      <Link
                        href={`/order/${service.slug}`}
                        className="shrink-0 bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-500 active:scale-95 transition-all duration-200"
                      >
                        Commander
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div
                    key={service.slug}
                    className="bg-surface border border-border rounded-2xl p-5 md:p-6 flex flex-col gap-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-border flex items-center justify-center shrink-0">
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-ink-700 mb-1">{service.name}</h3>
                      <p className="text-ink-500 text-xs leading-relaxed">{service.description}</p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 bg-white border border-border px-3 py-1.5 rounded-full">
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                          <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        Bientôt disponible
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </Container>
        </section>

        {/* ── How it works ──────────────────────────────── */}
        <section id="how-it-works" className="w-full bg-surface py-14 md:py-24">
          <Container>
            <SectionHeading
              eyebrow="Processus"
              title="Comment ça marche"
              subtitle="Trois étapes simples — de votre canapé à votre document professionnel."
            />

            {/* Mobile: vertical timeline */}
            <div className="flex flex-col gap-0 md:hidden">
              {steps.map((step, i) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0 w-10">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      {step.icon}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px flex-1 bg-border my-2" />
                    )}
                  </div>
                  <div className={`flex-1 min-w-0 pt-1 ${i < steps.length - 1 ? "pb-6" : ""}`}>
                    <p className="text-ink-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                      Étape {step.number}
                    </p>
                    <h3 className="text-sm font-semibold text-ink-900 mb-1.5">{step.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: horizontal 3-col */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 relative">
              <div className="absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-border" aria-hidden />
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  className="relative bg-white rounded-2xl p-8 border border-border shadow-sm flex flex-col gap-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 z-10">
                      {step.icon}
                    </div>
                    <span className="text-ink-500 text-xs font-semibold">Étape {step.number}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-white border-2 border-emerald-700 flex items-center justify-center z-20">
                      <div className="w-2 h-2 rounded-full bg-emerald-700" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Trust ─────────────────────────────────────── */}
        <section className="w-full bg-white py-14 md:py-24">
          <Container>
            <SectionHeading
              eyebrow="Confiance"
              title="Pourquoi nous choisir"
              subtitle="Des centaines de clients satisfaits à travers l'Algérie."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 mb-5 md:mb-10">
              {trustStats.map((s) => (
                <div
                  key={s.label}
                  className="bg-surface rounded-2xl p-5 border border-border flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    {s.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl md:text-3xl font-semibold text-ink-900 leading-none mb-0.5">
                      {s.value}
                    </p>
                    <p className="text-slate-600 text-xs md:text-sm">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-surface rounded-2xl p-5 md:p-7 border border-border"
                >
                  <svg width="22" height="16" viewBox="0 0 28 20" fill="none" className="text-emerald-100 mb-3">
                    <path d="M0 20V12C0 5.373 4.477 1.12 13.432 0L14 2.4C9.955 3.307 7.682 5.653 7.182 9.44H12V20H0zm16 0V12C16 5.373 20.477 1.12 29.432 0L30 2.4C25.955 3.307 23.682 5.653 23.182 9.44H28V20H16z" fill="currentColor"/>
                  </svg>
                  <p className="text-ink-700 leading-relaxed mb-4 text-sm">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold shrink-0">
                      {t.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-ink-900 text-sm font-semibold leading-none mb-0.5">{t.name}</p>
                      <p className="text-ink-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Final CTA ─────────────────────────────────── */}
        <section className="w-full bg-ink-900 py-14 md:py-24 relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-64"
            style={{ background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(14,124,90,0.18) 0%, transparent 100%)" }}
          />
          <Container className="relative text-center">
            <p className="text-emerald-500 text-xs font-semibold uppercase tracking-widest mb-3">
              Commencez maintenant
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight tracking-tight">
              Prêt à commander votre document ?
            </h2>
            <p className="text-ink-500 mb-7 md:mb-10 leading-relaxed max-w-sm mx-auto text-sm">
              Remplissez votre formulaire en quelques minutes. Paiement sécurisé par CIB ou Edahabia.
            </p>

            <ul className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-5 mb-7 md:mb-10 text-ink-400 text-xs">
              {["Livraison en moins de 24h", "Format professionnel garanti", "Satisfait ou refait"].map((g) => (
                <li key={g} className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-emerald-700 shrink-0">
                    <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {g}
                </li>
              ))}
            </ul>

            <Link
              href="/#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-emerald-500 active:scale-[.98] transition-all duration-200"
            >
              Voir les services
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}
