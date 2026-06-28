'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

// --- Interfaces ---------------------------------------------------------------
interface RequestItem {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceSlug: 'cv' | 'facture';
  serviceName: string;
  amount: number;
  paid: boolean;
  status: 'new' | 'in_progress' | 'ready' | 'delivered';
  createdAt: string;
  data: any;
}

// --- Mock Data for Dashboard -------------------------------------------------
const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: "REQ-001",
    clientName: "Amine Benmohamed",
    clientPhone: "+213550123456",
    clientEmail: "amine.ben@email.com",
    serviceSlug: "cv",
    serviceName: "CV professionnel",
    amount: 500,
    paid: true,
    status: "delivered",
    createdAt: "2026-06-28T09:30:00Z",
    data: {
      jobTitle: "Ingénieur Logiciel Full-Stack",
      profile: "Développeur passionné avec 3 ans d'expérience dans le développement d'applications Web modernes.",
      exps: [
        { role: "Développeur React", company: "Algiers Tech", duration: "2024 - Présent", desc: "Développement d'interfaces utilisateur." }
      ],
      edus: [
        { degree: "Master en Informatique", school: "USTHB", year: "2023" }
      ],
      skills: ["React", "Next.js", "TypeScript", "Node.js"],
      langs: ["Arabe (Natif)", "Français (Courant)", "Anglais (Technique)"]
    }
  },
  {
    id: "REQ-002",
    clientName: "SARL Alger Distribution",
    clientPhone: "+213661987654",
    clientEmail: "contact@algerdist.dz",
    serviceSlug: "facture",
    serviceName: "Facture",
    amount: 300,
    paid: true,
    status: "in_progress",
    createdAt: "2026-06-28T11:15:00Z",
    data: {
      issuerName: "ALGSERV Tech Solutions",
      issuerNif: "001916012345678",
      issuerRc: "16/00-9876543B26",
      issuerAi: "16123456789",
      issuerAddress: "08 Rue Didouche Mourad, Alger",
      clientName: "SARL Alger Distribution",
      clientAddress: "Zone Industrielle Rouïba, Alger",
      invoiceNum: "FACT-2026-042",
      invoiceDate: "2026-06-28",
      tvaRate: 19,
      items: [
        { description: "Prestation de maintenance serveur & cloud", quantity: 1, price: 15000 },
        { description: "Support technique mensuel (Juin 2026)", quantity: 1, price: 5000 }
      ]
    }
  },
  {
    id: "REQ-003",
    clientName: "Fatima Zohra K.",
    clientPhone: "+213770456123",
    clientEmail: "fz.kacimi@email.com",
    serviceSlug: "cv",
    serviceName: "CV professionnel",
    amount: 500,
    paid: false,
    status: "new",
    createdAt: "2026-06-28T13:45:00Z",
    data: {
      jobTitle: "Chargée de Ressources Humaines",
      profile: "Spécialiste RH dynamique avec une expertise en recrutement et gestion des talents.",
      exps: [
        { role: "Assistante RH", company: "Cabinet Recrutement Dz", duration: "2024 - 2025", desc: "Présélection et entretiens de candidats." }
      ],
      edus: [
        { degree: "Licence Management", school: "Université d'Alger", year: "2023" }
      ],
      skills: ["Recrutement", "Communication", "Droit du travail"],
      langs: ["Arabe (Natif)", "Français (Courant)"]
    }
  },
  {
    id: "REQ-004",
    clientName: "Etablissement El Bahdja",
    clientPhone: "+213540789456",
    clientEmail: "elbahdja.shop@gmail.com",
    serviceSlug: "facture",
    serviceName: "Facture",
    amount: 300,
    paid: true,
    status: "ready",
    createdAt: "2026-06-27T16:20:00Z",
    data: {
      issuerName: "ALGSERV Tech Solutions",
      issuerNif: "001916012345678",
      issuerRc: "16/00-9876543B26",
      issuerAi: "16123456789",
      issuerAddress: "08 Rue Didouche Mourad, Alger",
      clientName: "Etablissement El Bahdja",
      clientAddress: "Boulevard de la Soummam, Oran",
      invoiceNum: "FACT-2026-041",
      invoiceDate: "2026-06-27",
      tvaRate: 19,
      items: [
        { description: "Licences logicielles antivirus professionnelles", quantity: 5, price: 2000 }
      ]
    }
  }
];

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Requests state
  const [requests, setRequests] = useState<RequestItem[]>(INITIAL_REQUESTS)
  const [selectedId, setSelectedId] = useState<string>("REQ-001")

  // Filters state
  const [searchTerm, setSearchTerm] = useState('')
  const [serviceFilter, setServiceFilter] = useState<'all' | 'cv' | 'facture'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'ready' | 'delivered'>('all')
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all')

  // Password submission handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    
    if (password === adminPassword) {
      setIsAuthorized(true)
      setErrorMsg('')
    } else {
      setErrorMsg("Mot de passe incorrect. Réessayez.")
    }
  }

  // Update handlers
  const updateStatus = (id: string, newStatus: RequestItem['status']) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req))
  }

  const togglePayment = (id: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, paid: !req.paid } : req))
  }

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.clientPhone.includes(searchTerm)
    const matchesService = serviceFilter === 'all' || req.serviceSlug === serviceFilter
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || 
                           (paymentFilter === 'paid' && req.paid) || 
                           (paymentFilter === 'unpaid' && !req.paid)
    return matchesSearch && matchesService && matchesStatus && matchesPayment
  })

  // Selected request
  const selectedReq = requests.find(req => req.id === selectedId) || requests[0]

  // Computations for stats
  const totalRevenue = requests.filter(r => r.paid).reduce((sum, r) => sum + r.amount, 0)
  const countNew = requests.filter(r => r.status === 'new').length
  const countPending = requests.filter(r => r.status === 'in_progress').length
  const countReady = requests.filter(r => r.status === 'ready').length

  // WhatsApp link generator
  const getWhatsAppLink = (req: RequestItem) => {
    let msg = `Bonjour ${req.clientName}, c'est l'équipe ALGSERV. `
    if (req.status === 'ready') {
      msg += `Votre document (${req.serviceName}) est prêt ! Nous vous l'enverrons sous peu.`
    } else if (req.status === 'delivered') {
      msg += `Votre document (${req.serviceName}) a été livré. Merci pour votre confiance !`
    } else {
      msg += `Nous avons bien reçu votre demande pour le service (${req.serviceName}) et nous la traitons actuellement.`
    }
    return `https://wa.me/${req.clientPhone.replace('+', '')}?text=${encodeURIComponent(msg)}`
  }

  // If not authorized, display Login Gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
        <div className="w-full max-w-md bg-white border border-[#DDE4F0] rounded-2xl shadow-xl p-8 flex flex-col items-center">
          
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 border border-blue-100 shadow-sm">
            🔒
          </div>

          <h2 className="text-xl font-bold text-ink-900 mb-2">ALGSERV Admin Panel</h2>
          <p className="text-sm text-slate-500 text-center mb-8">Saisissez le mot de passe administrateur pour déverrouiller le tableau de bord.</p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-ink-900 mb-1.5 uppercase">Mot de passe</label>
              <input 
                type="password" 
                className="w-full bg-slate-50 border border-[#DDE4F0] rounded-xl px-4 py-3 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            {errorMsg && (
              <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer">
              Déverrouiller
            </button>
          </form>

          <Link href="/" className="text-xs font-semibold text-slate-400 mt-6 hover:text-blue-500 transition-colors">
            ← Retour au site
          </Link>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">Tableau de bord Admin</h1>
            <p className="text-xs text-slate-400 font-semibold">Gérer les demandes clients et suivre les revenus</p>
          </div>
          <button onClick={() => setIsAuthorized(false)} className="text-xs font-bold border border-[#DDE4F0] bg-white rounded-lg px-4 py-2 text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
            Se déconnecter
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Revenus (Total Payé)", value: `${totalRevenue.toLocaleString()} DZD`, icon: "💰", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
            { label: "Nouvelles Demandes", value: countNew, icon: "📥", color: "bg-blue-50 text-blue-600 border-blue-100" },
            { label: "En Cours de Traitement", value: countPending, icon: "⚙️", color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
            { label: "Prêtes à Livrer", value: countReady, icon: "✅", color: "bg-purple-50 text-purple-600 border-purple-100" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-[#DDE4F0] rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} border flex items-center justify-center text-xl shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg sm:text-xl font-bold text-ink-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Directory & Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Requests Directory */}
          <div className="lg:col-span-5 flex flex-col gap-4 w-full">
            
            {/* Filter controls */}
            <div className="bg-white border border-[#DDE4F0] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
              
              {/* Search */}
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-[#DDE4F0] rounded-xl px-3.5 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Rechercher par client ou téléphone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />

              {/* Advanced filter select rows */}
              <div className="grid grid-cols-3 gap-2">
                
                {/* Service type */}
                <select 
                  className="bg-slate-50 border border-[#DDE4F0] rounded-xl px-2.5 py-2 text-[10px] font-semibold text-ink-700 focus:outline-none"
                  value={serviceFilter}
                  onChange={e => setServiceFilter(e.target.value as any)}
                >
                  <option value="all">Services: Tous</option>
                  <option value="cv">CV uniquement</option>
                  <option value="facture">Facture uniquement</option>
                </select>

                {/* Status */}
                <select 
                  className="bg-slate-50 border border-[#DDE4F0] rounded-xl px-2.5 py-2 text-[10px] font-semibold text-ink-700 focus:outline-none"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">Statut: Tous</option>
                  <option value="new">Nouveau</option>
                  <option value="in_progress">En cours</option>
                  <option value="ready">Prêt</option>
                  <option value="delivered">Livré</option>
                </select>

                {/* Payment */}
                <select 
                  className="bg-slate-50 border border-[#DDE4F0] rounded-xl px-2.5 py-2 text-[10px] font-semibold text-ink-700 focus:outline-none"
                  value={paymentFilter}
                  onChange={e => setPaymentFilter(e.target.value as any)}
                >
                  <option value="all">Paiement: Tous</option>
                  <option value="paid">Payé</option>
                  <option value="unpaid">Non Payé</option>
                </select>

              </div>

            </div>

            {/* List entries */}
            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredRequests.length === 0 ? (
                <div className="bg-white border border-[#DDE4F0] rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold">
                  Aucun résultat correspondant.
                </div>
              ) : (
                filteredRequests.map(req => (
                  <button 
                    key={req.id} 
                    onClick={() => setSelectedId(req.id)}
                    className={`w-full bg-white border text-left p-4 rounded-xl shadow-sm transition-all flex justify-between items-start cursor-pointer hover:border-blue-500
                      ${selectedId === req.id ? 'border-blue-600 ring-2 ring-blue-500/10' : 'border-[#DDE4F0]'}`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-ink-900">{req.clientName}</span>
                        <span className="text-[9px] font-bold text-slate-400">({req.id})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{req.serviceName} · {req.amount} DZD</span>
                      <span className="text-[9.5px] text-slate-500 font-bold mt-1">📞 {req.clientPhone}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {/* Status Badges */}
                      <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase
                        ${req.status === 'new' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          req.status === 'in_progress' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                          req.status === 'ready' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                          'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {req.status === 'new' ? 'nouveau' : req.status === 'in_progress' ? 'en cours' : req.status === 'ready' ? 'prêt' : 'livré'}
                      </span>

                      {/* Payment Badge */}
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase
                        ${req.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {req.paid ? 'payé' : 'impayé'}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

          </div>

          {/* RIGHT: Request Detail Drawer */}
          <div className="lg:col-span-7 w-full">
            {selectedReq ? (
              <div className="bg-white border border-[#DDE4F0] rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                
                {/* Header detail */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-5 gap-4">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600">{selectedReq.serviceName}</span>
                    <h2 className="text-lg font-bold text-ink-900 mt-1">{selectedReq.clientName}</h2>
                    <div className="text-xs text-slate-500 mt-1">
                      ✉️ {selectedReq.clientEmail || "Aucun email"} · 📅 {new Date(selectedReq.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400">PRIX DE LA PRESTATION</span>
                    <p className="text-xl font-bold text-blue-600 mt-0.5">{selectedReq.amount} DZD</p>
                  </div>
                </div>

                {/* Operations controls */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Statut de la demande</label>
                    <select 
                      className="w-full bg-white border border-[#DDE4F0] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-900 focus:outline-none"
                      value={selectedReq.status}
                      onChange={e => updateStatus(selectedReq.id, e.target.value as any)}
                    >
                      <option value="new">Nouveau</option>
                      <option value="in_progress">En cours</option>
                      <option value="ready">Prêt</option>
                      <option value="delivered">Livré</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">État de paiement</label>
                    <button 
                      onClick={() => togglePayment(selectedReq.id)}
                      className={`w-full font-bold text-xs py-2 rounded-lg border transition-all cursor-pointer text-center
                        ${selectedReq.paid ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}
                    >
                      {selectedReq.paid ? '✓ PAIEMENT PAYÉ' : '⚠️ NON PAYÉ (Cliquer pour régler)'}
                    </button>
                  </div>
                </div>

                {/* Displaying raw form answers */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Contenu de la demande</h4>
                  
                  {/* If service is CV */}
                  {selectedReq.serviceSlug === 'cv' && (
                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col gap-4 text-xs">
                      <div>
                        <strong>Météor / Poste visé:</strong>
                        <p className="text-slate-600 mt-1">{selectedReq.data.jobTitle || "/"}</p>
                      </div>
                      <div>
                        <strong>Profil / Résumé:</strong>
                        <p className="text-slate-600 mt-1 leading-relaxed">{selectedReq.data.profile || "/"}</p>
                      </div>
                      
                      {/* Exp */}
                      <div>
                        <strong className="border-b border-slate-200 pb-1 mb-2 block uppercase text-[10px] text-slate-400">Expérience</strong>
                        <ul className="space-y-2 text-slate-600">
                          {selectedReq.data.exps.map((exp: any, i: number) => (
                            <li key={i} className="list-disc ml-4">
                              <strong>{exp.role}</strong> chez <em>{exp.company}</em> ({exp.duration}) - {exp.desc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Edu */}
                      <div>
                        <strong className="border-b border-slate-200 pb-1 mb-2 block uppercase text-[10px] text-slate-400">Formation</strong>
                        <ul className="space-y-2 text-slate-600">
                          {selectedReq.data.edus.map((edu: any, i: number) => (
                            <li key={i} className="list-disc ml-4">
                              <strong>{edu.degree}</strong> à <em>{edu.school}</em> (Année {edu.year})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* If service is Facture */}
                  {selectedReq.serviceSlug === 'facture' && (
                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col gap-4 text-xs">
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                        <div>
                          <strong>Émetteur:</strong>
                          <p className="text-slate-600 mt-0.5">{selectedReq.data.issuerName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">NIF: {selectedReq.data.issuerNif} · RC: {selectedReq.data.issuerRc}</p>
                        </div>
                        <div>
                          <strong>Client:</strong>
                          <p className="text-slate-600 mt-0.5">{selectedReq.data.clientName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{selectedReq.data.clientAddress}</p>
                        </div>
                      </div>

                      <div>
                        <strong>Articles facturés:</strong>
                        <table className="w-full text-left mt-2 text-[11px] leading-relaxed">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                              <th className="py-1">Description</th>
                              <th className="py-1 text-center w-12">Qté</th>
                              <th className="py-1 text-right w-20">P.U</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedReq.data.items.map((item: any, idx: number) => (
                              <tr key={idx} className="text-slate-600">
                                <td className="py-1.5">{item.description}</td>
                                <td className="py-1.5 text-center">{item.quantity}</td>
                                <td className="py-1.5 text-right">{item.price.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>

                {/* Dispatch / WhatsApp Actions */}
                <div className="flex gap-3 border-t border-slate-100 pt-5 mt-2">
                  <a 
                    href={getWhatsAppLink(selectedReq)}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 text-center text-white bg-emerald-600 hover:bg-emerald-700 font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2"
                  >
                    💬 WhatsApp Client
                  </a>
                  <button className="flex-1 text-slate-700 border border-[#DDE4F0] hover:bg-slate-50 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer">
                    📥 Générer PDF final
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white border border-[#DDE4F0] rounded-2xl p-12 text-center text-slate-400 font-bold">
                Sélectionnez une demande dans la liste pour afficher ses détails.
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}
