"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const achievements = [
  {
    title: "TCS TechBytes: Dharwad Regional Finals Runner Up",
    description: "A Prestigious Tech Quiz conducted by TCS and BITES in Karnataka",
    year: "2024"
  },
  {
    title: "State Topper: Andhra Pradesh State Board Topper",
    description: "Scored 990/1000 in my state board examinations",
    year: "2021"
  }
];

const AchievementsSection: React.FC = () => {
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
        Achievements
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{achievement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{achievement.description}</p>
                <p className="text-sm text-muted-foreground mt-2">{achievement.year}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AchievementsSection;