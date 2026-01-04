import { Sparkles, Zap, Heart } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Thoughtful Design",
    description: "Every detail is carefully considered to create experiences that feel natural and intuitive.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with performance in mind, ensuring your experience is smooth and responsive.",
  },
  {
    icon: Heart,
    title: "Made with Care",
    description: "We pour our passion into every project, treating each one as a work of art.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-4">
            Why choose us
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We believe in the power of simplicity and elegance.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group text-center p-8 rounded-2xl transition-all duration-300 hover:bg-card hover:shadow-soft"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6 transition-transform group-hover:scale-110">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-medium mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
