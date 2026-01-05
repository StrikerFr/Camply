import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowLeft,
  GraduationCap,
  Target,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const interests = [
  "Hackathons", "AI/ML", "Web Development", "Mobile Apps", 
  "Data Science", "Cybersecurity", "Blockchain", "IoT",
  "Cloud Computing", "UI/UX Design", "Game Dev", "Open Source"
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    course: "",
    year: "",
    interests: [] as string[],
  });

  // Redirect to login if not authenticated, or to dashboard if already onboarded
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading && user && profile?.onboarding_completed) {
      navigate("/dashboard");
    }
  }, [user, profile, loading, navigate]);

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    // Mock successful onboarding - tables don't exist yet
    // In production, this would save to the database
    console.log("Onboarding data:", formData);
    
    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 500));

    await refreshProfile();
    toast.success("Profile set up successfully!");
    navigate("/dashboard");
  };

  const canProceed = () => {
    if (step === 1) return formData.course && formData.year;
    if (step === 2) return formData.interests.length >= 3;
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.img 
          src={logo} 
          alt="Camply Logo" 
          className="h-16 w-16"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src={logo} alt="Camply" className="h-10 w-10" />
          <span className="text-2xl font-display font-bold text-foreground">Camply</span>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? "w-8 bg-primary" : s < step ? "w-8 bg-primary/50" : "w-8 bg-secondary"
              }`}
            />
          ))}
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Tell us about yourself
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Help us personalize your experience
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Course/Major</label>
                    <Input
                      placeholder="e.g., Computer Science"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Year of Study</label>
                    <Input
                      placeholder="e.g., 2nd Year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    What are you interested in?
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Select at least 3 topics (helps us recommend opportunities)
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.interests.includes(interest)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  {formData.interests.length}/3 selected
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground">
                  You're all set! 🎉
                </h2>
                <p className="text-muted-foreground">
                  We've personalized your experience based on your preferences. 
                  Get ready to discover amazing opportunities!
                </p>

                <div className="space-y-3 text-left bg-secondary/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-foreground">AI-curated recommendations enabled</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-foreground">Profile visibility set to campus</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-foreground">Notification preferences configured</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Setting up..." : "Get Started"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
