import React from "react";
import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    title: "Cloud Notebook",
    description:
      "The Cloud Notebook project utilizes React and Express to deliver a dynamic, user-friendly digital notebook. React ensures an intuitive frontend, while Node.js and Express provide a secure backend. Implemented features for real-time note-taking and organization, enhancing productivity and usability.",
    githubUrl: "https://github.com/sujithm21/inotebok",
    liveUrl: "#",
  },
  {
    title: "DailySphere",
    description:
      "Developed a full-stack news application using React for the front end and Node.js with Express for the back end, delivering up-to-date daily news. Integrated external news APIs to display live news updates with a clean, intuitive user interface for easy navigation.",
    githubUrl: "https://github.com/sujithm21/newsapp",
    liveUrl: "#",
  },
  {
    title: "Dream Home",
    description:
      "Developed a comprehensive rental application using Tkinter and MySQL. Designed the application to provide an intuitive user experience for both property seekers and owners.",
    githubUrl: "https://github.com/sujithm21/Dream-Home-Project",
    liveUrl: "#",
  },
  {
    title: "Crop Recommendation System",
    description:
      "Developed a crop recommendation system that identifies the optimal crop for the next season based on environmental factors, enhancing farming decisions. Analyzed soil nutrient levels and environmental conditions, leveraging machine learning for precise predictions with a user-friendly input and visualization interface. Attained 99% accuracy using the Random Forest algorithm, ensuring highly reliable crop recommendations.",
    githubUrl: "https://github.com/sujithm21/Crop-Prediction",
    liveUrl: "#",
  },
  {
    title: "Blog Generation & Chat with PDFs",
    description:
      "Developed a web application using Llama2 (LLM), Streamlit, Python, and NLP libraries. Enables users to generate blog content on diverse topics leveraging AI. Also features an interactive chat interface with PDF files for summarization, question answering, and more.",
    githubUrl: "https://github.com/sujithm21/Blog-generation-and-chat-with-PDF",
    liveUrl: "#",
  },
];

const ProjectsSection: React.FC = () => {
  return (
    <section className="py-12 px-6 bg-background">
      <h2 className="text-3xl font-bold text-center mb-6">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            githubUrl={project.githubUrl}
            liveUrl={project.liveUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
