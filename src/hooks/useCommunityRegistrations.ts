import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface CommunityRegistration {
  id: string;
  wallet_address: string;
  nft_token_id: string;
  nft_image_url: string | null;
  project_name: string;
  project_image_url: string | null;
  description: string;
  twitter_url: string | null;
  discord_url: string | null;
  website_url: string | null;
  created_at: string;
}

export function useCommunityRegistrations() {
  const [registrations, setRegistrations] = useState<CommunityRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchRegistrations = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('community_registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setRegistrations(data || []);
      } catch (err) {
        console.error('Error fetching registrations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load communities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('community_registrations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_registrations',
        },
        (payload: RealtimePostgresChangesPayload<CommunityRegistration>) => {
          if (payload.eventType === 'INSERT') {
            setRegistrations(prev => [payload.new as CommunityRegistration, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setRegistrations(prev => 
              prev.map(reg => 
                reg.id === (payload.new as CommunityRegistration).id 
                  ? payload.new as CommunityRegistration 
                  : reg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRegistrations(prev => 
              prev.filter(reg => reg.id !== (payload.old as CommunityRegistration).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { registrations, isLoading, error };
}
