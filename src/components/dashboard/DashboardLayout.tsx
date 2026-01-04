import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Trophy, 
  User,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronDown,
  Briefcase,
  GraduationCap,
  Rocket,
  MessageSquare,
  FileText,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: Rocket, label: "Opportunities", href: "/opportunities" },
  { icon: Briefcase, label: "Internships", href: "/opportunities?category=internship" },
  { icon: GraduationCap, label: "Competitions", href: "/opportunities?category=competition" },
  { icon: Users, label: "Teams", href: "/teams" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
];

const externalLinks = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
  { label: "Unstop", href: "https://unstop.com", icon: "🚀" },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <img src={logo} alt="Camply" className="h-9 w-9 rounded-xl" />
              <span className="hidden sm:block text-lg font-display font-bold text-foreground tracking-tight">Camply</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href.includes('?') && location.pathname === '/opportunities');
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              
              {/* External Links Dropdown */}
              <div className="relative ml-1 group">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                  <ExternalLink className="h-4 w-4" />
                  More
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-elevated opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {externalLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span>{link.icon}</span>
                      {link.label}
                      <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                className="pl-10 h-10 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-border rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative h-10 w-10 p-0 hover:bg-muted">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </Button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-sm font-semibold text-background">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
                <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-lg shadow-elevated overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-border">
                      <p className="font-semibold text-sm text-foreground">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        View Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-sm text-primary hover:bg-primary/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-8 w-8 p-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border bg-card overflow-hidden"
            >
              <nav className="p-3 space-y-0.5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                
                {/* External links in mobile */}
                <div className="pt-2 mt-2 border-t border-border">
                  <p className="px-3 py-1.5 text-xs text-muted-foreground font-medium">External Links</p>
                  {externalLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    >
                      <span>{link.icon}</span>
                      {link.label}
                      <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                    </a>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-5 lg:py-6">
        {children}
      </main>

      {/* Click outside to close profile menu */}
      {profileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setProfileMenuOpen(false)} 
        />
      )}
    </div>
  );
};
