import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-ink-900 text-ink-500 border-t border-ink-700">
      <div className="w-full max-w-300 mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-8 md:pb-10">

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-14">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H8zM2 8h4v4H2zM8 8h4v4H8z" fill="white" fillOpacity=".9"/>
                </svg>
              </span>
              <span className="text-white font-semibold text-base">Khdmti</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Vos documents administratifs professionnels, prêts depuis chez vous —
              sans files d&apos;attente.
            </p>
          </div>

          {/* Services + Contact — 2 cols on mobile */}
          <div className="grid grid-cols-2 gap-6 md:contents">
            <div>
              <p className="text-white font-semibold text-sm mb-3">Services</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/order/cv" className="hover:text-white transition-colors duration-200">
                    CV professionnel
                  </Link>
                </li>
                <li>
                  <Link href="/order/facture" className="hover:text-white transition-colors duration-200">
                    Facture
                  </Link>
                </li>
                <li className="text-slate-600 text-xs pt-1">Visa — bientôt</li>
                <li className="text-slate-600 text-xs">Auto-ent. — bientôt</li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-3">Contact</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="tel:+213XXXXXXXXX" className="hover:text-white transition-colors duration-200">
                    +213 XX XX XX XX
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@khdmti.dz" className="hover:text-white transition-colors duration-200 break-all">
                    contact@khdmti.dz
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ink-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Khdmti. Tous droits réservés.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Paiement sécurisé CIB · Edahabia</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
