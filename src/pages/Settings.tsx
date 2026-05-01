import { motion } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      id: "dark" as const,
      label: "Night Mode",
      description: "Dark theme with minimal red accents",
      icon: Moon,
    },
    {
      id: "light" as const,
      label: "Day Mode",
      description: "Light theme with clean design",
      icon: Sun,
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">Customize your experience</p>

        {/* Appearance Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Appearance</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Choose between day and night mode
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={cn(
                  "relative flex flex-col items-start gap-3 p-5 rounded-xl border-2 transition-all duration-200 text-left",
                  theme === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30 bg-background"
                )}
              >
                {/* Selected indicator */}
                {theme === option.id && (
                  <motion.div
                    layoutId="theme-indicator"
                    className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-primary"
                  />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    theme === option.id
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <option.icon className="w-6 h-6" />
                </div>

                {/* Text */}
                <div>
                  <p className="font-semibold text-foreground">{option.label}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                </div>

                {/* Preview bar */}
                <div
                  className={cn(
                    "w-full h-8 rounded-lg flex items-center gap-2 px-3 mt-2",
                    option.id === "dark"
                      ? "bg-[#0a0a0a] border border-[#1a1a1a]"
                      : "bg-white border border-gray-200"
                  )}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      option.id === "dark" ? "bg-red-500" : "bg-red-500"
                    )}
                  />
                  <div
                    className={cn(
                      "flex-1 h-1.5 rounded-full",
                      option.id === "dark" ? "bg-[#222]" : "bg-gray-200"
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Settings;
