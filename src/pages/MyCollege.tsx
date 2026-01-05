import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  GraduationCap, 
  Calendar, 
  Trophy, 
  Newspaper, 
  Users, 
  MapPin, 
  ExternalLink, 
  Clock,
  Code,
  Rocket,
  Star,
  Building2,
  X,
  Share2,
  Bell,
  MessageSquare,
  Send,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for IIT Patna
const COLLEGE_INFO = {
  name: "Indian Institute of Technology Patna",
  shortName: "IIT Patna",
  location: "Bihta, Patna, Bihar",
  established: "2008",
  website: "https://www.iitp.ac.in",
  logo: "🏛️"
};

const TABS = [
  { id: "events", label: "Events", icon: Calendar },
  { id: "hackathons", label: "Hackathons", icon: Code },
  { id: "news", label: "News", icon: Newspaper },
  { id: "competitions", label: "Competitions", icon: Trophy },
  { id: "clubs", label: "Clubs", icon: Users },
  { id: "reviews", label: "Anonymous Reviews", icon: MessageSquare },
];

const REVIEW_CATEGORIES = ["General", "Academics", "Placements", "Campus Life", "Faculty", "Infrastructure", "Food", "Hostels"];

interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
  location: string;
  isLive: boolean;
  highlights?: string[];
  organizer?: string;
  contact?: string;
}

const EVENTS: Event[] = [
  {
    id: "1",
    title: "Celesta 2026 - Annual Techno-Management Fest",
    date: "March 15-17, 2026",
    type: "Tech Fest",
    description: "The annual techno-management fest featuring competitions, workshops, and guest lectures.",
    location: "Main Campus",
    isLive: true,
    highlights: ["50+ Technical Events", "Guest Lectures by Industry Leaders", "Robotics Competitions", "Hackathons", "Workshops on AI/ML"],
    organizer: "Technical Affairs Council",
    contact: "celesta@iitp.ac.in"
  },
  {
    id: "2",
    title: "Anwesha 2026 - Cultural Festival",
    date: "February 20-22, 2026",
    type: "Cultural",
    description: "Annual cultural festival with music, dance, drama, and art competitions.",
    location: "Open Air Theatre",
    isLive: false,
    highlights: ["Pro Nights with Celebrity Performers", "Dance Competitions", "Battle of Bands", "Art Exhibition", "Stand-up Comedy Night"],
    organizer: "Cultural Affairs Council",
    contact: "anwesha@iitp.ac.in"
  },
  {
    id: "3",
    title: "Industry Connect Summit",
    date: "January 25, 2026",
    type: "Career",
    description: "Meet top recruiters and industry leaders. Networking opportunities for students.",
    location: "Lecture Hall Complex",
    isLive: false,
    highlights: ["1:1 Mentorship Sessions", "Resume Review", "Mock Interviews", "Networking Dinner", "Career Guidance Talks"],
    organizer: "Training & Placement Cell",
    contact: "placement@iitp.ac.in"
  }
];

interface Hackathon {
  id: string;
  title: string;
  date: string;
  prize: string;
  participants: number;
  status: string;
  themes: string[];
  description?: string;
  venue?: string;
  teamSize?: string;
  timeline?: string[];
}

const HACKATHONS: Hackathon[] = [
  {
    id: "1",
    title: "HackIITP 2026",
    date: "February 10-12, 2026",
    prize: "₹5,00,000",
    participants: 500,
    status: "Registration Open",
    themes: ["AI/ML", "Blockchain", "IoT", "FinTech"],
    description: "The flagship hackathon of IIT Patna. 48 hours of intense coding, mentorship from industry experts, and amazing prizes.",
    venue: "Innovation Centre, Main Campus",
    teamSize: "2-4 members",
    timeline: ["Day 1: Inauguration & Problem Statements", "Day 1-2: Hacking Phase (48 hrs)", "Day 3: Presentations & Judging", "Day 3: Prize Distribution"]
  },
  {
    id: "2",
    title: "Smart India Hackathon - Internal Round",
    date: "January 30, 2026",
    prize: "₹1,00,000",
    participants: 200,
    status: "Coming Soon",
    themes: ["Government", "Healthcare", "Education"],
    description: "Internal selection round for Smart India Hackathon. Top teams will represent IIT Patna at the national level.",
    venue: "Computer Science Block",
    teamSize: "6 members (mandatory)",
    timeline: ["Problem statement release: Jan 15", "Idea submission deadline: Jan 25", "Hackathon: Jan 30", "Results: Jan 31"]
  },
  {
    id: "3",
    title: "Code4Bihar",
    date: "March 5, 2026",
    prize: "₹2,50,000",
    participants: 300,
    status: "Registration Open",
    themes: ["Social Impact", "Agriculture", "Smart City"],
    description: "Build solutions for Bihar's challenges. Focus on social impact, agriculture tech, and smart city innovations.",
    venue: "Hybrid (Online + Campus)",
    teamSize: "2-5 members",
    timeline: ["Registration opens: Feb 1", "Mentorship sessions: Feb 20-28", "Hackathon: March 5-6", "Demo Day: March 7"]
  }
];

interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  category: string;
  content?: string;
  author?: string;
  link?: string;
}

const NEWS: NewsItem[] = [
  {
    id: "1",
    title: "IIT Patna ranked among top 20 engineering institutes in India",
    date: "2 days ago",
    source: "Times of India",
    category: "Rankings",
    content: "IIT Patna has secured a spot among the top 20 engineering institutes in India according to the NIRF Rankings 2026. The institute showed significant improvement in research output, faculty quality, and placement records. Director Prof. TN Singh attributed this success to the dedicated efforts of faculty and students.",
    author: "Education Desk",
    link: "https://timesofindia.com"
  },
  {
    id: "2",
    title: "New Research Centre for AI and Robotics inaugurated",
    date: "1 week ago",
    source: "IIT Patna News",
    category: "Campus",
    content: "The state-of-the-art AI and Robotics Research Centre was inaugurated by the Hon'ble Education Minister. The centre features advanced computing infrastructure, robotics labs, and collaboration spaces. It aims to foster cutting-edge research and industry partnerships in emerging technologies.",
    author: "IIT Patna PR Team",
    link: "https://iitp.ac.in/news"
  },
  {
    id: "3",
    title: "IIT Patna students win Smart India Hackathon 2025",
    date: "2 weeks ago",
    source: "Hindustan Times",
    category: "Achievements",
    content: "A team of six students from IIT Patna won the Smart India Hackathon 2025 in the Healthcare category. Their innovative solution for remote patient monitoring impressed the judges. The team received a cash prize of ₹1 lakh and mentorship opportunities from leading healthcare companies.",
    author: "Staff Reporter",
    link: "https://hindustantimes.com"
  },
  {
    id: "4",
    title: "Placement season 2025: Average package crosses ₹20 LPA",
    date: "3 weeks ago",
    source: "Economic Times",
    category: "Placements",
    content: "IIT Patna recorded its best placement season with an average package of ₹20.5 LPA. Top recruiters included Google, Microsoft, Goldman Sachs, and Flipkart. The highest domestic package stood at ₹65 LPA while international offers reached ₹1.2 Cr. Over 95% of eligible students received offers.",
    author: "Campus Bureau",
    link: "https://economictimes.com"
  }
];

interface Competition {
  id: string;
  title: string;
  date: string;
  prize: string;
  category: string;
  registrations: number;
  description: string;
  rules?: string[];
  eligibility?: string;
  teamSize?: string;
  venue?: string;
}

const COMPETITIONS: Competition[] = [
  {
    id: "1",
    title: "RoboWars Championship",
    date: "March 16, 2026",
    prize: "₹50,000",
    category: "Robotics",
    registrations: 45,
    description: "Build and battle combat robots in an arena showdown. Teams compete in weight categories with custom-designed bots.",
    rules: ["Max weight: 15kg", "No flame or liquid weapons", "Remote controlled only", "3-minute rounds"],
    eligibility: "All undergraduate students",
    teamSize: "2-4 members",
    venue: "Central Robotics Arena"
  },
  {
    id: "2",
    title: "Case Study Competition",
    date: "February 25, 2026",
    prize: "₹30,000",
    category: "Management",
    registrations: 120,
    description: "Analyze real-world business challenges and present innovative solutions to industry judges and mentors.",
    rules: ["20-minute presentation", "10-minute Q&A", "PPT mandatory", "No pre-prepared cases"],
    eligibility: "All students (UG & PG)",
    teamSize: "3-5 members",
    venue: "Lecture Hall Complex"
  },
  {
    id: "3",
    title: "Capture The Flag (CTF)",
    date: "January 28, 2026",
    prize: "₹25,000",
    category: "Cybersecurity",
    registrations: 80,
    description: "Test your hacking skills in this cybersecurity challenge. Solve puzzles, exploit vulnerabilities, and capture flags.",
    rules: ["No external help", "Internet allowed", "Original solutions only", "24-hour duration"],
    eligibility: "All students with basic programming knowledge",
    teamSize: "1-3 members",
    venue: "Online + Computer Centre"
  }
];

