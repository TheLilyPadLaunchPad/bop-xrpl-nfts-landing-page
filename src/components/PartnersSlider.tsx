import { motion } from 'framer-motion';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { CommunityCard } from '@/components/CommunityCard';
import { CommunityRegistration } from '@/components/CommunityRegistration';
import { useCommunityRegistrations } from '@/hooks/useCommunityRegistrations';
import { Loader2 } from 'lucide-react';

// Fallback partners for when no communities are registered yet
const fallbackPartners = [
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
  const { registrations, isLoading } = useCommunityRegistrations();

  const hasRegistrations = registrations.length > 0;

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/10 to-transparent" />
      
      <div className="container mx-auto mb-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Trusted by the XRP Community
          </p>
          
          {/* Registration Button */}
          <CommunityRegistration />
        </motion.div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {hasRegistrations ? (
            <>
              {/* Real community cards slider */}
              <InfiniteSlider gap={24} speed={30} speedOnHover={15} className="py-4">
                {registrations.map((reg) => (
                  <CommunityCard
                    key={reg.id}
                    projectName={reg.project_name}
                    projectImageUrl={reg.project_image_url}
                    nftImageUrl={reg.nft_image_url}
                    description={reg.description}
                    twitterUrl={reg.twitter_url}
                    discordUrl={reg.discord_url}
                    websiteUrl={reg.website_url}
                  />
                ))}
              </InfiniteSlider>

              {/* Second row with reverse direction if enough registrations */}
              {registrations.length > 3 && (
                <InfiniteSlider gap={24} speed={25} speedOnHover={12} reverse className="py-4 mt-4">
                  {registrations.slice().reverse().map((reg) => (
                    <CommunityCard
                      key={`rev-${reg.id}`}
                      projectName={reg.project_name}
                      projectImageUrl={reg.project_image_url}
                      nftImageUrl={reg.nft_image_url}
                      description={reg.description}
                      twitterUrl={reg.twitter_url}
                      discordUrl={reg.discord_url}
                      websiteUrl={reg.website_url}
                    />
                  ))}
                </InfiniteSlider>
              )}
            </>
          ) : (
            <>
              {/* Fallback partner icons when no registrations */}
              <InfiniteSlider gap={48} speed={40} speedOnHover={20} className="py-4">
                {fallbackPartners.map((partner, index) => (
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
                {fallbackPartners.map((partner, index) => (
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
            </>
          )}
        </div>
      )}
    </section>
  );
}
