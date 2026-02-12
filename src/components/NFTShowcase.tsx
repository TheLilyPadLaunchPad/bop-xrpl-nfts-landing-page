import { motion } from 'framer-motion';

const nfts = [
  { id: 1, image: 'https://i.ibb.co/G3FW2xWQ/HARQwQEacAAMAcU.jpg', name: 'Peaceful Guardian', price: '150 XRP', rarity: 'Rare' },
  { id: 2, image: 'https://i.ibb.co/BVFVF5xz/HAlsCSvagAAYmgW.jpg', name: 'Dove of Hope', price: '200 XRP', rarity: 'Epic' },
  { id: 3, image: 'https://i.ibb.co/tMvhLP4Z/HALW4QRa8AASqfO.jpg', name: 'Zen Master', price: '180 XRP', rarity: 'Rare' },
  { id: 4, image: 'https://i.ibb.co/fzRDF69f/HA65674bIAAQgR6.jpg', name: 'Golden Spirit', price: '300 XRP', rarity: 'Legendary' },
];

const rarityColors: Record<string, string> = {
  Rare: 'bg-primary/20 text-primary',
  Epic: 'bg-secondary/20 text-secondary',
  Legendary: 'bg-accent/20 text-accent',
};

export function NFTShowcase() {
  return (
    <section className="py-24 px-6 relative">
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Featured </span>
            <span className="gradient-text">Collection</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each piece is hand-drawn with care, representing peace and unity
            on the XRP Ledger.
          </p>
        </motion.div>

        {/* NFT Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts.map((nft, index) => (
            <motion.div
              key={nft.id}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden glass nft-card-hover">
                {/* NFT Image */}
                <div className="aspect-square p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Rarity badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${rarityColors[nft.rarity]}`}>
                  {nft.rarity}
                </div>

                {/* NFT Info */}
                <div className="p-4 border-t border-border/30">
                  <h3 className="font-semibold text-foreground mb-1">{nft.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-bold text-primary">{nft.price}</span>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <button className="px-8 py-3 rounded-full animated-border bg-card hover:bg-muted transition-colors">
            <span className="text-foreground font-medium">View Full Collection</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