const CLUBS = [
  { 
    id: "1", 
    name: "Coding Club", 
    members: 450, 
    icon: "💻", 
    category: "Technical",
    description: "A community of passionate programmers solving complex problems, participating in competitive coding, and building innovative projects together.",
    events: 12,
    isJoined: false
  },
  { 
    id: "2", 
    name: "Robotics Society", 
    members: 180, 
    icon: "🤖", 
    category: "Technical",
    description: "Design, build, and program robots for national and international competitions. From drones to humanoids, we do it all!",
    events: 8,
    isJoined: true
  },
  { 
    id: "3", 
    name: "Music Club", 
    members: 200, 
    icon: "🎵", 
    category: "Cultural",
    description: "Express yourself through music! Weekly jam sessions, band performances, and opportunities to perform at college fests.",
    events: 15,
    isJoined: false
  },
  { 
    id: "4", 
    name: "Photography Club", 
    members: 150, 
    icon: "📷", 
    category: "Cultural",
    description: "Capture moments, learn professional photography techniques, and showcase your work in exhibitions and competitions.",
    events: 6,
    isJoined: false
  },
  { 
    id: "5", 
    name: "Entrepreneurship Cell", 
    members: 300, 
    icon: "🚀", 
    category: "Professional",
    description: "Turn ideas into startups! Networking with founders, startup workshops, and incubation support for aspiring entrepreneurs.",
    events: 20,
    isJoined: true
  },
  { 
    id: "6", 
    name: "Literary Society", 
    members: 120, 
    icon: "📚", 
    category: "Cultural",
    description: "For lovers of words - poetry slams, creative writing workshops, debates, and literary festivals throughout the year.",
    events: 10,
    isJoined: false
  },
];

interface Review {
  id: string;
  content: string;
  rating: number | null;
  category: string;
  created_at: string;
}

