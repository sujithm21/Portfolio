"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import ThreeDScene from "@/components/ThreeDScene";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactForm from "@/components/ContactForm";
import AboutSection from "@/components/AboutSection";
import AchievementsSection from "@/components/AchievementsSection";
import ExperienceSection from "@/components/ExperienceSection"; // Import Experience Section

const DynamicParticles = dynamic(() => import("@/components/Particles"), {
  ssr: false,
});

export default function Home() {
  const [activeSection, setActiveSection] = useState("about");
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const sections = [
    "about",
    "projects",
    "skills",
    "experience",
    "achievements",
    "contact",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background text-foreground overflow-hidden">
      {/* Background Particles */}
      <DynamicParticles />

      {/* Navigation Bar */}
      <nav className="p-4 flex justify-between items-center z-10 relative">
        <motion.h1
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sujith Makam
        </motion.h1>

        <div className="flex space-x-4">
          {sections.map((section) => (
            <Button
              key={section}
              variant="ghost"
              onClick={() => setActiveSection(section)}
              className={activeSection === section ? "text-primary" : ""}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative"
          >
            <SunIcon
              className={`h-[1.2rem] w-[1.2rem] transition-transform ${
                theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
              }`}
            />
            <MoonIcon
              className={`absolute h-[1.2rem] w-[1.2rem] transition-transform ${
                theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
              }`}
            />
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* 3D Scene */}
        <div className="h-[40vh] mb-8">
          <Canvas>
            <ThreeDScene />
          </Canvas>
        </div>

        {/* Sections with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {activeSection === "about" && <AboutSection />}
            {activeSection === "experience" && <ExperienceSection />}
            {activeSection === "projects" && <ProjectsSection />}
            {activeSection === "skills" && <SkillsSection />}
            {activeSection === "achievements" && <AchievementsSection />}
            {activeSection === "contact" && <ContactForm />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-4 text-center relative z-10">
        <p>&copy; 2025 Sujith Makam. All rights reserved.</p>
      </footer>
    </div>
  );
}
