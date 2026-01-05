import { motion } from "framer-motion";
import { useState } from "react";
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
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
];

const EVENTS = [
  {
    id: "1",
    title: "Celesta 2026 - Annual Techno-Management Fest",
    date: "March 15-17, 2026",
    type: "Tech Fest",
    description: "The annual techno-management fest featuring competitions, workshops, and guest lectures.",
    location: "Main Campus",
    isLive: true
  },
  {
    id: "2",
    title: "Anwesha 2026 - Cultural Festival",
    date: "February 20-22, 2026",
    type: "Cultural",
    description: "Annual cultural festival with music, dance, drama, and art competitions.",
    location: "Open Air Theatre",
    isLive: false
  },
  {
    id: "3",
    title: "Industry Connect Summit",
    date: "January 25, 2026",
    type: "Career",
    description: "Meet top recruiters and industry leaders. Networking opportunities for students.",
    location: "Lecture Hall Complex",
    isLive: false
  }
];

const HACKATHONS = [
  {
    id: "1",
    title: "HackIITP 2026",
    date: "February 10-12, 2026",
    prize: "₹5,00,000",
    participants: 500,
    status: "Registration Open",
    themes: ["AI/ML", "Blockchain", "IoT", "FinTech"]
  },
  {
    id: "2",
    title: "Smart India Hackathon - Internal Round",
    date: "January 30, 2026",
    prize: "₹1,00,000",
    participants: 200,
    status: "Coming Soon",
    themes: ["Government", "Healthcare", "Education"]
  },
  {
    id: "3",
    title: "Code4Bihar",
    date: "March 5, 2026",
    prize: "₹2,50,000",
    participants: 300,
    status: "Registration Open",
    themes: ["Social Impact", "Agriculture", "Smart City"]
  }
];

const NEWS = [
  {
    id: "1",
    title: "IIT Patna ranked among top 20 engineering institutes in India",
    date: "2 days ago",
    source: "Times of India",
    category: "Rankings"
  },
  {
    id: "2",
    title: "New Research Centre for AI and Robotics inaugurated",
    date: "1 week ago",
    source: "IIT Patna News",
    category: "Campus"
  },
  {
    id: "3",
    title: "IIT Patna students win Smart India Hackathon 2025",
    date: "2 weeks ago",
    source: "Hindustan Times",
    category: "Achievements"
  },
  {
    id: "4",
    title: "Placement season 2025: Average package crosses ₹20 LPA",
    date: "3 weeks ago",
    source: "Economic Times",
    category: "Placements"
  }
];

const COMPETITIONS = [
  {
    id: "1",
    title: "RoboWars Championship",
    date: "March 16, 2026",
    prize: "₹50,000",
    category: "Robotics",
    registrations: 45
  },
  {
    id: "2",
    title: "Case Study Competition",
    date: "February 25, 2026",
    prize: "₹30,000",
    category: "Management",
    registrations: 120
  },
  {
    id: "3",
    title: "Capture The Flag (CTF)",
    date: "January 28, 2026",
    prize: "₹25,000",
    category: "Cybersecurity",
    registrations: 80
  }
];

const CLUBS = [
  { id: "1", name: "Coding Club", members: 450, icon: "💻", category: "Technical" },
  { id: "2", name: "Robotics Society", members: 180, icon: "🤖", category: "Technical" },
  { id: "3", name: "Music Club", members: 200, icon: "🎵", category: "Cultural" },
  { id: "4", name: "Photography Club", members: 150, icon: "📷", category: "Cultural" },
  { id: "5", name: "Entrepreneurship Cell", members: 300, icon: "🚀", category: "Professional" },
  { id: "6", name: "Literary Society", members: 120, icon: "📚", category: "Cultural" },
];

const MyCollege = () => {
  const [activeTab, setActiveTab] = useState("events");

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
                    <Button>View Details</Button>
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
                  <div className="flex flex-wrap gap-2">
                    {hackathon.themes.map((theme) => (
                      <span key={theme} className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground">
                        {theme}
                      </span>
                    ))}
                  </div>
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
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {news.category}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground mt-2">{news.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {news.date}
                        </span>
                        <span>•</span>
                        <span>{news.source}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground shrink-0" />
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
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
                >
                  <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                    {comp.category}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mt-3">{comp.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
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
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                      {club.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{club.name}</h3>
                      <p className="text-sm text-muted-foreground">{club.members} members</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                      {club.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default MyCollege;
