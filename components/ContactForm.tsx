"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

const contactInfo = [
  {
    platform: "Email",
    icon: <FaEnvelope className="text-red-500" />,
    link: "mailto:makamsujith2004@gmail.com",
    text: "makamsujith2004@gmail.com",
  },
  {
    platform: "LinkedIn",
    icon: <FaLinkedin className="text-blue-600" />,
    link: "https://www.linkedin.com/in/makamsujith",
    text: "linkedin.com/in/makamsujith",
  },
  {
    platform: "Twitter",
    icon: <FaTwitter className="text-blue-400" />,
    link: "https://x.com/imsujithm",
    text: "x.com/imsujithm",
  },
  {
    platform: "Instagram",
    icon: <FaInstagram className="text-pink-500" />,
    link: "https://www.instagram.com/makamsujith_21",
    text: "@makamsujith_21",
  },
  {
    platform: "GitHub",
    icon: <FaGithub className="text-gray-800" />,
    link: "https://github.com/sujithm21",
    text: "github.com/sujithm21",
  },
];

const ContactSection: React.FC = () => {
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
        Contact Me
      </motion.h2>

      <div className="flex flex-col items-center space-y-4">
        {contactInfo.map((contact, index) => (
          <motion.a
            key={index}
            href={contact.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-lg font-medium hover:text-primary transition"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            {contact.icon}
            <span>{contact.text}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default ContactSection;
