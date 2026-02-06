import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ContainerScroll,
  ContainerSticky,
  ContainerInset,
  HeroVideo,
  HeroButton,
} from '@/components/ui/animated-video-on-scroll';
import nftVideo from '@/assets/bop-nft-video.mp4';

export function Hero() {
  return (
    <ContainerScroll className="relative">
      <ContainerSticky className="flex items-center justify-center overflow-hidden">
        {/* Full-screen video container that opens up */}
        <ContainerInset 
          className="absolute inset-0 z-0"
          insetYRange={[25, 0]}
          insetXRange={[15, 0]}
          roundednessRange={[60, 0]}
        >
          <HeroVideo 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={nftVideo} type="video/mp4" />
          </HeroVideo>
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/90 pointer-events-none" />
        </ContainerInset>

        {/* Hero content overlay */}
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center min-h-screen text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              Hand-Drawn XRP NFTs
            </span>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="block text-foreground drop-shadow-lg">Board of</span>
            <span className="gradient-text text-glow">Peace</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl drop-shadow-md">
            Unique hand-drawn NFTs on the XRP Ledger. Join the movement for 
            peace and own a piece of digital art history.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HeroButton className="glow-primary text-lg px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium inline-flex items-center justify-center gap-2">
              Explore Collection
              <ArrowRight className="w-5 h-5" />
            </HeroButton>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/30 backdrop-blur-sm rounded-xl px-8 py-4">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground drop-shadow-lg">1,000+</div>
              <div className="text-sm text-muted-foreground">Unique NFTs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text">500+</div>
              <div className="text-sm text-muted-foreground">Holders</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent">50K+</div>
              <div className="text-sm text-muted-foreground">XRP Volume</div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
            </div>
          </div>
        </div>
      </ContainerSticky>
    </ContainerScroll>
  );
}
