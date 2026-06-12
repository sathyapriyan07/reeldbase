import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: string | null | undefined) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRuntime(minutes: number | null | undefined) {
  if (!minutes) return 'N/A'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

export function formatCurrency(amount: number | null | undefined) {
  if (!amount) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getImageUrl(path: string | null | undefined, size = 'original') {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function getLanguageLabel(language: string) {
  const labels: Record<string, string> = {
    tamil: 'தமிழ்',
    malayalam: 'മലയാളം',
    both: 'தமிழ் & മലയാളം',
  }
  return labels[language] || language
}

export function getRoleBadgeColor(role: string) {
  const colors: Record<string, string> = {
    actor: 'bg-blue-500/20 text-blue-400',
    actress: 'bg-pink-500/20 text-pink-400',
    director: 'bg-purple-500/20 text-purple-400',
    writer: 'bg-green-500/20 text-green-400',
    producer: 'bg-yellow-500/20 text-yellow-400',
    music_director: 'bg-orange-500/20 text-orange-400',
    cinematographer: 'bg-cyan-500/20 text-cyan-400',
    editor: 'bg-red-500/20 text-red-400',
  }
  return colors[role] || 'bg-white/10 text-white/70'
}

export function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    actor: 'Actor',
    actress: 'Actress',
    director: 'Director',
    writer: 'Writer',
    producer: 'Producer',
    music_director: 'Music Director',
    cinematographer: 'Cinematographer',
    editor: 'Editor',
  }
  return labels[role] || role
}

export function generateSlug(title: string) {
  return slugify(title) + '-' + Math.random().toString(36).slice(2, 7)
}
