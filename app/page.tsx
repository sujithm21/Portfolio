import About from '@/components/site/About';
import AgentLoop from '@/components/site/AgentLoop';
import Contact from '@/components/site/Contact';
import Credentials from '@/components/site/Credentials';
import Experience from '@/components/site/Experience';
import Footer from '@/components/site/Footer';
import Hero from '@/components/site/Hero';
import Nav from '@/components/site/Nav';
import Projects from '@/components/site/Projects';
import Research from '@/components/site/Research';
import Skills from '@/components/site/Skills';
import VelocityMarquee from '@/components/site/VelocityMarquee';
import { marqueeClosing, marqueePlatforms, marqueeRows } from '@/lib/data';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <AgentLoop />
        <Experience />
        <VelocityMarquee rows={marqueeRows} />
        <Projects />
        <Skills />
        <VelocityMarquee rows={marqueePlatforms} />
        <Research />
        <Credentials />
        <VelocityMarquee rows={marqueeClosing} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
