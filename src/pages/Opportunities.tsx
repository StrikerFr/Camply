import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Search,
  Filter,
  Calendar,
  MapPin,
  Zap,
  Clock,
  Users,
  Bookmark,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOpportunities, useRegisterForOpportunity, useUserOpportunities } from "@/hooks/useOpportunities";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const categories = ["All", "Hackathon", "Competition", "Workshop", "Career", "Conference"];

const categoryEmojis: Record<string, string> = {
  Hackathon: "🚀",
  Competition: "🏆",
  Workshop: "🤖",
  Career: "🎓",
  Conference: "🎤",
  default: "✨"
};

const Opportunities = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: opportunities, isLoading } = useOpportunities();
  const { data: userOpportunities } = useUserOpportunities();
  const registerMutation = useRegisterForOpportunity();

  const registeredIds = new Set(userOpportunities?.map(uo => uo.opportunity_id) || []);

  const filteredOpportunities = opportunities?.filter((opp) => {
    const matchesCategory = activeCategory === "All" || opp.category === activeCategory;
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (opp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesCategory && matchesSearch;
  }) || [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBD";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const getTeamSize = (min: number | null, max: number | null) => {
    if (!min && !max) return "Individual";
    if (min === max) return min === 1 ? "Individual" : `${min} members`;
    return `${min || 1}-${max || "∞"}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
              Discover Opportunities
            </h1>
            <p className="text-muted-foreground">
              Find and register for events that match your interests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>{opportunities?.length || 0} opportunities available</span>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Opportunities Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOpportunities.map((opp, index) => {
              const isRegistered = registeredIds.has(opp.id);
              
              return (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
                        {categoryEmojis[opp.category] || categoryEmojis.default}
                      </div>
                      <div className="flex gap-2">
                        {opp.is_featured && (
                          <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                            Featured
                          </span>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                          <Bookmark className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>

                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {opp.category}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
                      {opp.title}
                    </h3>
                    {opp.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{opp.description}</p>
                    )}

                    {/* Meta Info */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(opp.registration_deadline)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {opp.location || "TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {getTeamSize(opp.team_size_min, opp.team_size_max)}
                        </span>
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <Zap className="h-4 w-4" />
                          {opp.points} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-4 border-t border-border flex items-center justify-between bg-muted">
                    <span className="text-xs text-muted-foreground">
                      Event: {formatDate(opp.date)}
                    </span>
                    {isRegistered ? (
                      <Button size="sm" variant="secondary" disabled>
                        Registered ✓
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={() => registerMutation.mutate(opp.id)}
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Register
                            <ArrowUpRight className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No opportunities found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Opportunities;
