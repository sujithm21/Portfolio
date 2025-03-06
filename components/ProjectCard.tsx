import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  title: string;
  description: string;
  //imageUrl: string;
  githubUrl: string;
  liveUrl: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, githubUrl, liveUrl }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <div className="relative h-48 w-full">
          <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" />
        </div> */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.open(githubUrl, '_blank')}>
          GitHub
        </Button>
        <Button onClick={() => window.open(liveUrl, '_blank')}>
          Live Demo
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;