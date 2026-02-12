import { useState, useEffect, useCallback } from 'react';

interface XamanPairingResponse {
  uuid: string;
  qr_png: string;
  qr_uri: string;
  mobile_link: string;
}

interface XamanPayloadResponse {
  payload_uuidv4: string;
  signed: boolean;
  user_token?: string;
  return_url?: {
    app?: string;
  };
}

interface XamanAuthState {
  isConnecting: boolean;
  isConnected: boolean;
  walletAddress: string | null;
  userToken: string | null;
  error: string | null;
  qrCode: string | null;
  deepLink: string | null;
}

const XAMAN_API_KEY = import.meta.env.VITE_XAMAN_API_KEY || '';
const SESSION_STORAGE_KEY = 'xaman_session';

export function useXamanAuth() {
  const [state, setState] = useState<XamanAuthState>(() => {
    // Try to restore session from localStorage
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      try {
        const { walletAddress, userToken } = JSON.parse(savedSession);
        return {
          isConnecting: false,
          isConnected: true,
          walletAddress,
          userToken,
          error: null,
          qrCode: null,
          deepLink: null,
        };
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    return {
      isConnecting: false,
      isConnected: false,
      walletAddress: null,
      userToken: null,
      error: null,
      qrCode: null,
      deepLink: null,
    };
  });

  const [payloadId, setPayloadId] = useState<string | null>(null);

  // Poll for payload status
  useEffect(() => {
    if (!payloadId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `https://xumm.app/api/v1/platform/payload/${payloadId}`,
          {
            headers: {
              'X-API-Key': XAMAN_API_KEY,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to check payload status');

        const data: XamanPayloadResponse = await response.json();

        if (data.signed) {
          clearInterval(pollInterval);
          
          // Get user account from the payload
          const accountResponse = await fetch(
            `https://xumm.app/api/v1/platform/payload/${payloadId}`,
            {
              headers: {
                'X-API-Key': XAMAN_API_KEY,
              },
            }
          );

          const accountData = await accountResponse.json();
          const account = accountData.response?.account;

          if (account) {
            const session = {
              walletAddress: account,
              userToken: data.user_token || null,
            };

            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

            setState({
              isConnecting: false,
              isConnected: true,
              walletAddress: account,
              userToken: data.user_token || null,
              error: null,
              qrCode: null,
              deepLink: null,
            });

            setPayloadId(null);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(pollInterval);
        setState(prev => ({
          ...prev,
          isConnecting: false,
          error: 'Connection timeout. Please try again.',
          qrCode: null,
          deepLink: null,
        }));
        setPayloadId(null);
      }
    }, 2000);

    // Timeout after 5 minutes
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: 'Connection request expired. Please try again.',
        qrCode: null,
        deepLink: null,
      }));
      setPayloadId(null);
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [payloadId]);

  const connect = useCallback(async () => {
    if (!XAMAN_API_KEY) {
      setState(prev => ({
        ...prev,
        error: 'Xaman API key not configured. Please contact support.',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      // Create a sign-in payload
      const response = await fetch('https://xumm.app/api/v1/platform/payload', {
        method: 'POST',
        headers: {
          'X-API-Key': XAMAN_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          txjson: {
            TransactionType: 'SignIn',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Xaman payload');
      }

      const data = await response.json();
      const refs = data.refs;

      setState(prev => ({
        ...prev,
        qrCode: refs.qr_png,
        deepLink: refs.qr_uri,
      }));

      setPayloadId(data.uuid);
    } catch (error) {
      console.error('Connection error:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setState({
      isConnecting: false,
      isConnected: false,
      walletAddress: null,
      userToken: null,
      error: null,
      qrCode: null,
      deepLink: null,
    });
    setPayloadId(null);
  }, []);

  const cancelConnection = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnecting: false,
      qrCode: null,
      deepLink: null,
      error: null,
    }));
    setPayloadId(null);
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    cancelConnection,
  };
}
