import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-glow opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal direction="scale">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Ready to transform your college experience?
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
              Start Building Your
              <br />
              <span className="text-gradient">Campus Reputation</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of students already using Camply to discover opportunities, 
              form winning teams, and build a verified track record of achievements.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3} direction="up">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="hero" size="xl" className="group [&_svg]:size-5">
                  Get Started Free
                  <span className="arrow-premium">
                    <ArrowRight className="arrow-icon" />
                    <span className="arrow-glow" />
                  </span>
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="hero-outline" size="xl">
                  Already have an account?
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required. Free forever for students.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
