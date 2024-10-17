"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const AboutSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row items-center justify-between"
    >
      <div className="md:w-1/2 mb-8 md:mb-0">
        <motion.h2 
          className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          About Me
        </motion.h2>
        <motion.p 
          className="text-lg mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
        >
          I'm a passionate developer with expertise in creating stunning web applications. 
          My journey in tech started with a curiosity for problem-solving and has evolved into 
          a love for crafting beautiful, user-centric digital experiences.
        </motion.p>
        <motion.p 
          className="text-lg"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
        >
          When I'm not coding, you can find me exploring new technologies, contributing to 
          open-source projects, or enjoying a good book on software architecture and design patterns.
        </motion.p>
      </div>
      <motion.div 
        className="md:w-1/3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Image
          src="https://source.unsplash.com/random/400x400?portrait"
          alt="Your Name"
          width={400}
          height={400}
          className="rounded-full shadow-lg"
        />
      </motion.div>
    </motion.div>
  );
};

export default AboutSection;