import { useState, useMemo } from 'react'
import {
  Clock, CheckCircle2,
  Lock, Unlock, User
} from 'lucide-react'
import useCourtStore from '../../stores/courtStore'
import useBookingStore from '../../stores/bookingStore'
import SportIcon from '../../components/SportIcon'
import CustomSelect from '../../components/CustomSelect'
import DatePicker from '../../components/DatePicker'
import { getCourtSlotsForDate } from '../../utils/slotHelper'

export default function AdminSchedule() {
  const { courts, manualLocks, toggleManualLock } = useCourtStore()
  const { bookings } = useBookingStore()

  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?.id || '')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [toastMsg, setToastMsg] = useState(null)

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const activeCourt = courts.find((c) => c.id === selectedCourtId) || courts[0]

  const courtOptions = courts.map((c) => ({
    value: c.id,
    label: c.name,
    desc: `${c.type} • ${c.environment} • Rp${c.price_per_hour.toLocaleString('id-ID')}/jam`,
    icon: <SportIcon type={c.type} className="w-4 h-4" />,
  }))

  // Compute live real-time slots based on active bookings for selectedCourt and selectedDate
  const computedSlots = useMemo(() => {
    if (!activeCourt) return []
    return getCourtSlotsForDate(activeCourt, selectedDate, bookings, manualLocks)
  }, [activeCourt, selectedDate, bookings, manualLocks])

  const bookedCount = computedSlots.filter((s) => s.booking || s.isManualLock).length
  const availableCount = computedSlots.filter((s) => s.isAvailable).length

  const handleSlotClick = (slot) => {
    if (slot.isPast) {
      showToast(`Slot ${slot.time} sudah lewat dari waktu operasional saat ini.`)
      return
    }

    if (slot.booking) {
      showToast(
        `Slot ${slot.time} terisi oleh pesanan aktif (${slot.booking.customer_name} - ${slot.booking.id}). Kelola pada menu Manajemen Booking.`
      )
      return
    }

    toggleManualLock(activeCourt.id, selectedDate, slot.time)
    if (slot.isManualLock) {
      showToast(`Slot ${slot.time} berhasil DIBUKA kembali untuk pelanggan.`)
    } else {
      showToast(`Slot ${slot.time} berhasil DIKUNCI (Maintenance / Booking Offline).`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-slide-in text-xs font-medium max-w-md">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Manajemen Jadwal & Slot Waktu</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Slot waktu tersinkronisasi otomatis dengan pesanan pelanggan. Slot tanpa pesanan akan terbuka, dan slot yang dipesan terkunci otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold">
            {availableCount} Slot Buka
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/60 text-xs font-bold">
            {bookedCount} Slot Terkunci / Terpesan
          </span>
        </div>
      </div>

      {/* Court & Date Selector Controls */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-2xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomSelect
            label="Pilih Lapangan Olahraga"
            value={selectedCourtId}
            onChange={(val) => setSelectedCourtId(val)}
            options={courtOptions}
          />

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">
              Tanggal Operasional
            </label>
            <DatePicker
              value={selectedDate}
              onChange={(val) => setSelectedDate(val)}
              label="Pilih Tanggal Operasional"
            />
          </div>
        </div>

        {/* Selected Court Status Banner */}
        {activeCourt && (
          <div className="p-4 bg-primary-light rounded-2xl border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                <SportIcon type={activeCourt.type} className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-text-primary text-sm">{activeCourt.name}</p>
                <p className="text-text-secondary text-xs">
                  {activeCourt.surface} • Tarif Rp{activeCourt.price_per_hour.toLocaleString('id-ID')}/jam
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Buka (Tersedia)</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Terpesan (Pesanan Pelanggan)</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Kunci Manual (Maintenance)</span>
              </span>
            </div>
          </div>
        )}

        {/* Slots Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary">
              Matriks Slot Waktu ({selectedDate})
            </h3>
            <span className="text-xs text-text-muted">
              Klik slot kosong untuk kunci/buka manual
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {computedSlots.map((slot) => {
              const isBooked = !!slot.booking
              const isManual = slot.isManualLock
              const isPast = slot.isPast

              return (
                <div
                  key={slot.time}
                  onClick={() => handleSlotClick(slot)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 relative ${
                    isPast
                      ? 'bg-surface-container/60 border-border opacity-60 cursor-not-allowed'
                      : isBooked
                      ? 'bg-rose-50/70 border-rose-300 shadow-2xs hover:border-rose-500 cursor-pointer'
                      : isManual
                      ? 'bg-amber-50/70 border-amber-300 shadow-2xs hover:border-amber-500 cursor-pointer'
                      : 'bg-surface border-emerald-300 hover:border-emerald-500 hover:shadow-xs cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-text-primary flex items-center gap-1.5">
                      <Clock
                        size={15}
                        className={
                          isPast
                            ? 'text-text-muted'
                            : isBooked
                            ? 'text-rose-600'
                            : isManual
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }
                      />
                      {slot.time}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isPast
                          ? 'bg-slate-400'
                          : isBooked
                          ? 'bg-rose-500 animate-pulse'
                          : isManual
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  {/* Booking Info or Open status */}
                  <div className="text-xs space-y-1">
                    {isPast ? (
                      <p className="text-[11px] text-text-muted font-semibold">
                        Sudah Lewat Waktu Real-Time
                      </p>
                    ) : isBooked ? (
                      <div className="space-y-0.5">
                        <p className="font-bold text-rose-700 truncate flex items-center gap-1 text-[11px]">
                          <User size={12} /> {slot.booking.customer_name}
                        </p>
                        <p className="text-[10px] text-text-muted truncate font-mono">
                          {slot.booking.id} • {slot.booking.status === 'PAID' ? 'LUNAS (QRIS)' : 'BAYAR DI TEMPAT'}
                        </p>
                      </div>
                    ) : isManual ? (
                      <p className="text-[11px] text-amber-700 font-semibold">
                        Dikunci Manual (Maintenance)
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-700 font-semibold">
                        Tersedia untuk Pelanggan
                      </p>
                    )}
                  </div>

                  {/* Footer status label */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/60">
                    <span className="text-text-muted text-[11px]">Status Slot</span>
                    <span
                      className={`font-extrabold text-[11px] flex items-center gap-1 ${
                        isPast
                          ? 'text-text-muted'
                          : isBooked
                          ? 'text-rose-600'
                          : isManual
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {isPast ? (
                        <>
                          <Lock size={12} /> LEWAT JAM
                        </>
                      ) : isBooked ? (
                        <>
                          <Lock size={12} /> TERPESAN
                        </>
                      ) : isManual ? (
                        <>
                          <Lock size={12} /> TERKUNCI
                        </>
                      ) : (
                        <>
                          <Unlock size={12} /> BUKA
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
