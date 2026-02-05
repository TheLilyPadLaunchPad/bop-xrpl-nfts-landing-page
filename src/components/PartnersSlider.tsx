import { motion } from 'framer-motion';
import { InfiniteSlider } from '@/components/ui/infinite-slider';

// Partner/Brand logos - using placeholder icons styled for the crypto theme
const partners = [
  { name: 'XRPL', icon: '◆' },
  { name: 'XRP Ledger', icon: '⬡' },
  { name: 'OpenSea', icon: '◈' },
  { name: 'Rarible', icon: '◇' },
  { name: 'MetaMask', icon: '⬢' },
  { name: 'Coinbase', icon: '◉' },
  { name: 'Binance', icon: '⬟' },
  { name: 'Trust Wallet', icon: '◎' },
];

export function PartnersSlider() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/10 to-transparent" />
      
      <div className="container mx-auto mb-8">
        <motion.p
          className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Trusted by the XRP Community
        </motion.p>
      </div>

      {/* Infinite slider with fade edges */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <InfiniteSlider gap={48} speed={40} speedOnHover={20} className="py-4">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-6 py-3 rounded-full glass hover:bg-muted/30 transition-colors cursor-pointer group"
            >
              <span className="text-2xl text-primary group-hover:text-accent transition-colors">
                {partner.icon}
              </span>
              <span className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {partner.name}
              </span>
            </div>
          ))}
        </InfiniteSlider>

        {/* Second row going in reverse */}
        <InfiniteSlider gap={48} speed={30} speedOnHover={15} reverse className="py-4 mt-4">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-border/50 hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <span className="text-2xl text-accent group-hover:text-primary transition-colors">
                {partner.icon}
              </span>
              <span className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {partner.name}
              </span>
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
