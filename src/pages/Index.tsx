import { DottedSurface } from '@/components/ui/dotted-surface';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { PartnersSlider } from '@/components/PartnersSlider';
import { NFTShowcase } from '@/components/NFTShowcase';
import { About } from '@/components/About';
import { Roadmap } from '@/components/Roadmap';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <DottedSurface className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <PartnersSlider />
        <section id="collection">
          <NFTShowcase />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="roadmap">
          <Roadmap />
        </section>
      </main>
      <Footer />
    </DottedSurface>
  );
};

export default Index;
