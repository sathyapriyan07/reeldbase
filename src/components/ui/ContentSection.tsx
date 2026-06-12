import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

interface Props {
  title: string
  viewAllLink?: string
  children?: React.ReactNode
}

export default function ContentSection({ title, viewAllLink, children }: Props) {
  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">{title}</h2>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="text-sm text-white/50 hover:text-white flex items-center gap-1 transition-colors font-medium"
            >
              View All <FiChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {children}
        </div>
      </div>
    </section>
  )
}

export function HorizontalSection({ title, viewAllLink, children }: Props) {
  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">{title}</h2>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="text-sm text-white/50 hover:text-white flex items-center gap-1 transition-colors font-medium"
            >
              View All <FiChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 snap-x snap-mandatory">
          {children}
        </div>
      </div>
    </section>
  )
}
