import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const skills = [
  "React", "Next.js", "TypeScript", "Node.js", "Three.js",
  "GraphQL", "PostgreSQL", "UI/UX Design", "Figma", "Firebase"
];

const About = () => {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
        <div className="space-y-6">
          <Card className="bg-card/80">
            <CardHeader>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Me</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-lg text-foreground/80">
                <p>
                  I'm a passionate developer with a knack for creating beautiful, functional, and user-centric digital experiences. With a background in both design and engineering, I bridge the gap between aesthetics and performance to deliver outstanding web applications.
                </p>
                <p>
                  When I'm not coding, you can find me exploring the latest in 3D graphics, contributing to open-source projects, or searching for the perfect cup of coffee.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md bg-card/80">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">My Skillset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
