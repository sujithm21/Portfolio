import dynamic from 'next/dynamic';
import Nav from '@/components/site/Nav';
import Hero from '@/components/site/Hero';
import About from '@/components/site/About';
import Experience from '@/components/site/Experience';
import Projects from '@/components/site/Projects';
import Skills from '@/components/site/Skills';
import Research from '@/components/site/Research';
import Credentials from '@/components/site/Credentials';
import Contact from '@/components/site/Contact';
import Footer from '@/components/site/Footer';

// Canvas background is browser-only and purely decorative.
const NeuralField = dynamic(() => import('@/components/site/NeuralField'), { ssr: false });

export default function Home() {
  return (
    <>
      <NeuralField />
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Research />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
