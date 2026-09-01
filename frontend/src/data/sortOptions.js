import { Sparkles, Star, TrendingDown, TrendingUp } from 'lucide-react'

export const SORT_OPTIONS = [
  {
    id: 'recommended',
    label: 'Rekomendasi',
    desc: 'Paling relevan & populer',
    icon: Sparkles,
  },
  {
    id: 'rating_desc',
    label: 'Rating Tertinggi',
    desc: 'Skor bintang 4.8 - 5.0',
    icon: Star,
  },
  {
    id: 'price_asc',
    label: 'Harga Terendah',
    desc: 'Mulai dari termurah',
    icon: TrendingDown,
  },
  {
    id: 'price_desc',
    label: 'Harga Tertinggi',
    desc: 'Fasilitas & venue premium',
    icon: TrendingUp,
  },
]
