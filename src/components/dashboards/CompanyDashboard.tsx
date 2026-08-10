import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  MapPin,
  Package,
  MessageSquare,
  Mail,
  CreditCard,
  Star,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import { Overview } from "./company/Overview";
import { BookingsSection } from "./company/Bookings";
import { CustomersSection } from "./company/Customers";
import { DestinationsSection } from "./company/Destinations";
import { PackagesSection } from "./company/Packages";
import { ChatLogsSection } from "./company/ChatLogs";
import { EnquiriesSection } from "./company/Enquiries";
import { PaymentsSection } from "./company/Payments";
import { ReviewsSection } from "./company/Reviews";
import { ReportsSection } from "./company/Reports";
import { SettingsSection } from "./company/SettingsSection";

export type CompanySection =
  | "overview"
  | "bookings"
  | "customers"
  | "destinations"
  | "packages"
  | "ai-logs"
  | "enquiries"
  | "payments"
  | "reviews"
  | "reports"
  | "settings";

const navItems: {
  id: CompanySection;
  label: string;
  icon: typeof LayoutDashboard;
  group?: string;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Calendar, group: "Operations" },
  { id: "customers", label: "Customers", icon: Users },
  { id: "destinations", label: "Destinations", icon: MapPin },
  { id: "packages", label: "Tour Packages", icon: Package },
  { id: "ai-logs", label: "AI Chat Logs", icon: MessageSquare, group: "Leads" },
  { id: "enquiries", label: "Enquiries", icon: Mail },
  { id: "payments", label: "Payments", icon: CreditCard, group: "Finance" },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "settings", label: "Settings", icon: Settings, group: "Account" },
];

const sectionTitles: Record<CompanySection, { title: string; subtitle: string }> = {
  overview: { title: "Dashboard Overview", subtitle: "Your business at a glance" },
  bookings: { title: "Bookings", subtitle: "All customer bookings and reservations" },
  customers: { title: "Customers", subtitle: "Registered traveler profiles and history" },
  destinations: { title: "Destinations", subtitle: "Manage your travel destinations" },
  packages: { title: "Tour Packages", subtitle: "Create and manage your tour packages" },
  "ai-logs": { title: "AI Chat Logs", subtitle: "Conversations from your AI assistant" },
  enquiries: { title: "Enquiries", subtitle: "Leads and customer enquiries" },
  payments: { title: "Payments", subtitle: "Transaction history and financials" },
  reviews: { title: "Reviews", subtitle: "Customer feedback and moderation" },
  reports: { title: "Reports", subtitle: "Analytics, trends and performance" },
  settings: { title: "Settings", subtitle: "Company profile and configuration" },
};

export function CompanyDashboard() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState<CompanySection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const meta = sectionTitles[section];

  let renderedGroups: string[] = [];
  const renderNav = () =>
    navItems.map((item) => {
      const showGroup = item.group && !renderedGroups.includes(item.group);
      if (showGroup && item.group) renderedGroups.push(item.group);
      return (
        <div key={item.id}>
          {showGroup && (
            <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
              {item.group}
            </p>
          )}
          <button
            onClick={() => {
              setSection(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              section === item.id
                ? "bg-gradient-to-r from-amber-500/20 to-yellow-400/10 text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon
              className={`h-4 w-4 flex-shrink-0 ${section === item.id ? "text-amber-400" : "text-white/40"}`}
            />
            <span>{item.label}</span>
            {section === item.id && <ChevronRight className="h-3 w-3 ml-auto text-amber-400/60" />}
          </button>
        </div>
      );
    });

  renderedGroups = [];

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 flex-shrink-0
          bg-[#0f0f0f] border-r border-white/5 flex flex-col
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Building2 className="h-5 w-5 text-black" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">
                {user?.companyName || user?.name || "Company"}
              </p>
              <p className="text-[10px] text-white/30 mt-0.5">Business Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin">
          {renderNav()}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-xs font-bold text-black">
              {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 h-14 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center gap-4 px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-white truncate">{meta.title}</h1>
            <p className="text-[11px] text-white/30 truncate hidden sm:block">{meta.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Live
            </span>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] scrollbar-thin">
          <div className="p-6 max-w-7xl mx-auto">
            {section === "overview" && <Overview setSection={setSection} />}
            {section === "bookings" && <BookingsSection />}
            {section === "customers" && <CustomersSection />}
            {section === "destinations" && <DestinationsSection />}
            {section === "packages" && <PackagesSection />}
            {section === "ai-logs" && <ChatLogsSection />}
            {section === "enquiries" && <EnquiriesSection />}
            {section === "payments" && <PaymentsSection />}
            {section === "reviews" && <ReviewsSection />}
            {section === "reports" && <ReportsSection />}
            {section === "settings" && <SettingsSection />}
          </div>
        </main>
      </div>
    </div>
  );
}
