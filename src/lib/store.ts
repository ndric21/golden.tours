// Golden Tours — Data Access Layer (Supabase-backed)
// Same shapes/method names the components already expect, but every method
// now reads/writes real Postgres tables through Supabase, with Row Level
// Security enforcing who can see what (a company only ever sees its own
// bookings/customers/payments/reviews — the old localStorage version had no
// such isolation).
import { supabase } from "@/integrations/supabase/client";

export type { AuthUser, TravelBuddy } from "@/lib/auth";

export type BookingStatus = "pending" | "confirmed" | "paid" | "completed" | "cancelled";
export type EnquiryStatus = "new" | "reviewed" | "converted" | "closed";
export type PaymentStatus = "pending" | "completed" | "refunded" | "failed";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type PaymentMethod = "card" | "bank_transfer" | "mobile_money" | "cash";
export type PackageCategory = "safari" | "beach" | "mountain" | "cultural" | "adventure";
export type PackageDifficulty = "easy" | "moderate" | "challenging";

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  destination: string;
  packageId?: string;
  packageName?: string;
  companyId?: string;
  companyName?: string;
  startDate: string;
  endDate: string;
  guests: number;
  amount: number;
  currency: string;
  status: BookingStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

export interface Enquiry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  messages: ChatMessage[];
  destination?: string;
  budget?: string;
  companyId?: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  companyId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  companyId: string;
  bookingId?: string;
  destination: string;
  rating: number;
  title: string;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface TourPackage {
  id: string;
  companyId?: string;
  name: string;
  destination: string;
  duration: number;
  maxGroupSize: number | null;
  price: number;
  priceTo: number;
  currency: string;
  description: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: string;
  highlights: string[];
  category: PackageCategory | null;
  difficulty: PackageDifficulty | null;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarUrl?: string;
  phone?: string;
  country?: string;
  preferences?: string;
  joinedAt: string;
}

export const genId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

export async function getMyCompanyId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: company } = await supabase.from("companies").select("id").eq("owner_id", data.user.id).maybeSingle();
  return company?.id ?? null;
}

// ---------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------
function rowToBooking(r: any): Booking {
  return {
    id: r.id,
    userId: r.user_id,
    userName: r.user_name,
    userEmail: r.user_email,
    destination: r.destination,
    packageId: r.package_id ?? undefined,
    packageName: r.package_name ?? undefined,
    companyId: r.company_id ?? undefined,
    companyName: r.company_name ?? undefined,
    startDate: r.start_date,
    endDate: r.end_date,
    guests: r.guests,
    amount: Number(r.amount),
    currency: r.currency,
    status: r.status,
    notes: r.notes ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export const bookingStore = {
  async getAll(): Promise<Booking[]> {
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToBooking);
  },
  async getByUser(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToBooking);
  },
  async add(b: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: b.userId,
        user_name: b.userName,
        user_email: b.userEmail,
        destination: b.destination,
        package_id: b.packageId ?? null,
        package_name: b.packageName ?? null,
        company_id: b.companyId ?? null,
        company_name: b.companyName ?? null,
        start_date: b.startDate,
        end_date: b.endDate,
        guests: b.guests,
        amount: b.amount,
        currency: b.currency,
        status: b.status,
        notes: b.notes,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToBooking(data);
  },
  async update(id: string, u: Partial<Booking>): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (u.status !== undefined) payload.status = u.status;
    if (u.notes !== undefined) payload.notes = u.notes;
    if (u.startDate !== undefined) payload.start_date = u.startDate;
    if (u.endDate !== undefined) payload.end_date = u.endDate;
    if (u.guests !== undefined) payload.guests = u.guests;
    if (u.amount !== undefined) payload.amount = u.amount;
    const { error } = await supabase.from("bookings").update(payload).eq("id", id);
    if (error) throw error;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) throw error;
  },
};

// ---------------------------------------------------------------
// Enquiries
// ---------------------------------------------------------------
function rowToEnquiry(r: any): Enquiry {
  return {
    id: r.id,
    userId: r.user_id,
    userName: r.user_name,
    userEmail: r.user_email,
    messages: r.messages ?? [],
    destination: r.destination ?? undefined,
    budget: r.budget ?? undefined,
    companyId: r.company_id ?? undefined,
    status: r.status,
    adminNotes: r.admin_notes ?? undefined,
    createdAt: r.created_at,
  };
}

export const enquiryStore = {
  async getAll(): Promise<Enquiry[]> {
    const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToEnquiry);
  },
  async add(e: Omit<Enquiry, "id" | "createdAt">): Promise<Enquiry> {
    const { data, error } = await supabase
      .from("enquiries")
      .insert({
        user_id: e.userId,
        user_name: e.userName,
        user_email: e.userEmail,
        messages: e.messages,
        destination: e.destination ?? null,
        budget: e.budget ?? null,
        company_id: e.companyId ?? null,
        status: e.status,
        admin_notes: e.adminNotes ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToEnquiry(data);
  },
  async update(id: string, u: Partial<Enquiry>): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (u.messages !== undefined) payload.messages = u.messages;
    if (u.status !== undefined) payload.status = u.status;
    if (u.adminNotes !== undefined) payload.admin_notes = u.adminNotes;
    if (u.companyId !== undefined) payload.company_id = u.companyId;
    const { error } = await supabase.from("enquiries").update(payload).eq("id", id);
    if (error) throw error;
  },
};

// ---------------------------------------------------------------
// Payments
// ---------------------------------------------------------------
function rowToPayment(r: any): Payment {
  return {
    id: r.id,
    bookingId: r.booking_id,
    userId: r.user_id,
    userName: r.user_name,
    userEmail: r.user_email,
    companyId: r.company_id ?? undefined,
    amount: Number(r.amount),
    currency: r.currency,
    method: r.method,
    status: r.status,
    reference: r.reference,
    createdAt: r.created_at,
  };
}

export const paymentStore = {
  async getAll(): Promise<Payment[]> {
    const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToPayment);
  },
  async add(p: Omit<Payment, "id" | "createdAt">): Promise<Payment> {
    const { data, error } = await supabase
      .from("payments")
      .insert({
        booking_id: p.bookingId,
        user_id: p.userId,
        user_name: p.userName,
        user_email: p.userEmail,
        company_id: p.companyId ?? null,
        amount: p.amount,
        currency: p.currency,
        method: p.method,
        status: p.status,
        reference: p.reference,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToPayment(data);
  },
  async update(id: string, u: Partial<Payment>): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (u.status !== undefined) payload.status = u.status;
    const { error } = await supabase.from("payments").update(payload).eq("id", id);
    if (error) throw error;
  },
};

// ---------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------
function rowToReview(r: any): Review {
  return {
    id: r.id,
    userId: r.user_id,
    userName: r.user_name,
    userEmail: r.user_email,
    companyId: r.company_id,
    bookingId: r.booking_id ?? undefined,
    destination: r.destination,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    status: r.status,
    createdAt: r.created_at,
  };
}

export const reviewStore = {
  async getAll(): Promise<Review[]> {
    const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToReview);
  },
  async add(r: Omit<Review, "id" | "createdAt">): Promise<Review> {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: r.userId,
        user_name: r.userName,
        user_email: r.userEmail,
        company_id: r.companyId,
        booking_id: r.bookingId ?? null,
        destination: r.destination,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        status: r.status,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToReview(data);
  },
  async update(id: string, u: Partial<Review>): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (u.status !== undefined) payload.status = u.status;
    if (u.comment !== undefined) payload.comment = u.comment;
    const { error } = await supabase.from("reviews").update(payload).eq("id", id);
    if (error) throw error;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) throw error;
  },
};

