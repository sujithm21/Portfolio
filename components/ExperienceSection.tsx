import React from "react";
import { useTheme } from "next-themes"; // Import for theme detection

const experiences = [
  {
    company: "Indian Institute of Science Bangalore",
    role: "Research Intern",
    duration: "May 2024 - July 2024",
    responsibilities: [
      "Investigated LLM Pruning techniques for improving model efficiency, optimizing the attention and feed-forward layers of GPT-2. Achieved a 5.2% reduction in instruction cache misses through tiled matrix multiplication implementation.",
      "Conducted detailed profiling of GPT-2 using Intel VTune, identifying bottlenecks and enhancing cache efficiency, which resulted in a 4x speedup in attention layer execution.",
      "Optimized identified bottlenecks in the attention and feed-forward layers of GPT-2 and reduced memory bandwidth usage by 34.8%, decreasing memory-bound issues and ensuring more efficient execution.",
      "Implemented custom classes (e.g., tiled matrix multiplication) for performance improvement in the attention layer.",
    ],
  },
  {
    company: "SSTRUENCE",
    role: "Software Development Intern",
    duration: "Jan 2024 - Mar 2024",
    responsibilities: [
      "Engineered a responsive and user-friendly part of the e-commerce website using React.",
      "Designed and implemented an AI chatbot, automating 80% of customer queries and providing real-time product recommendations.",
      "Integrated machine learning to enhance chatbot performance through continuous learning.",
      "Collaborated in an agile startup environment, working closely with cross-functional teams.",
    ],
  },
];

const ExperienceSection: React.FC = () => {
  const { theme } = useTheme(); // Get current theme

  return (
    <section className="py-12 px-6 bg-background">
      <h2 className={`text-3xl font-bold text-center mb-6 ${theme === "light" ? "text-black" : "text-white"}`}>
        Experience
      </h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div 
            key={index} 
            className={`p-6 border border-gray-500 rounded-lg shadow-md ${theme === "light" ? "bg-white text-black" : "bg-secondary text-white"}`}
          >
            <h3 className="text-2xl font-semibold">{exp.company}</h3>
            <p className="text-lg">{exp.role} | {exp.duration}</p>
            <ul className="mt-4 list-disc list-inside">
              {exp.responsibilities.map((task, i) => (
                <li key={i} className="mt-1">{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
