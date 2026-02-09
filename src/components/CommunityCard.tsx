import { Twitter, MessageCircle, Globe } from 'lucide-react';

interface CommunityCardProps {
  projectName: string;
  projectImageUrl: string | null;
  nftImageUrl: string | null;
  description: string;
  twitterUrl: string | null;
  discordUrl: string | null;
  websiteUrl: string | null;
}

export function CommunityCard({
  projectName,
  projectImageUrl,
  nftImageUrl,
  description,
  twitterUrl,
  discordUrl,
  websiteUrl,
}: CommunityCardProps) {
  const imageUrl = projectImageUrl || nftImageUrl;

  return (
    <div className="flex items-center gap-4 px-6 py-4 rounded-2xl glass hover:bg-muted/30 transition-all cursor-pointer group min-w-[320px]">
      {/* Project Image / NFT */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-border/50 group-hover:border-primary/50 transition-colors">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={projectName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {projectName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
          {projectName}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {description}
        </p>
      </div>

      {/* Social Links */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {twitterUrl && (
          <a 
            href={twitterUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-primary/20 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary" />
          </a>
        )}
        {discordUrl && (
          <a 
            href={discordUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-primary/20 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="w-4 h-4 text-muted-foreground hover:text-primary" />
          </a>
        )}
        {websiteUrl && (
          <a 
            href={websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-primary/20 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe className="w-4 h-4 text-muted-foreground hover:text-primary" />
          </a>
        )}
      </div>
    </div>
  );
}
