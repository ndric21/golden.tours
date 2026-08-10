import { supabase } from "@/integrations/supabase/client";

export interface CompanyReview {
  id: string;
  reviewerName: string;
  reviewerInitial: string;
  rating: number;
  comment: string;
  date: string;
  tripType: string;
}

export interface TourCompany {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  description: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  category: "safari" | "beach" | "mountain" | "cultural" | "adventure";
  established: string;
  location: string;
  reviews: CompanyReview[];
  isSeeded: boolean;
}

/** Fetch every tour company on the marketplace (platform-seeded + self-registered), with their approved reviews. */
export async function getAllCompanies(): Promise<TourCompany[]> {
  const { data: companies, error } = await supabase.from("companies").select("*").order("rating", { ascending: false });
  if (error) throw error;
  if (!companies || companies.length === 0) return [];

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .in(
      "company_id",
      companies.map((c) => c.id)
    );

  return companies.map((c) => ({
    id: c.id,
    name: c.name,
    tagline: c.tagline,
    emoji: c.emoji,
    description: c.description,
    rating: Number(c.rating),
    reviewCount: c.review_count,
    specialties: c.specialties ?? [],
    category: c.category,
    established: c.established,
    location: c.location,
    isSeeded: c.is_seeded,
    reviews: (reviews ?? [])
      .filter((r) => r.company_id === c.id)
      .map((r) => ({
        id: r.id,
        reviewerName: r.user_name,
        reviewerInitial: r.user_name?.[0]?.toUpperCase() ?? "G",
        rating: r.rating,
        comment: r.comment,
        date: r.created_at,
        tripType: r.destination,
      })),
  }));
}
