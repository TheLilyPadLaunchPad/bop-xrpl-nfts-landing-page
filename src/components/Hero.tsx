import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ContainerScroll,
  ContainerSticky,
  ContainerAnimated,
  ContainerInset,
  HeroVideo,
  HeroButton,
} from '@/components/ui/animated-video-on-scroll';
import nftVideo from '@/assets/bop-nft-video.mp4';

export function Hero() {
  return (
    <ContainerScroll className="relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      
      {/* Radial glow behind content */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(200 100% 50% / 0.3), transparent 60%)',
        }}
      />

      <ContainerSticky className="flex items-center justify-center overflow-hidden">
        <ContainerAnimated className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-muted-foreground">
                  Hand-Drawn XRP NFTs
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block text-foreground">Board of</span>
                <span className="gradient-text text-glow">Peace</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Unique hand-drawn NFTs on the XRP Ledger. Join the movement for 
                peace and own a piece of digital art history.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <HeroButton className="glow-primary text-lg px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium inline-flex items-center justify-center gap-2">
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </HeroButton>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50">
                <div>
                  <div className="text-3xl font-bold text-foreground">1,000+</div>
                  <div className="text-sm text-muted-foreground">Unique NFTs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text">500+</div>
                  <div className="text-sm text-muted-foreground">Holders</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">50K+</div>
                  <div className="text-sm text-muted-foreground">XRP Volume</div>
                </div>
              </div>
            </div>

            {/* Right content - Animated Video showcase */}
            <div className="relative aspect-square max-w-lg mx-auto w-full">
              {/* Decorative ring */}
              <div className="absolute inset-0 -m-4 rounded-3xl animated-border opacity-60" />
              
              {/* Video container with scroll animation */}
              <ContainerInset 
                className="relative rounded-2xl overflow-hidden glass-strong"
                insetYRange={[20, 0]}
                insetXRange={[20, 0]}
                roundednessRange={[48, 16]}
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
                
                {/* Video overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                
                {/* NFT info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">BOP Genesis #001</h3>
                      <p className="text-sm text-muted-foreground">Featured Drop</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Current Price</div>
                      <div className="text-lg font-bold text-accent">250 XRP</div>
                    </div>
                  </div>
                </div>
              </ContainerInset>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-accent text-accent-foreground font-semibold text-sm glow-accent animate-bounce">
                🔥 Hot Drop
              </div>
            </div>
          </div>
        </ContainerAnimated>
      </ContainerSticky>
    </ContainerScroll>
  );
}
