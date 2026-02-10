import { DottedSurface } from '@/components/ui/dotted-surface';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { PartnersSlider } from '@/components/PartnersSlider';
import { NFTShowcase } from '@/components/NFTShowcase';
import { About } from '@/components/About';
import { Roadmap } from '@/components/Roadmap';
import { Footer } from '@/components/Footer';
import { EtheralShadow } from '@/components/ui/etheral-shadow';

const Index = () => {
  return (
    <DottedSurface className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none -z-20">
        <EtheralShadow
          color="rgba(163, 118, 36, 0.4)" // Match primary gold with transparency
          animation={{ scale: 60, speed: 20 }}
          noise={{ opacity: 0.1, scale: 1.2 }}
          sizing="fill"
        />
      </div>
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
