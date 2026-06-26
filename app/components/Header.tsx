import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-ink-900 border-b border-ink-700 sticky top-0 z-50">
      <div className="w-full max-w-300 mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8h4v4H8z" fill="white" fillOpacity=".9"/>
            </svg>
          </span>
          <span className="text-white font-semibold text-base tracking-tight">Khdmti</span>
        </Link>

        {/* Nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <Link href="/#services" className="text-ink-500 hover:text-white text-sm transition-colors duration-200">
            Services
          </Link>
          <Link href="/#how-it-works" className="text-ink-500 hover:text-white text-sm transition-colors duration-200">
            Comment ça marche
          </Link>
          <Link href="/#contact" className="text-ink-500 hover:text-white text-sm transition-colors duration-200">
            Contact
          </Link>
        </nav>

        {/* CTA */}
        <Link
          href="/#services"
          className="shrink-0 bg-emerald-700 text-white text-xs md:text-sm font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-xl hover:bg-emerald-500 active:scale-95 transition-all duration-200"
        >
          Commander
        </Link>
      </div>
    </header>
  );
}