const MyCollege = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState<number>(5);
  const [newCategory, setNewCategory] = useState("General");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews
  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab]);

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const { data, error } = await supabase
        .from("college_reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.trim()) {
      toast.error("Please write a review");
      return;
    }
    if (newReview.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }
    if (newReview.trim().length > 1000) {
      toast.error("Review must be less than 1000 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("college_reviews")
        .insert({
          content: newReview.trim(),
          rating: newRating,
          category: newCategory,
        });
      
      if (error) throw error;
      
      toast.success("Review submitted anonymously!");
      setNewReview("");
      setNewRating(5);
      setNewCategory("General");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* College Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl p-6 lg:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl lg:text-5xl">
              {COLLEGE_INFO.logo}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">
                {COLLEGE_INFO.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {COLLEGE_INFO.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  Est. {COLLEGE_INFO.established}
                </span>
              </div>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <a href={COLLEGE_INFO.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex overflow-x-auto gap-2 pb-2"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "events" && (
            <div className="grid gap-4">
              {EVENTS.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {event.type}
                        </span>
                        {event.isLive && (
                          <span className="px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-500 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Live
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <Button onClick={() => setSelectedEvent(event)}>View Details</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "hackathons" && (
            <div className="grid gap-4 lg:grid-cols-2">
              {HACKATHONS.map((hackathon, index) => (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{hackathon.title}</h3>
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-full",
                      hackathon.status === "Registration Open" 
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {hackathon.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {hackathon.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {hackathon.participants}+ participants
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">{hackathon.prize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hackathon.themes.map((theme) => (
                      <span key={theme} className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground">
                        {theme}
                      </span>
                    ))}
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setSelectedHackathon(hackathon)}
                  >
                    View Details
                  </Button>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "news" && (
            <div className="grid gap-4">
              {NEWS.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedNews(news)}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {news.category}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground mt-2 group-hover:text-primary transition-colors">{news.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {news.date}
                        </span>
                        <span>•</span>
                        <span>{news.source}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "competitions" && (
            <div className="grid gap-4 lg:grid-cols-3">
              {COMPETITIONS.map((comp, index) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -6,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group"
                >
                  <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                    {comp.category}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mt-3 group-hover:text-primary transition-colors">{comp.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 group-hover:text-foreground/70 transition-colors">
                    {comp.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {comp.date}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">{comp.prize}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{comp.registrations} registered</span>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => setSelectedCompetition(comp)}
                  >
                    View Details
                  </Button>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "clubs" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CLUBS.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -6,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {club.icon}
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{club.name}</h3>
                        <p className="text-sm text-muted-foreground">{club.members} members</p>
                      </div>
                    </div>
                    {club.isJoined && (
                      <span className="px-2 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-500 rounded-full">
                        Joined
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4 line-clamp-2 group-hover:text-foreground/70 transition-colors">
                    {club.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                    <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                      {club.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {club.events} events
                    </span>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant={club.isJoined ? "outline" : "default"} 
                      size="sm" 
                      className="flex-1 group-hover:shadow-md transition-shadow"
                    >
                      {club.isJoined ? "View Club" : "Join Club"}
                    </Button>
                    <Button variant="ghost" size="sm" className="px-3">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Submit Review Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Anonymous User</p>
                    <p className="text-xs text-muted-foreground">Your identity is completely hidden</p>
                  </div>
                </div>
                
                <Textarea
                  placeholder="Share your honest thoughts about the college... Your identity will remain completely anonymous."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="min-h-[100px] resize-none mb-4"
                  maxLength={1000}
                />
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap gap-3">
                    <Select value={newCategory} onValueChange={setNewCategory}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {REVIEW_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={cn(
                              "h-5 w-5 transition-colors",
                              star <= newRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSubmitReview} 
                    disabled={isSubmitting || !newReview.trim()}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Posting..." : "Post Anonymously"}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-3">
                  {newReview.length}/1000 characters
                </p>
              </motion.div>

              {/* Reviews List */}
              {isLoadingReviews ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-muted" />
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-muted rounded" />
                          <div className="h-3 w-16 bg-muted rounded" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-muted rounded" />
                        <div className="h-4 w-3/4 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">Be the first to share your anonymous thoughts!</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Anonymous Student</p>
                            <p className="text-xs text-muted-foreground">{formatTimeAgo(review.created_at)}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                          {review.category}
                        </span>
                      </div>
                      
                      <p className="text-foreground/90 leading-relaxed mb-3">{review.content}</p>
                      
                      {review.rating && (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-4 w-4",
                                star <= review.rating!
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Event Details Dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {selectedEvent?.type}
                </span>
                {selectedEvent?.isLive && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-500 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              <DialogTitle className="text-xl">{selectedEvent?.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedEvent?.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  {selectedEvent?.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  {selectedEvent?.location}
                </span>
              </div>
              
              {selectedEvent?.highlights && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Highlights</h4>
                  <ul className="space-y-1.5">
                    {selectedEvent.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 text-primary" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(selectedEvent?.organizer || selectedEvent?.contact) && (
                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-2">Contact</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {selectedEvent?.organizer && <p>Organized by: {selectedEvent.organizer}</p>}
                    {selectedEvent?.contact && <p>Email: {selectedEvent.contact}</p>}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button className="flex-1">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Reminder
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Competition Details Dialog */}
        <Dialog open={!!selectedCompetition} onOpenChange={() => setSelectedCompetition(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                  {selectedCompetition?.category}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  {selectedCompetition?.prize}
                </span>
              </div>
              <DialogTitle className="text-xl">{selectedCompetition?.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedCompetition?.description}</p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{selectedCompetition?.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{selectedCompetition?.registrations} registered</span>
                </div>
                {selectedCompetition?.teamSize && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{selectedCompetition.teamSize}</span>
                  </div>
                )}
                {selectedCompetition?.venue && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{selectedCompetition.venue}</span>
                  </div>
                )}
              </div>
              
              {selectedCompetition?.eligibility && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="text-xs text-muted-foreground">Eligibility: </span>
                  <span className="text-sm text-foreground">{selectedCompetition.eligibility}</span>
                </div>
              )}
              
              {selectedCompetition?.rules && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Rules</h4>
                  <ul className="space-y-1.5">
                    {selectedCompetition.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button className="flex-1">
                  Register Now
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Hackathon Details Dialog */}
        <Dialog open={!!selectedHackathon} onOpenChange={() => setSelectedHackathon(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-full",
                  selectedHackathon?.status === "Registration Open" 
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-muted text-muted-foreground"
                )}>
                  {selectedHackathon?.status}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  {selectedHackathon?.prize}
                </span>
              </div>
              <DialogTitle className="text-xl">{selectedHackathon?.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedHackathon?.description}</p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{selectedHackathon?.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{selectedHackathon?.participants}+ participants</span>
                </div>
                {selectedHackathon?.teamSize && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{selectedHackathon.teamSize}</span>
                  </div>
                )}
                {selectedHackathon?.venue && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{selectedHackathon.venue}</span>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedHackathon?.themes.map((theme) => (
                    <span key={theme} className="px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
              
              {selectedHackathon?.timeline && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Timeline</h4>
                  <ul className="space-y-1.5">
                    {selectedHackathon.timeline.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" disabled={selectedHackathon?.status !== "Registration Open"}>
                  {selectedHackathon?.status === "Registration Open" ? "Register Now" : "Coming Soon"}
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* News Details Dialog */}
        <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {selectedNews?.category}
                </span>
              </div>
              <DialogTitle className="text-xl leading-tight">{selectedNews?.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  {selectedNews?.date}
                </span>
                <span>•</span>
                <span>{selectedNews?.source}</span>
                {selectedNews?.author && (
                  <>
                    <span>•</span>
                    <span>By {selectedNews.author}</span>
                  </>
                )}
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {selectedNews?.content}
              </p>
              
              <div className="flex gap-2 pt-2">
                {selectedNews?.link && (
                  <Button className="flex-1" asChild>
                    <a href={selectedNews.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Read Full Article
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MyCollege;
