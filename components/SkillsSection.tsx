"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress"

const skills = [
  { name: 'React', level: 90 },
  { name: 'Next.js', level: 85 },
  { name: 'TypeScript', level: 80 },
  { name: 'Three.js', level: 75 },
  { name: 'Node.js', level: 85 },
  { name: 'CSS/Tailwind', level: 90 },
];

const SkillsSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        My Skills
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill, index) => (
          <motion.div 
            key={index} 
            className="mb-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
            <Progress value={skill.level} className="w-full" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsSection;