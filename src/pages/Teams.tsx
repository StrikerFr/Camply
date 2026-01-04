import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Search,
  Plus,
  Users,
  Trophy,
  MessageCircle,
  UserPlus,
  Crown,
  Star,
  Filter,
  Loader2,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMyTeams } from "@/hooks/useTeams";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Fake teammate data
const FAKE_TEAMMATES = [
  {
    user_id: "1",
    full_name: "Sarah Chen",
    avatar_url: null,
    skills: ["React", "TypeScript", "Node.js", "UI/UX Design"],
    totalPoints: 2450,
    experience: "3 years",
    lookingFor: "Hackathon Team",
    bio: "Full-stack developer passionate about building impactful products",
    college: "MIT",
    status: "available"
  },
  {
    user_id: "2",
    full_name: "Alex Rivera",
    avatar_url: null,
    skills: ["Python", "Machine Learning", "Data Science", "TensorFlow"],
    totalPoints: 1890,
    experience: "2 years",
    lookingFor: "AI/ML Projects",
    bio: "ML enthusiast focused on NLP and computer vision",
    college: "Stanford",
    status: "available"
  },
  {
    user_id: "3",
    full_name: "Jordan Kim",
    avatar_url: null,
    skills: ["Java", "Spring Boot", "AWS", "Microservices"],
    totalPoints: 3200,
    experience: "4 years",
    lookingFor: "Backend Projects",
    bio: "Backend architect with cloud expertise",
    college: "Berkeley",
    status: "busy"
  },
  {
    user_id: "4",
    full_name: "Maya Patel",
    avatar_url: null,
    skills: ["Figma", "UI Design", "Prototyping", "User Research"],
    totalPoints: 1650,
    experience: "2 years",
    lookingFor: "Design Challenges",
    bio: "Product designer crafting delightful user experiences",
    college: "Parsons",
    status: "available"
  },
  {
    user_id: "5",
    full_name: "Chris Anderson",
    avatar_url: null,
    skills: ["React Native", "Flutter", "iOS", "Android"],
    totalPoints: 2100,
    experience: "3 years",
    lookingFor: "Mobile App Teams",
    bio: "Mobile developer building cross-platform apps",
    college: "Carnegie Mellon",
    status: "available"
  },
  {
    user_id: "6",
    full_name: "Emma Wilson",
    avatar_url: null,
    skills: ["Marketing", "Growth", "Analytics", "SEO"],
    totalPoints: 980,
    experience: "1 year",
    lookingFor: "Startup Teams",
    bio: "Growth marketer helping startups scale",
    college: "Wharton",
    status: "available"
  }
];

