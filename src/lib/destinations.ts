import { supabase } from "@/integrations/supabase/client";

export type Destination = {
  id: string;
  slug: string;
  name: string;
  tag: string;
  category: "Beach" | "Safari" | "Mountain" | "Heritage" | "Island" | "Crater" | "Forest" | "Park" | "Lake";
  rating: number;
  image: string;
  images: string[];
  description: string;
  highlights: string[];
  country: string;
};

export type Package = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  priceFrom: number;
  priceTo: number;
  bestFor: "Couple" | "Family" | "Group" | "Solo";
  image: string;
  highlights: string[];
  companyId?: string;
};

function rowToDestination(r: any): Destination {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tag: r.tag,
    category: r.category,
    rating: Number(r.rating),
    image: r.image,
    images: r.images ?? [],
    description: r.description,
    highlights: r.highlights ?? [],
    country: r.country,
  };
}

function rowToPackage(r: any): Package {
  return {
    id: r.id,
    title: r.title,
    destination: r.destination,
    duration: `${r.duration_days} days`,
    priceFrom: Number(r.price_from),
    priceTo: Number(r.price_to),
    bestFor: r.best_for ?? "Solo",
    image: r.image ?? "",
    highlights: r.highlights ?? [],
    companyId: r.company_id ?? undefined,
  };
}

export async function getDestinations(): Promise<Destination[]> {
  const { data, error } = await supabase.from("destinations").select("*").order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToDestination);
}

export async function getDestinationById(id: string): Promise<Destination | undefined> {
  const { data } = await supabase.from("destinations").select("*").eq("id", id).maybeSingle();
  return data ? rowToDestination(data) : undefined;
}

export async function getPackages(): Promise<Package[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToPackage);
}
