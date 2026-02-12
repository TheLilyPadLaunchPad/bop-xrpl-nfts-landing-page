import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useXamanAuth } from '@/hooks/useXamanAuth';
import { WalletConnectionModal } from '@/components/WalletConnectionModal';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Collection', href: '#collection' },
  { label: 'About', href: '#about' },
  { label: 'Roadmap', href: '#roadmap' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { isConnected, walletAddress, qrCode, deepLink, isConnecting, error, connect, disconnect, cancelConnection } = useXamanAuth();

  const handleConnectClick = () => {
    connect();
    setShowWalletModal(true);
  };

  const handleModalClose = () => {
    setShowWalletModal(false);
    cancelConnection();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-strong">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#"
              className="text-2xl font-bold gradient-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              BOP
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="hidden md:flex items-center gap-2"
            >
              {isConnected ? (
                <>
                  <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="text-sm font-mono text-primary">
                      {formatAddress(walletAddress!)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={disconnect}
                    className="hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                  onClick={handleConnectClick}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden glass-strong"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-foreground py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                {isConnected ? (
                  <div className="space-y-2 mt-2">
                    <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-primary" />
                      <span className="text-sm font-mono text-primary">
                        {formatAddress(walletAddress!)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={disconnect}
                      className="w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                    onClick={handleConnectClick}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={handleModalClose}
        qrCode={qrCode}
        deepLink={deepLink}
        isConnecting={isConnecting}
        error={error}
      />
    </nav>
  );
}
