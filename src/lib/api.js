import { supabase } from './supabaseClient'

// ============================================================
// DESTINATIONS
// ============================================================
export async function fetchDestinations() {
  const { data, error } = await supabase.from('destinations').select('*').order('name')
  if (error) throw error
  return data
}

export async function fetchDestinationBySlug(slug) {
  const { data, error } = await supabase.from('destinations').select('*').eq('slug', slug).single()
  if (error) throw error
  return data
}

export async function createDestination(payload) {
  const { data, error } = await supabase.from('destinations').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateDestination(id, payload) {
  const { data, error } = await supabase.from('destinations').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteDestination(id) {
  const { error } = await supabase.from('destinations').delete().eq('id', id)
  if (error) throw error
}

// ============================================================
// PACKAGES
// ============================================================
export async function fetchPackages() {
  const { data, error } = await supabase.from('packages').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchFeaturedPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('featured', true)
    .order('rating', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchPackageBySlug(slug) {
  const { data, error } = await supabase.from('packages').select('*').eq('slug', slug).single()
  if (error) throw error
  return data
}

export async function fetchPackagesForDestination(destinationId) {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .contains('destination_ids', [destinationId])
  if (error) throw error
  return data
}

export async function fetchPackageById(id) {
  const { data, error } = await supabase.from('packages').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createPackage(payload) {
  const { data, error } = await supabase.from('packages').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updatePackage(id, payload) {
  const { data, error } = await supabase.from('packages').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletePackage(id) {
  const { error } = await supabase.from('packages').delete().eq('id', id)
  if (error) throw error
}

// ============================================================
// BOOKINGS
// ============================================================
export async function fetchMyBookings(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, package:packages(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, package:packages(title,images,duration_days), customer:profiles(full_name,email,phone,avatar_url)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createBooking(payload) {
  const { data, error } = await supabase.from('bookings').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateBookingStatus(id, status) {
  const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data
}

// ============================================================
// CUSTOMERS (admin)
// ============================================================
export async function fetchCustomers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchCustomerProfile(id) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function fetchCustomerBookings(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, package:packages(title,images,duration_days)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchCustomerPayments(userId) {
  const { data: bookings, error: bErr } = await supabase.from('bookings').select('id').eq('user_id', userId)
  if (bErr) throw bErr
  const ids = (bookings ?? []).map((b) => b.id)
  if (ids.length === 0) return []
  const { data, error } = await supabase
    .from('payments')
    .select('*, booking:bookings(package:packages(title))')
    .in('booking_id', ids)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchCustomerConversations(userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, messages(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ============================================================
// PAYMENTS (admin)
// ============================================================
export async function fetchAllPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*, booking:bookings(id, customer:profiles(full_name,email), package:packages(title))')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updatePaymentStatus(id, status) {
  const payload = { status }
  if (status === 'paid') payload.paid_at = new Date().toISOString()
  const { data, error } = await supabase.from('payments').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function createPayment(payload) {
  const { data, error } = await supabase.from('payments').insert(payload).select().single()
  if (error) throw error
  return data
}

// ============================================================
// REVIEWS
// ============================================================
export async function fetchPackageReviews(packageId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, author:profiles(full_name,avatar_url)')
    .eq('package_id', packageId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchAllReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, author:profiles(full_name,email,avatar_url), package:packages(title)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createReview(payload) {
  const { data, error } = await supabase.from('reviews').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function deleteReview(id) {
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) throw error
}

// ============================================================
// ENQUIRIES / LEADS
// ============================================================
export async function createEnquiry(payload) {
  const { data, error } = await supabase.from('enquiries').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function fetchAllEnquiries() {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*, customer:profiles(full_name,avatar_url)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateEnquiryStatus(id, status) {
  const { data, error } = await supabase.from('enquiries').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data
}

// ============================================================
// AI CONVERSATIONS + MESSAGES
// ============================================================
export async function createConversation(userId, title = 'New conversation') {
  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: userId, title })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchConversationMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function saveMessage(conversationId, role, content) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role, content })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchAllConversations() {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, customer:profiles(full_name,email,avatar_url), messages(id,role,content,created_at)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function askAI(messages, mode = 'chat') {
  const { data, error } = await supabase.functions.invoke('chat', {
    body: { messages, mode },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data.reply
}

// ============================================================
// COMPANY SETTINGS (admin)
// ============================================================
export async function fetchCompanySettings() {
  const { data, error } = await supabase.from('company_settings').select('*').eq('id', 1).single()
  if (error) throw error
  return data
}

export async function updateCompanySettings(payload) {
  const { data, error } = await supabase
    .from('company_settings')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single()
  if (error) throw error
  return data
}

// ============================================================
// DASHBOARD / REPORTS (admin)
// ============================================================
export async function fetchDashboardStats() {
  const [
    { count: totalBookings },
    { count: activeTours },
    { count: newLeads },
    { data: paidPayments },
    { data: bookingsWithPackage },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['confirmed', 'pending']),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('payments').select('amount').eq('status', 'paid'),
    supabase.from('bookings').select('status, created_at, total_price, package:packages(title, destination_ids)'),
  ])

  const totalRevenue = (paidPayments ?? []).reduce((sum, p) => sum + Number(p.amount), 0)

  return {
    totalRevenue,
    totalBookings: totalBookings ?? 0,
    activeTours: activeTours ?? 0,
    newLeads: newLeads ?? 0,
    bookings: bookingsWithPackage ?? [],
  }
}

export async function fetchCustomersPerDestination() {
  const { data, error } = await supabase
    .from('bookings')
    .select('user_id, package:packages(destination_ids)')
  if (error) throw error

  const { data: destinations } = await supabase.from('destinations').select('id,name')
  const destMap = new Map((destinations ?? []).map((d) => [d.id, d.name]))

  const counts = new Map()
  for (const booking of data ?? []) {
    const destIds = booking.package?.destination_ids ?? []
    for (const id of destIds) {
      const name = destMap.get(id)
      if (!name) continue
      if (!counts.has(name)) counts.set(name, new Set())
      counts.get(name).add(booking.user_id)
    }
  }

  return Array.from(counts.entries())
    .map(([name, users]) => ({ name, customers: users.size }))
    .sort((a, b) => b.customers - a.customers)
}
