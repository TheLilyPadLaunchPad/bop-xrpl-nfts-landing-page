import { useState, useCallback } from 'react';

interface NFTData {
  tokenId: string;
  imageUrl: string | null;
  name: string | null;
  issuer: string;
  taxon: number;
}

interface WalletState {
  isConnecting: boolean;
  isConnected: boolean;
  walletAddress: string | null;
  nfts: NFTData[];
  selectedNft: NFTData | null;
  error: string | null;
}

// Board of Peace NFT Collection details - Update these with actual values
const BOP_NFT_ISSUER = ''; // Leave empty to accept all NFTs for now

export function useXrplWallet() {
  const [state, setState] = useState<WalletState>({
    isConnecting: false,
    isConnected: false,
    walletAddress: null,
    nfts: [],
    selectedNft: null,
    error: null,
  });

  const verifyWallet = useCallback(async (walletAddress: string) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Validate XRP address format
      if (!isValidXrpAddress(walletAddress)) {
        throw new Error('Invalid XRP wallet address format');
      }

      // Fetch NFTs owned by this account from XRPL
      const nfts = await fetchAccountNFTs(walletAddress);
      
      // Filter to only Board of Peace NFTs if issuer is set
      const bopNfts = BOP_NFT_ISSUER 
        ? nfts.filter(nft => nft.issuer === BOP_NFT_ISSUER)
        : nfts;

      if (bopNfts.length === 0) {
        setState(prev => ({
          ...prev,
          isConnecting: false,
          isConnected: true,
          walletAddress,
          nfts: [],
          error: 'No Board of Peace NFTs found in this wallet. You need to hold a BOP NFT to register.',
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        isConnecting: false,
        isConnected: true,
        walletAddress,
        nfts: bopNfts,
        error: null,
      }));
    } catch (error) {
      console.error('Wallet verification error:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to verify wallet',
      }));
    }
  }, []);

  const selectNft = useCallback((nft: NFTData) => {
    setState(prev => ({ ...prev, selectedNft: nft }));
  }, []);

  const disconnect = useCallback(() => {
    setState({
      isConnecting: false,
      isConnected: false,
      walletAddress: null,
      nfts: [],
      selectedNft: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    verifyWallet,
    selectNft,
    disconnect,
  };
}

// Validate XRP address format
function isValidXrpAddress(address: string): boolean {
  // XRP addresses start with 'r' and are 25-35 characters
  const xrpAddressRegex = /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/;
  return xrpAddressRegex.test(address);
}

// Fetch account NFTs from XRPL
async function fetchAccountNFTs(account: string): Promise<NFTData[]> {
  try {
    // Use XRPL mainnet cluster
    const response = await fetch('https://xrplcluster.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'account_nfts',
        params: [{ 
          account, 
          ledger_index: 'validated',
          limit: 100
        }],
      }),
    });
    
    const data = await response.json();
    
    if (data.result?.error) {
      if (data.result.error === 'actNotFound') {
        throw new Error('Wallet address not found on XRPL or has no NFTs');
      }
      throw new Error(data.result.error_message || 'Failed to fetch NFTs');
    }

    const nfts = data.result?.account_nfts || [];
    
    // Parse NFT data
    const parsedNfts: NFTData[] = await Promise.all(
      nfts.map(async (nft: any) => {
        const metadata = await parseNFTMetadata(nft.URI);
        return {
          tokenId: nft.NFTokenID,
          imageUrl: metadata?.image || null,
          name: metadata?.name || `NFT #${nft.nft_serial}`,
          issuer: nft.Issuer,
          taxon: nft.NFTokenTaxon,
        };
      })
    );

    return parsedNfts;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
}

// Parse NFT metadata URI to extract image URL
async function parseNFTMetadata(uri: string | undefined): Promise<{ image?: string; name?: string } | null> {
  if (!uri) return null;
  
  try {
    // Decode hex URI
    let decodedUri = uri;
    if (/^[0-9A-Fa-f]+$/.test(uri)) {
      decodedUri = hexToString(uri);
    }
    
    // Handle IPFS URIs
    if (decodedUri.startsWith('ipfs://')) {
      decodedUri = `https://ipfs.io/ipfs/${decodedUri.replace('ipfs://', '')}`;
    }
    
    // If it's a URL to JSON metadata, fetch it
    if (decodedUri.startsWith('http') && (decodedUri.includes('.json') || !decodedUri.match(/\.(png|jpg|jpeg|gif|webp)$/i))) {
      try {
        const response = await fetch(decodedUri);
        const metadata = await response.json();
        
        let imageUrl = metadata.image || metadata.image_url;
        if (imageUrl?.startsWith('ipfs://')) {
          imageUrl = `https://ipfs.io/ipfs/${imageUrl.replace('ipfs://', '')}`;
        }
        
        return {
          image: imageUrl,
          name: metadata.name,
        };
      } catch {
        return { image: decodedUri };
      }
    }
    
    // If it's a direct image URL
    return { image: decodedUri };
  } catch {
    return null;
  }
}

// Convert hex string to UTF-8 string
function hexToString(hex: string): string {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}
