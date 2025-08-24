import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const projectsData = [
  {
    title: "Project Alpha",
    description: "An interactive data visualization platform using D3.js and React, offering real-time analytics for enterprise clients.",
    image: "https://placehold.co/600x400.png",
    imageHint: "abstract tech",
    liveLink: "#",
    githubLink: "#",
    tags: ["React", "D3.js", "Node.js"],
  },
  {
    title: "Project Beta",
    description: "A 3D product configurator built with Three.js and Next.js, allowing users to customize and view products in real-time.",
    image: "https://placehold.co/600x400.png",
    imageHint: "futuristic product",
    liveLink: "#",
    githubLink: "#",
    tags: ["Next.js", "Three.js", "TypeScript"],
  },
  {
    title: "Project Gamma",
    description: "A serverless e-commerce solution powered by Firebase and Stripe, designed for scalability and performance.",
    image: "https://placehold.co/600x400.png",
    imageHint: "modern online",
    liveLink: "#",
    githubLink: "#",
    tags: ["Firebase", "Stripe", "Vue.js"],
  },
   {
    title: "Project Delta",
    description: "A collaborative whiteboard application using WebSockets for real-time communication and creative brainstorming.",
    image: "https://placehold.co/600x400.png",
    imageHint: "digital collaboration",
    liveLink: "#",
    githubLink: "#",
    tags: ["WebSockets", "Canvas API", "Express"],
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 lg:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Work</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80 md:text-xl">A selection of my projects that showcase my skills and passion.</p>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          {projectsData.map((project) => (
            <Card key={project.title} className="bg-card/80 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 flex flex-col">
              <Image
                src={project.image}
                alt={project.title}
                width={600}
                height={400}
                className="rounded-t-lg aspect-video object-cover"
                data-ai-hint={project.imageHint}
              />
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
                <CardDescription className="text-base">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <Github className="h-5 w-5" />
                    </Button>
                  </a>
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
