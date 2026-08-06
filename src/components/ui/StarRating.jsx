import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, count, size = 14, showValue = true }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= Math.round(rating) ? 'fill-gold-400 text-gold-400' : 'fill-ink-100 text-ink-200'}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-ink-500">
          {rating > 0 ? rating.toFixed(1) : 'New'}
          {typeof count === 'number' && count > 0 ? ` (${count})` : ''}
        </span>
      )}
    </div>
  )
}