const Teams = () => {
  const [activeTab, setActiveTab] = useState<"my-teams" | "find">("my-teams");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<typeof FAKE_TEAMMATES[0] | null>(null);
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { profile } = useAuth();

  const { data: myTeams, isLoading: teamsLoading } = useMyTeams();

  const filteredTeammates = FAKE_TEAMMATES.filter((person) => {
    const matchesSearch = 
      person.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleConnect = (person: typeof FAKE_TEAMMATES[0]) => {
    if (connectedUsers.includes(person.user_id)) {
      setConnectedUsers(prev => prev.filter(id => id !== person.user_id));
      toast.info(`Disconnected from ${person.full_name}`);
    } else {
      setConnectedUsers(prev => [...prev, person.user_id]);
      toast.success(`Connection request sent to ${person.full_name}!`, {
        description: "They'll be notified about your request.",
      });
    }
  };

  const handleViewProfile = (person: typeof FAKE_TEAMMATES[0]) => {
    setSelectedPerson(person);
  };

  const handleCreateTeam = () => {
    setShowCreateTeamDialog(true);
  };

  const handleChat = (teamName: string) => {
    toast.success(`Opening chat for ${teamName}`, {
      description: "Team chat is coming soon!",
    });
  };

  const handleInvite = (teamName: string) => {
    toast.success(`Invite link copied!`, {
      description: `Share this link to invite members to ${teamName}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
              Teams
            </h1>
            <p className="text-muted-foreground">
              Manage your teams and find new teammates
            </p>
          </div>
          <Button 
            onClick={handleCreateTeam}
            className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 border-b border-border"
        >
          <button
            onClick={() => setActiveTab("my-teams")}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "my-teams"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            My Teams
          </button>
          <button
            onClick={() => setActiveTab("find")}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "find"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Find Teammates
          </button>
        </motion.div>

        {activeTab === "my-teams" ? (
          <div className="grid md:grid-cols-2 gap-4">
            {teamsLoading ? (
              <div className="col-span-2 flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : myTeams && myTeams.length > 0 ? (
              myTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        {team.name}
                        {team.leader_id === profile?.user_id && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{team.opportunity?.title || "No event"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-primary font-semibold">
                          <Trophy className="h-4 w-4" />
                          Active
                        </div>
                        <div className="text-xs text-muted-foreground">{team.members.length} members</div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 4).map((member, i) => (
                        <div
                          key={member.id}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground border-2 border-background"
                          title={member.profile?.full_name || "Member"}
                        >
                          {member.profile?.full_name?.charAt(0) || "?"}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {team.members.length} members
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:scale-[1.02] active:scale-95"
                      onClick={() => handleChat(team.name)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:scale-[1.02] active:scale-95"
                      onClick={() => handleInvite(team.name)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-2 text-center py-12"
              >
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No teams yet</h3>
                <p className="text-muted-foreground mb-4">Create your first team or join an existing one</p>
                <Button 
                  onClick={handleCreateTeam}
                  className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </motion.div>
            )}

            {/* Create Team Card */}
            {myTeams && myTeams.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Create a New Team</h3>
                <p className="text-sm text-muted-foreground">Start a team for an upcoming event</p>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by skills, name, or interests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowFilters(!showFilters);
                  toast.info(showFilters ? "Filters hidden" : "Filters coming soon!");
                }}
                className={cn(
                  "transition-all duration-200 hover:scale-[1.02] active:scale-95",
                  showFilters && "bg-primary/10 border-primary/50"
                )}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </motion.div>

            {/* Teammate Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeammates.length > 0 ? (
                filteredTeammates.map((person, index) => (
                  <motion.div
                    key={person.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="group relative overflow-hidden bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

                    <div className="relative flex flex-col h-full">
                      {/* Status + Points */}
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          variant={person.status === "available" ? "default" : "secondary"}
                          className="gap-2"
                        >
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              person.status === "available"
                                ? "bg-primary-foreground/90 pulse"
                                : "bg-secondary-foreground/60"
                            )}
                          />
                          {person.status === "available" ? "Available" : "Busy"}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                          <Trophy className="h-4 w-4 text-primary" />
                          {person.totalPoints.toLocaleString()}
                        </div>
                      </div>

                      {/* Profile */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-primary-foreground shadow-lg">
                            {person.full_name?.charAt(0) || "?"}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                            <Star className="h-3 w-3 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{person.full_name}</h3>
                          <p className="text-xs text-muted-foreground">{person.college}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                            {person.experience} experience
                          </p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-muted-foreground mb-3">
                        {person.bio}
                      </p>

                      {/* Looking For */}
                      <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-primary/5 rounded-lg">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary font-medium">{person.lookingFor}</span>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {person.skills.slice(0, 4).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="rounded-md px-2 py-1 text-xs font-medium"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {person.skills.length > 4 && (
                          <Badge variant="outline" className="rounded-md px-2 py-1 text-xs">
                            +{person.skills.length - 4} more
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex gap-2 pt-4 border-t border-border/50">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="flex-1 transition-all duration-200 hover:bg-secondary/80 hover:scale-[1.02] active:scale-95"
                          onClick={() => handleViewProfile(person)}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                        <Button 
                          size="sm" 
                          className={cn(
                            "flex-1 transition-all duration-200 hover:scale-[1.02] active:scale-95",
                            connectedUsers.includes(person.user_id) 
                              ? "bg-green-600 hover:bg-green-700 text-white" 
                              : "hover:shadow-lg hover:shadow-primary/20"
                          )}
                          onClick={() => handleConnect(person)}
                        >
                          {connectedUsers.includes(person.user_id) ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Connected
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No teammates found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or wait for more users to join</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Dialog */}
      <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold text-primary-foreground">
                {selectedPerson?.full_name?.charAt(0) || "?"}
              </div>
              <div>
                <div>{selectedPerson?.full_name}</div>
                <div className="text-sm font-normal text-muted-foreground">{selectedPerson?.college}</div>
              </div>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{selectedPerson?.totalPoints.toLocaleString()} points</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{selectedPerson?.experience} experience</span>
                </div>
                
                <p className="text-foreground">{selectedPerson?.bio}</p>
                
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Looking for: {selectedPerson?.lookingFor}</span>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPerson?.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="rounded-md px-2 py-1 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    onClick={() => {
                      toast.success(`Message sent to ${selectedPerson?.full_name}!`);
                      setSelectedPerson(null);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button 
                    className={cn(
                      "flex-1 transition-all duration-200 hover:scale-[1.02] active:scale-95",
                      selectedPerson && connectedUsers.includes(selectedPerson.user_id) 
                        ? "bg-green-600 hover:bg-green-700" 
                        : ""
                    )}
                    onClick={() => {
                      if (selectedPerson) handleConnect(selectedPerson);
                      setSelectedPerson(null);
                    }}
                  >
                    {selectedPerson && connectedUsers.includes(selectedPerson.user_id) ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Connected
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Create Team Dialog */}
      <Dialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create a New Team</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Team Name</label>
                  <Input placeholder="Enter team name..." className="bg-card" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                  <Input placeholder="What's your team about?" className="bg-card" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowCreateTeamDialog(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    onClick={() => {
                      toast.success("Team created successfully!", {
                        description: "Start inviting members to your team.",
                      });
                      setShowCreateTeamDialog(false);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Teams;
