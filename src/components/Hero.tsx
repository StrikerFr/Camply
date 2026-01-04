import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-[90vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <p 
          className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          Welcome to the future
        </p>
        <h1 
          className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] tracking-tight mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          Beautiful things
          <span className="block text-primary">happen here</span>
        </h1>
        <p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light opacity-0 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          We craft digital experiences that inspire, engage, and transform the way you connect with the world.
        </p>
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Button size="lg" className="group px-8 py-6 text-base">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-6 text-base">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
