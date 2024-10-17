"use client"

import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

const projects = [
  {
    title: "Project 1",
    description: "A revolutionary app that transforms ideas into reality.",
    imageUrl: "https://source.unsplash.com/random/800x600?tech",
    githubUrl: "https://github.com/yourusername/project1",
    liveUrl: "https://project1.com"
  },
  {
    title: "Project 2",
    description: "An AI-powered platform for predictive analytics.",
    imageUrl: "https://source.unsplash.com/random/800x600?ai",
    githubUrl: "https://github.com/yourusername/project2",
    liveUrl: "https://project2.com"
  },
  {
    title: "Project 3",
    description: "A blockchain solution for secure, decentralized transactions.",
    imageUrl: "https://source.unsplash.com/random/800x600?blockchain",
    githubUrl: "https://github.com/yourusername/project3",
    liveUrl: "https://project3.com"
  }
];

const ProjectsSection: React.FC = () => {
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
        My Projects
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 * (index + 1) }}
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectsSection;