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
      <ContainerSticky className="flex flex-col overflow-hidden">
        {/* Video container at the top that opens up */}
        <ContainerInset 
          className="w-full h-[60vh] flex-shrink-0"
          insetYRange={[10, 0]}
          insetXRange={[10, 0]}
          roundednessRange={[40, 0]}
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
        </ContainerInset>

        {/* Hero content below video */}
        <div className="container mx-auto px-6 flex flex-col items-center justify-center flex-1 text-center py-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              Hand-Drawn XRP NFTs
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            <span className="block text-foreground">Board of</span>
            <span className="gradient-text text-glow">Peace</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-xl">
            Unique hand-drawn NFTs on the XRP Ledger. Join the movement for 
            peace and own a piece of digital art history.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <HeroButton className="glow-primary text-base px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium inline-flex items-center justify-center gap-2">
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </HeroButton>
            <Button 
              size="default" 
              variant="outline" 
              className="text-base px-6 border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-border/30">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">1,000+</div>
              <div className="text-xs text-muted-foreground">Unique NFTs</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold gradient-text">500+</div>
              <div className="text-xs text-muted-foreground">Holders</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-accent">50K+</div>
              <div className="text-xs text-muted-foreground">XRP Volume</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </ContainerSticky>
    </ContainerScroll>
  );
}
