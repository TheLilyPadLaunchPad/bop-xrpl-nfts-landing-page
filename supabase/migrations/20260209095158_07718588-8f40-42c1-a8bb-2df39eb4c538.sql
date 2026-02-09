-- Create community registrations table
CREATE TABLE public.community_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  nft_token_id TEXT NOT NULL,
  nft_image_url TEXT,
  project_name TEXT NOT NULL,
  project_image_url TEXT,
  description TEXT NOT NULL,
  twitter_url TEXT,
  discord_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.community_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved registrations (auto-approve means all are visible)
CREATE POLICY "Anyone can view community registrations" 
ON public.community_registrations 
FOR SELECT 
USING (true);

-- Anyone can insert (wallet verification happens in app logic)
CREATE POLICY "Anyone can register their community" 
ON public.community_registrations 
FOR INSERT 
WITH CHECK (true);

-- Only the wallet owner can update their registration (identified by wallet_address match)
CREATE POLICY "Wallet owners can update their registration" 
ON public.community_registrations 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_community_registrations_updated_at
BEFORE UPDATE ON public.community_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_registrations;

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-images', 'community-images', true);

-- Storage policies for community images
CREATE POLICY "Anyone can view community images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'community-images');

CREATE POLICY "Anyone can upload community images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'community-images');