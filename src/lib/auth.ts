export type UserRole = "user" | "company";

export interface TravelBuddy {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  addedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  avatarUrl?: string;
  companyName?: string; // only for company accounts
  language?: "en" | "sw";
  travelBuddies?: TravelBuddy[];
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    companyName?: string,
    language?: "en" | "sw",
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}
