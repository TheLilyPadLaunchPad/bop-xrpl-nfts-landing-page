import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Upload, X, Twitter, Globe, MessageCircle, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useXrplWallet } from '@/hooks/useXrplWallet';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  projectName: string;
  description: string;
  twitterUrl: string;
  discordUrl: string;
  websiteUrl: string;
}

export function CommunityRegistration() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletInput, setWalletInput] = useState('');
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    description: '',
    twitterUrl: '',
    discordUrl: '',
    websiteUrl: '',
  });

  const { toast } = useToast();
  const {
    isConnecting,
    isConnected,
    walletAddress,
    nfts,
    selectedNft,
    error: walletError,
    verifyWallet,
    selectNft,
    disconnect,
  } = useXrplWallet();

  const handleWalletVerify = () => {
    if (walletInput.trim()) {
      verifyWallet(walletInput.trim());
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Image too large',
          description: 'Please upload an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }
      setProjectImage(file);
      setProjectImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress || !selectedNft) {
      toast({
        title: 'Wallet not verified',
        description: 'Please verify your wallet and select an NFT',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.projectName.trim() || !formData.description.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let projectImageUrl = null;

      // Upload project image if provided
      if (projectImage) {
        const fileExt = projectImage.name.split('.').pop();
        const fileName = `${walletAddress}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('community-images')
          .upload(fileName, projectImage);

        if (uploadError) {
          throw new Error('Failed to upload image');
        }

        const { data: urlData } = supabase.storage
          .from('community-images')
          .getPublicUrl(fileName);

        projectImageUrl = urlData.publicUrl;
      }

      // Insert registration into database
      const { error: insertError } = await supabase
        .from('community_registrations')
        .insert({
          wallet_address: walletAddress,
          nft_token_id: selectedNft.tokenId,
          nft_image_url: selectedNft.imageUrl,
          project_name: formData.projectName.trim(),
          project_image_url: projectImageUrl,
          description: formData.description.trim(),
          twitter_url: formData.twitterUrl.trim() || null,
          discord_url: formData.discordUrl.trim() || null,
          website_url: formData.websiteUrl.trim() || null,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('This wallet has already registered a community');
        }
        throw new Error(insertError.message);
      }

      setIsSubmitted(true);
      toast({
        title: 'Registration successful!',
        description: 'Your community has been added to the showcase.',
      });

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      projectName: '',
      description: '',
      twitterUrl: '',
      discordUrl: '',
      websiteUrl: '',
    });
    setWalletInput('');
    setProjectImage(null);
    setProjectImagePreview(null);
    setIsSubmitted(false);
    disconnect();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="glow-primary">
          <Wallet className="w-4 h-4 mr-2" />
          Register Your Community
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl gradient-text">
            {isSubmitted ? 'Registration Complete!' : 'Register Your XRPL Community'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSubmitted 
              ? 'Your community is now live on the showcase.'
              : 'Verify your Board of Peace NFT ownership to register your project.'
            }
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <motion.div 
            className="flex flex-col items-center py-8 gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <p className="text-center text-muted-foreground">
              Your community card is now visible in the "Trusted by the XRP Community" section.
            </p>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Verify Wallet */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isConnected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  1
                </div>
                <Label className="font-semibold">Verify Your XRP Wallet</Label>
              </div>
              
              {!isConnected ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter your XRP wallet address (r...)"
                      value={walletInput}
                      onChange={(e) => setWalletInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleWalletVerify} 
                      disabled={isConnecting || !walletInput.trim()}
                      variant="outline"
                    >
                      {isConnecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll check if your wallet holds a Board of Peace NFT
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Verified Wallet</p>
                      <p className="font-mono text-sm truncate max-w-[200px]">{walletAddress}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={disconnect}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {walletError && (
                <p className="text-sm text-destructive">{walletError}</p>
              )}
            </div>

            {/* Step 2: Select NFT */}
            {isConnected && nfts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedNft ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    2
                  </div>
                  <Label className="font-semibold">Select Your NFT</Label>
                </div>
                
                <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto">
                  {nfts.map((nft) => (
                    <button
                      key={nft.tokenId}
                      onClick={() => selectNft(nft)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedNft?.tokenId === nft.tokenId 
                          ? 'border-primary ring-2 ring-primary/50' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {nft.imageUrl ? (
                        <img 
                          src={nft.imageUrl} 
                          alt={nft.name || 'NFT'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-2xl">🖼️</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedNft && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedNft.name}
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Project Details Form */}
            {selectedNft && (
              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <Label className="font-semibold">Project Details</Label>
                </div>

                {/* Project Image */}
                <div className="space-y-2">
                  <Label htmlFor="projectImage">Project Logo/Image</Label>
                  <div className="flex items-center gap-4">
                    {projectImagePreview ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img 
                          src={projectImagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProjectImage(null);
                            setProjectImagePreview(null);
                          }}
                          className="absolute top-0 right-0 p-1 bg-destructive rounded-bl-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <input
                          type="file"
                          id="projectImage"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Upload your project logo (max 5MB)
                    </p>
                  </div>
                </div>

                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Your XRPL Project"
                    maxLength={50}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Brief Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell us about your project in a few sentences..."
                    maxLength={280}
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.description.length}/280
                  </p>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="w-4 h-4" /> Twitter/X
                    </Label>
                    <Input
                      id="twitter"
                      value={formData.twitterUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                      placeholder="https://twitter.com/yourproject"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discord" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" /> Discord
                    </Label>
                    <Input
                      id="discord"
                      value={formData.discordUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, discordUrl: e.target.value }))}
                      placeholder="https://discord.gg/yourserver"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Website
                    </Label>
                    <Input
                      id="website"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      placeholder="https://yourproject.com"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full glow-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Register Community'
                  )}
                </Button>
              </motion.form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
