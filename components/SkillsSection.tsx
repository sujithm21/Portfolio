"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  FaCode,
  FaDatabase,
  FaTools,
  FaServer,
  FaBrain,
  FaCogs,
} from "react-icons/fa";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: <FaCode className="text-blue-500" />,
    skills: ["C", "C++", "Python", "JavaScript"],
  },
  {
    title: "Databases",
    icon: <FaDatabase className="text-green-500" />,
    skills: ["MongoDB", "MySQL"],
  },
  {
    title: "Operating Systems",
    icon: <FaServer className="text-purple-500" />,
    skills: ["Ubuntu", "Windows"],
  },
  {
    title: "Data Science & AI",
    icon: <FaBrain className="text-yellow-500" />,
    skills: ["LLMs", "Generative AI", "Machine Learning", "Deep Learning"],
  },
  {
    title: "Tools & Libraries",
    icon: <FaTools className="text-red-500" />,
    skills: [
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "Hugging Face",
      "React.js",
      "Node.js",
      "Express.js",
      "Postman",
      "GitHub",
      "Docker",
      "AWS",
    ],
  },
  {
    title: "Core Technical Skills",
    icon: <FaCogs className="text-pink-500" />,
    skills: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming (OOP)",
      "Database Management Systems (DBMS)",
      "Operating Systems",
      "Computer Networks",
      "Cloud Computing",
      "DevOps",
    ],
  },
];

const SkillsSection: React.FC = () => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-10"
    >
      <motion.h2
        className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        My Skills
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, index) => (
          <motion.div
            key={index}
            className={`p-5 shadow-lg rounded-xl transition-colors ${
              theme === "dark"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-black"
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{category.icon}</span>
              <h3 className="text-lg font-semibold">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsSection;