// ---------------------------------------------------------------
// Packages (unified customer-facing + company-managed)
// ---------------------------------------------------------------
function rowToTourPackage(r: any): TourPackage {
  return {
    id: r.id,
    companyId: r.company_id ?? undefined,
    name: r.title,
    destination: r.destination,
    duration: r.duration_days,
    maxGroupSize: r.max_group_size,
    price: Number(r.price_from),
    priceTo: Number(r.price_to),
    currency: r.currency,
    description: r.description ?? "",
    inclusions: r.inclusions ?? [],
    exclusions: r.exclusions ?? [],
    itinerary: r.itinerary ?? "",
    highlights: r.highlights ?? [],
    category: r.category,
    difficulty: r.difficulty,
    isActive: r.is_active,
    imageUrl: r.image ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export const packageStore = {
  async getAll(): Promise<TourPackage[]> {
    const { data, error } = await supabase.from("packages").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToTourPackage);
  },
  async add(p: Omit<TourPackage, "id" | "createdAt" | "updatedAt">): Promise<TourPackage> {
    const companyId = p.companyId ?? (await getMyCompanyId());
    const { data, error } = await supabase
      .from("packages")
      .insert({
        company_id: companyId,
        title: p.name,
        destination: p.destination,
        duration_days: p.duration,
        max_group_size: p.maxGroupSize,
        price_from: p.price,
        price_to: p.priceTo,
        currency: p.currency,
        description: p.description,
        inclusions: p.inclusions,
        exclusions: p.exclusions,
        itinerary: p.itinerary,
        highlights: p.highlights,
        category: p.category,
        difficulty: p.difficulty,
        is_active: p.isActive,
        image: p.imageUrl ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToTourPackage(data);
  },
  async update(id: string, u: Partial<TourPackage>): Promise<void> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (u.name !== undefined) payload.title = u.name;
    if (u.destination !== undefined) payload.destination = u.destination;
    if (u.duration !== undefined) payload.duration_days = u.duration;
    if (u.maxGroupSize !== undefined) payload.max_group_size = u.maxGroupSize;
    if (u.price !== undefined) payload.price_from = u.price;
    if (u.priceTo !== undefined) payload.price_to = u.priceTo;
    if (u.description !== undefined) payload.description = u.description;
    if (u.inclusions !== undefined) payload.inclusions = u.inclusions;
    if (u.exclusions !== undefined) payload.exclusions = u.exclusions;
    if (u.itinerary !== undefined) payload.itinerary = u.itinerary;
    if (u.highlights !== undefined) payload.highlights = u.highlights;
    if (u.category !== undefined) payload.category = u.category;
    if (u.difficulty !== undefined) payload.difficulty = u.difficulty;
    if (u.isActive !== undefined) payload.is_active = u.isActive;
    if (u.imageUrl !== undefined) payload.image = u.imageUrl;
    const { error } = await supabase.from("packages").update(payload).eq("id", id);
    if (error) throw error;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) throw error;
  },
};

// ---------------------------------------------------------------
// Customers (derived from bookings + profiles — no separate table to
// keep in sync; RLS on bookings already scopes this to "my company's
// customers" for a company caller)
// ---------------------------------------------------------------
export const customerStore = {
  async getAll(): Promise<CustomerProfile[]> {
    const { data: bookings, error } = await supabase.from("bookings").select("user_id");
    if (error) throw error;
    const userIds = [...new Set((bookings ?? []).map((b) => b.user_id))];
    if (userIds.length === 0) return [];

    const { data: profiles, error: pErr } = await supabase.from("profiles").select("*").in("id", userIds);
    if (pErr) throw pErr;

    return (profiles ?? []).map((p) => ({
      id: p.id,
      name: p.full_name,
      email: p.email,
      avatar: p.full_name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      avatarUrl: p.avatar_url ?? undefined,
      phone: p.phone ?? undefined,
      country: p.country ?? undefined,
      preferences: p.preferences ?? undefined,
      joinedAt: p.created_at,
    }));
  },
  async getById(id: string): Promise<CustomerProfile | undefined> {
    const { data } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    if (!data) return undefined;
    return {
      id: data.id,
      name: data.full_name,
      email: data.email,
      avatar: data.full_name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      avatarUrl: data.avatar_url ?? undefined,
      phone: data.phone ?? undefined,
      country: data.country ?? undefined,
      preferences: data.preferences ?? undefined,
      joinedAt: data.created_at,
    };
  },
};

// ---------------------------------------------------------------
// Company destinations (a company's own mini-catalog)
// ---------------------------------------------------------------
export interface CompanyDestination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl?: string;
}

function rowToCompanyDestination(r: any): CompanyDestination {
  return {
    id: r.id,
    name: r.name,
    country: r.country,
    description: r.description ?? "",
    imageUrl: r.image_url ?? undefined,
  };
}

export const companyDestinationStore = {
  async getAll(): Promise<CompanyDestination[]> {
    const { data, error } = await supabase.from("company_destinations").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToCompanyDestination);
  },
  async add(d: Omit<CompanyDestination, "id">): Promise<CompanyDestination> {
    const companyId = await getMyCompanyId();
    if (!companyId) throw new Error("You need a company account to add destinations.");
    const { data, error } = await supabase
      .from("company_destinations")
      .insert({ company_id: companyId, name: d.name, country: d.country, description: d.description, image_url: d.imageUrl ?? null })
      .select()
      .single();
    if (error) throw error;
    return rowToCompanyDestination(data);
  },
  async update(id: string, u: Partial<CompanyDestination>): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (u.name !== undefined) payload.name = u.name;
    if (u.country !== undefined) payload.country = u.country;
    if (u.description !== undefined) payload.description = u.description;
    if (u.imageUrl !== undefined) payload.image_url = u.imageUrl;
    const { error } = await supabase.from("company_destinations").update(payload).eq("id", id);
    if (error) throw error;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("company_destinations").delete().eq("id", id);
    if (error) throw error;
  },
};

// ---------------------------------------------------------------
// Favorites
// ---------------------------------------------------------------
export const favoriteStore = {
  async getDestinationIds(userId: string): Promise<Set<string>> {
    const { data, error } = await supabase.from("favorites").select("destination_id").eq("user_id", userId).not("destination_id", "is", null);
    if (error) throw error;
    return new Set((data ?? []).map((r) => r.destination_id as string));
  },
  async getPackageIds(userId: string): Promise<Set<string>> {
    const { data, error } = await supabase.from("favorites").select("package_id").eq("user_id", userId).not("package_id", "is", null);
    if (error) throw error;
    return new Set((data ?? []).map((r) => r.package_id as string));
  },
  async addDestination(userId: string, destinationId: string): Promise<void> {
    const { error } = await supabase.from("favorites").insert({ user_id: userId, destination_id: destinationId });
    if (error) throw error;
  },
  async removeDestination(userId: string, destinationId: string): Promise<void> {
    const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("destination_id", destinationId);
    if (error) throw error;
  },
  async addPackage(userId: string, packageId: string): Promise<void> {
    const { error } = await supabase.from("favorites").insert({ user_id: userId, package_id: packageId });
    if (error) throw error;
  },
  async removePackage(userId: string, packageId: string): Promise<void> {
    const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("package_id", packageId);
    if (error) throw error;
  },
};

// ---------------------------------------------------------------
// Travel buddies
// ---------------------------------------------------------------
export const travelBuddyStore = {
  async add(myUserId: string, buddyEmail: string): Promise<void> {
    const { data: buddyProfile, error: lookupErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", buddyEmail.toLowerCase())
      .maybeSingle();
    if (lookupErr) throw lookupErr;
    if (!buddyProfile) throw new Error("No Golden Tours account found with that email.");
    if (buddyProfile.id === myUserId) throw new Error("You can't add yourself as a travel buddy.");

    const { error } = await supabase.from("travel_buddies").insert({ user_id: myUserId, buddy_id: buddyProfile.id });
    if (error) {
      if (error.code === "23505") throw new Error("This traveler is already one of your buddies.");
      throw error;
    }
  },
  async remove(myUserId: string, buddyId: string): Promise<void> {
    const { error } = await supabase
      .from("travel_buddies")
      .delete()
      .or(`and(user_id.eq.${myUserId},buddy_id.eq.${buddyId}),and(user_id.eq.${buddyId},buddy_id.eq.${myUserId})`);
    if (error) throw error;
  },
};
