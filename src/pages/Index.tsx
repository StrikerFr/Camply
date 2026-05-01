import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LeaderboardPreview } from "@/components/landing/LeaderboardPreview";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { Starfield } from "@/components/ui/starfield";

const Index = () => {

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Static Twinkling Starfield - Behind everything */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <Starfield starCount={120} />
      </div>
      
      {/* Shooting Stars Background */}
      <div className="fixed inset-0 pointer-events-none z-[5]">
        <ShootingStars
          starColor="#ffffff"
          trailColor="#f97316"
          starWidth={20}
          starHeight={3}
          minSpeed={8}
          maxSpeed={18}
          minDelay={1200}
          maxDelay={3000}
        />
        <ShootingStars
          starColor="#fbbf24"
          trailColor="#ef4444"
          starWidth={15}
          starHeight={2}
          minSpeed={6}
          maxSpeed={14}
          minDelay={1800}
          maxDelay={3500}
        />
        <ShootingStars
          starColor="#e879f9"
          trailColor="#8b5cf6"
          starWidth={18}
          starHeight={2}
          minSpeed={7}
          maxSpeed={16}
          minDelay={1500}
          maxDelay={3200}
        />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <ProblemSection />
          <HowItWorksSection />
          <FeaturesSection />
          <LeaderboardPreview />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
