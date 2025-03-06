"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
          I'm Sujith Makam, a Full-Stack AI Developer with a passion for
          building applications and experimenting with LLMs. I have a solid
          background in software engineering, data structures, and machine
          learning and Full Stack Web Development.
        </motion.p>
        <motion.p
          className="text-lg"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
        >
          I thrive at the intersection of AI and Software Development,
          leveraging MERN stack, Docker, and ML techniques to build intelligent
          solutions. Whether it's enhancing model performance or developing
          robust applications, I enjoy solving complex problems with efficient
          and scalable solutions.
        </motion.p>
        <motion.p
          className="text-lg"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
        >
          When I'm not coding or studying, you can find me participating in tech
          quizzes, exploring new technologies, and pushing the boundaries of my
          knowledge in software development and problem-solving.
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
          alt="Sujith Makam"
          width={400}
          height={400}
          className="rounded-full shadow-lg"
        />
      </motion.div>
    </motion.div>
  );
};

export default AboutSection;
