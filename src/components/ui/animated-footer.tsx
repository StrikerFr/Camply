"use client";
import React from "react";
import { NotepadTextDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShootingStars } from "./shooting-stars";
import { Starfield } from "./starfield";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface AnimatedFooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

export const AnimatedFooter = ({
  brandName = "YourBrand",
  brandDescription = "Your description here",
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  brandIcon,
  className,
}: AnimatedFooterProps) => {
  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden bg-background pt-24 pb-12",
        className
      )}
    >
      {/* Twinkling starfield */}
      <Starfield starCount={120} className="opacity-80" />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/15 blur-[80px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-40 rounded-full bg-primary/20 blur-[120px]"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scaleX: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center pt-8">
          {/* Main Content */}
          <div className="flex w-full flex-col items-center gap-12 text-center">
            {/* Brand Section with glow */}
            <motion.div 
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Brand Name with Icon */}
              <motion.div 
                className="group flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div 
                  className="relative flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Glow behind icon */}
                  <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    {brandIcon}
                  </div>
                </motion.div>
                <h2 className="text-4xl font-display font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                  {brandName}
                </h2>
              </motion.div>

              {/* Description with gradient text on hover */}
              <motion.p 
                className="max-w-md text-muted-foreground text-lg hover:text-foreground transition-colors duration-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {brandDescription}
              </motion.p>
            </motion.div>

            {/* Social Links with crazy hover effects */}
            {socialLinks.length > 0 && (
              <motion.div 
                className="flex flex-wrap justify-center gap-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                    whileHover={{ scale: 1.15, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    aria-label={link.label}
                  >
                    {/* Outer glow ring */}
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary via-primary/50 to-primary opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 group-hover:animate-pulse" />
                    
                    {/* Inner glow */}
                    <div className="absolute -inset-1 rounded-full bg-primary/30 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />
                    
                    {/* Icon container */}
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary/20 group-hover:text-primary group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                      <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                        {link.icon}
                      </span>
                    </div>
                    
                    {/* Tooltip */}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {link.label}
                    </span>
                  </motion.a>
                ))}
              </motion.div>
            )}

            {/* Navigation Links with underline animation */}
            {navLinks.length > 0 && (
              <motion.nav 
                className="flex flex-wrap justify-center gap-x-10 gap-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {navLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    className="group relative text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-primary/50 transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />
                    {/* Glow on hover */}
                    <span className="absolute inset-0 -z-10 rounded bg-primary/0 blur-sm transition-all duration-300 group-hover:bg-primary/10" />
                  </motion.a>
                ))}
              </motion.nav>
            )}
          </div>

          {/* Bottom Section */}
          <motion.div 
            className="mt-20 flex w-full flex-col items-center justify-between gap-4 pt-8 md:flex-row"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
              ©{new Date().getFullYear()} {brandName}. All rights reserved.
            </p>

            {creatorName && creatorUrl && (
              <motion.p 
                className="text-sm text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <a
                  href={creatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-1 transition-colors duration-300 hover:text-primary"
                >
                  Made with 
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-primary"
                  >
                    ❤️
                  </motion.span> 
                  by {creatorName}
                </a>
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Large background text with shimmer effect */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-32 select-none overflow-hidden text-center text-[15vw] font-display font-black uppercase leading-none tracking-tighter"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="bg-gradient-to-r from-foreground/[0.02] via-foreground/[0.08] to-foreground/[0.02] bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer">
            {brandName.toUpperCase()}
          </span>
        </motion.div>

        {/* Bottom glow effect - more dramatic */}
        <motion.div 
          className="absolute -bottom-32 left-1/2 h-64 w-[90%] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              left: `${15 + i * 15}%`,
              bottom: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </footer>
  );
};
