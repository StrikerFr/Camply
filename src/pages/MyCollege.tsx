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
  Building2,
  X,
  Share2,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const MyCollege = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
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
      </div>
    </DashboardLayout>
  );
};

export default MyCollege;
