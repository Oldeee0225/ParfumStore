export function Stars({ rating, small }: { rating: number; small?: boolean }) {
  const size = small ? 'text-xs' : 'text-sm'
  return (
    <span className={`${size} inline-flex gap-0.5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </span>
  )
}
