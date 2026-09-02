import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, MapPin, X, RotateCcw, ArrowRight } from 'lucide-react'
import useCourtStore from '../stores/courtStore'
import SportIcon from '../components/SportIcon'
import DatePicker from '../components/DatePicker'
import SortDropdown from '../components/SortDropdown'
import { SORT_OPTIONS } from '../data/sortOptions'

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { courts } = useCourtStore()

  // State from URL query or defaults
  const initialType = searchParams.get('type') || 'ALL'
  const initialQuery = searchParams.get('q') || ''
  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0]

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedSport, setSelectedSport] = useState(initialType)
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [selectedEnvironment, setSelectedEnvironment] = useState('ALL')
  const [maxPrice, setMaxPrice] = useState(300000)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('recommended')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Filter logic
  const filteredCourts = useMemo(() => {
    return courts.filter((court) => {
      // Sport type
      if (selectedSport !== 'ALL' && court.type !== selectedSport) return false
      // Environment
      if (selectedEnvironment !== 'ALL' && court.environment !== selectedEnvironment) return false
      // Max price
      if (court.price_per_hour > maxPrice) return false
      // Min rating
      if (court.rating < minRating) return false
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = court.name.toLowerCase().includes(q)
        const matchLocation = court.location.toLowerCase().includes(q)
        const matchSurface = court.surface.toLowerCase().includes(q)
        if (!matchName && !matchLocation && !matchSurface) return false
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_per_hour - b.price_per_hour
      if (sortBy === 'price_desc') return b.price_per_hour - a.price_per_hour
      if (sortBy === 'rating_desc') return b.rating - a.rating
      return 0
    })
  }, [courts, selectedSport, selectedEnvironment, maxPrice, minRating, searchQuery, sortBy])

  const resetFilters = () => {
    setSelectedSport('ALL')
    setSelectedDate(new Date().toISOString().split('T')[0])
    setSelectedEnvironment('ALL')
    setMaxPrice(300000)
    setMinRating(0)
    setSearchQuery('')
    setSortBy('recommended')
    setSearchParams({})
  }

  const handleSportSelect = (sport) => {
    setSelectedSport(sport)
    if (sport === 'ALL') {
      searchParams.delete('type')
    } else {
      searchParams.set('type', sport)
    }
    setSearchParams(searchParams)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    searchParams.set('date', date)
    setSearchParams(searchParams)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header breadcrumb & title */}
      <div className="mb-8 reveal-on-scroll">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
          <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-text-primary font-medium">Jelajah Lapangan</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Jelajah Lapangan Olahraga
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Temukan lapangan futsal, badminton, dan padel terbaik dengan jadwal real-time
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-surface text-sm font-semibold text-text-primary shadow-xs hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={16} className="text-primary" />
            <span>Filter & Urutkan</span>
            {(selectedSport !== 'ALL' || selectedEnvironment !== 'ALL' || minRating > 0 || maxPrice < 300000) && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Main layout: Sidebar Filter + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* ── Left: Filter Sidebar (Desktop) ── */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 reveal-left">
          <div className="bg-surface rounded-2xl p-5 border border-border sticky top-24 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-primary" />
                <h3 className="font-bold text-base text-text-primary">Filter</h3>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-primary hover:text-primary-container font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Filter: Tanggal Main */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Tanggal Main
              </label>
              <div className="p-2.5 rounded-xl bg-surface-container-low border border-border">
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="Pilih Tanggal Main"
                />
              </div>
            </div>

            {/* Filter: Cabang Olahraga */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Cabang Olahraga
              </label>
              <div className="space-y-1">
                {[
                  { id: 'ALL', label: 'Semua Olahraga' },
                  { id: 'FUTSAL', label: 'Futsal' },
                  { id: 'BADMINTON', label: 'Badminton' },
                  { id: 'PADEL', label: 'Padel' },
                ].map((sport) => {
                  const isSelected = selectedSport === sport.id
                  const count =
                    sport.id === 'ALL'
                      ? courts.length
                      : courts.filter((c) => c.type === sport.id).length

                  return (
                    <button
                      key={sport.id}
                      type="button"
                      onClick={() => handleSportSelect(sport.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-primary-light text-primary font-bold'
                          : 'text-text-secondary hover:bg-surface-container-low hover:text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {sport.id !== 'ALL' && <SportIcon type={sport.id} className="w-4 h-4" />}
                        <span>{sport.label}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-primary text-white font-bold' : 'text-text-muted'}`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filter: Lingkungan */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Lingkungan
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-container-low rounded-xl border border-border">
                {['ALL', 'Indoor', 'Outdoor'].map((env) => (
                  <button
                    key={env}
                    type="button"
                    onClick={() => setSelectedEnvironment(env)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedEnvironment === env
                        ? 'bg-surface text-primary shadow-2xs font-bold'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {env === 'ALL' ? 'Semua' : env}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Harga Maksimal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                <label className="text-text-muted">Harga Maksimal</label>
                <span className="text-primary font-bold">
                  Rp{maxPrice.toLocaleString('id-ID')}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="300000"
                step="25000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>Rp50k</span>
                <span>Rp300k</span>
              </div>
            </div>

            {/* Filter: Rating */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Rating Minimum
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: 0, label: 'Semua' },
                  { value: 4.5, label: '★ 4.5+' },
                  { value: 4.8, label: '★ 4.8+' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMinRating(item.value)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      minRating === item.value
                        ? 'border-primary bg-primary-light text-primary font-bold'
                        : 'border-border text-text-secondary hover:bg-surface-container-low'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Right: Search Bar, Sorting & Court Grid ── */}
        <main className="lg:col-span-3 space-y-6">
          {/* Search Bar & Custom Sort Dropdown */}
          <div className="bg-surface rounded-2xl p-4 border border-border shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 reveal-on-scroll">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama lapangan, lantai, atau lokasi..."
                className="w-full pl-9 pr-8 py-2 bg-surface-container-low border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-surface transition-all placeholder:text-text-muted"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
              <span className="text-xs text-text-secondary">
                <strong className="text-text-primary font-semibold">{filteredCourts.length}</strong> lapangan
              </span>

              {/* Bespoke Custom Recommendation / Sorting Selector */}
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
          </div>

          {/* Quick filter chips on mobile/tablet */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar lg:hidden">
            {['ALL', 'FUTSAL', 'BADMINTON', 'PADEL'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSportSelect(s)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSport === s
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface border border-border text-text-secondary'
                }`}
              >
                {s !== 'ALL' && <SportIcon type={s} className="w-3.5 h-3.5" />}
                <span>{s === 'ALL' ? 'Semua' : s}</span>
              </button>
            ))}
          </div>

          {/* Active filter summary pill tags */}
          {(selectedSport !== 'ALL' || selectedEnvironment !== 'ALL' || minRating > 0 || maxPrice < 300000 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-text-muted font-medium">Filter aktif:</span>
              {selectedSport !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-light text-primary font-medium">
                  {selectedSport}
                  <button type="button" onClick={() => handleSportSelect('ALL')} className="hover:text-primary-container cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedEnvironment !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-light text-primary font-medium">
                  {selectedEnvironment}
                  <button type="button" onClick={() => setSelectedEnvironment('ALL')} className="hover:text-primary-container cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-light text-primary font-medium">
                  ★ {minRating}+
                  <button type="button" onClick={() => setMinRating(0)} className="hover:text-primary-container cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {maxPrice < 300000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-light text-primary font-medium">
                  ≤ Rp{maxPrice.toLocaleString('id-ID')}
                  <button type="button" onClick={() => setMaxPrice(300000)} className="hover:text-primary-container cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className="text-primary hover:underline font-semibold ml-1 cursor-pointer"
              >
                Hapus Semua
              </button>
            </div>
          )}

          {/* Results Court Grid */}
          {filteredCourts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourts.map((court, idx) => {
                const availableCount = court.time_slots.filter((s) => s.available).length
                const staggerClass = `stagger-${(idx % 6) + 1}`

                return (
                  <div
                    key={court.id}
                    className={`bg-surface rounded-2xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group reveal-on-scroll ${staggerClass}`}
                  >
                    <div>
                      {/* Image + Environment & Rating */}
                      <div className="relative aspect-[16/10] bg-surface-container overflow-hidden">
                        <img
                          src={court.image_url}
                          alt={court.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-surface/90 backdrop-blur-xs text-text-primary shadow-xs">
                            {court.environment} • {court.surface.split(' ')[0]}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-surface/90 backdrop-blur-xs text-text-primary shadow-xs">
                            <Star size={13} className="text-amber-500 fill-amber-500" />
                            {court.rating}
                          </span>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                          <SportIcon type={court.type} className="w-3.5 h-3.5" />
                          <span>{court.type}</span>
                        </div>

                        <div>
                          <h3 className="font-bold text-base text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
                            {court.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                            <MapPin size={13} />
                            <span>{court.location}</span>
                          </div>
                        </div>

                        {/* Available Slots Pill */}
                        <div className="pt-1">
                          <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary bg-surface-container-low px-2.5 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{availableCount} slot tersedia hari ini</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Price & CTA */}
                    <div className="p-5 pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-text-muted block">Mulai dari</span>
                        <div className="text-base font-extrabold text-text-primary">
                          Rp{court.price_per_hour.toLocaleString('id-ID')}
                          <span className="text-xs font-normal text-text-muted">/jam</span>
                        </div>
                      </div>

                      <Link
                        to={`/courts/${court.id}?date=${selectedDate}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-2xs"
                      >
                        <span>Detail</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-surface rounded-2xl p-12 text-center border border-border shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto">
                <Search size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-text-primary">Tidak Ada Lapangan Ditemukan</h3>
                <p className="text-xs text-text-secondary max-w-md mx-auto">
                  Coba ubah kata kunci pencarian atau sesuaikan filter cabang olahraga, batas harga, dan rating.
                </p>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-container transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Semua Filter</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── Mobile Filter Modal ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-surface w-full max-w-md h-full overflow-y-auto p-6 flex flex-col justify-between space-y-6 animate-slide-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-primary" />
                  <h3 className="font-bold text-base text-text-primary">Filter & Urutkan</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-text-muted hover:text-text-primary p-1 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Urutkan Berdasarkan (Mobile Sort Cards) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-text-muted uppercase">
                  Urutkan Berdasarkan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = sortBy === opt.id
                    const OptIcon = opt.icon

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSortBy(opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'border-primary bg-primary-light text-primary font-bold shadow-2xs'
                            : 'border-border bg-surface-container-low text-text-primary'
                        }`}
                      >
                        <OptIcon size={16} className={isSelected ? 'text-primary' : 'text-text-muted'} />
                        <span className="text-xs truncate">{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tanggal Main */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-text-muted uppercase">
                  Tanggal Main
                </label>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="Pilih Tanggal Main"
                />
              </div>

              {/* Sport Type */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-2.5">
                  Cabang Olahraga
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ALL', label: 'Semua' },
                    { id: 'FUTSAL', label: 'Futsal' },
                    { id: 'BADMINTON', label: 'Badminton' },
                    { id: 'PADEL', label: 'Padel' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSportSelect(s.id)}
                      className={`p-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        selectedSport === s.id
                          ? 'border-primary bg-primary-light text-primary font-bold'
                          : 'border-border text-text-primary'
                      }`}
                    >
                      {s.id !== 'ALL' && <SportIcon type={s.id} className="w-4 h-4" />}
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Environment */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-2.5">
                  Lingkungan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['ALL', 'Indoor', 'Outdoor'].map((env) => (
                    <button
                      key={env}
                      type="button"
                      onClick={() => setSelectedEnvironment(env)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        selectedEnvironment === env
                          ? 'border-primary bg-primary-light text-primary font-bold'
                          : 'border-border text-text-primary'
                      }`}
                    >
                      {env === 'ALL' ? 'Semua' : env}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-text-muted uppercase">Harga Maksimal</label>
                  <span className="text-xs font-bold text-primary">Rp{maxPrice.toLocaleString('id-ID')}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="300000"
                  step="25000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-2">Rating Minimum</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 0, label: 'Semua' },
                    { value: 4.5, label: '★ 4.5+' },
                    { value: 4.8, label: '★ 4.8+' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setMinRating(item.value)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                        minRating === item.value
                          ? 'border-primary bg-primary-light text-primary font-bold'
                          : 'border-border text-text-secondary'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border flex gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="w-1/3 py-3 rounded-xl border border-border text-text-secondary font-semibold text-sm hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
