import { Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { AnimatedFooter } from "@/components/ui/animated-footer";
import logo from "@/assets/logo.png";

const socialLinks = [
  { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
  { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" },
  { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
  { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
];

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Alpha-AI", href: "#leaderboards" },
  { label: "About", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export const Footer = () => {
  return (
    <AnimatedFooter
      brandName="Camply"
      brandDescription="Turning college opportunities into measurable reputation. The first AI-powered campus opportunity ecosystem."
      brandIcon={<img src={logo} alt="Camply Logo" className="h-8 w-8" />}
      socialLinks={socialLinks}
      navLinks={navLinks}
      creatorName="Alpha Team"
      creatorUrl="#"
    />
  );
};
