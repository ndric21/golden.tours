export const INTERESTS = [
  { id: 'wildlife', label: 'Wildlife Safari', icon: 'PawPrint' },
  { id: 'beach', label: 'Beach & Island (Zanzibar)', icon: 'Palmtree' },
  { id: 'mountain', label: 'Mountain Climbing (Kilimanjaro)', icon: 'Mountain' },
  { id: 'culture', label: 'Cultural Experiences', icon: 'Users' },
  { id: 'gorilla', label: 'Gorilla Trekking', icon: 'Trees' },
  { id: 'adventure', label: 'Adventure', icon: 'Compass' },
  { id: 'honeymoon', label: 'Honeymoon', icon: 'Heart' },
  { id: 'family', label: 'Family Trip', icon: 'Home' },
  { id: 'luxury', label: 'Luxury Escape', icon: 'Gem' },
]

export const BUDGET_LEVELS = [
  { id: 'budget', label: 'Budget', hint: 'Under $200/day per person' },
  { id: 'mid-range', label: 'Mid-Range', hint: '$200–$450/day per person' },
  { id: 'luxury', label: 'Luxury', hint: '$450+/day per person' },
]

export const TRAVELER_COUNTS = [
  { id: 1, label: 'Solo (1)' },
  { id: 2, label: 'Couple (2)' },
  { id: 4, label: 'Small Group (3–4)' },
  { id: 7, label: 'Group (5–8)' },
  { id: 9, label: 'Large Group (9+)' },
]

export const DURATIONS = [
  { id: '3-5', label: '3–5 days', min: 3, max: 5 },
  { id: '6-8', label: '6–8 days', min: 6, max: 8 },
  { id: '9-12', label: '9–12 days', min: 9, max: 12 },
  { id: '13+', label: '13+ days', min: 13, max: 99 },
]

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const COUNTRIES = ['Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Zanzibar']

export const COUNTRY_FLAGS = {
  Tanzania: '🇹🇿',
  Kenya: '🇰🇪',
  Uganda: '🇺🇬',
  Rwanda: '🇷🇼',
  Zanzibar: '🇹🇿',
}

export const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']
export const PAYMENT_STATUSES = ['paid', 'pending', 'refunded', 'failed']
export const ENQUIRY_STATUSES = ['new', 'contacted', 'converted', 'closed']

export const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-safari-100 text-safari-800',
  completed: 'bg-ink-100 text-ink-700',
  cancelled: 'bg-red-100 text-red-700',
  paid: 'bg-safari-100 text-safari-800',
  refunded: 'bg-ink-100 text-ink-700',
  failed: 'bg-red-100 text-red-700',
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-800',
  converted: 'bg-safari-100 text-safari-800',
  closed: 'bg-ink-100 text-ink-700',
}
