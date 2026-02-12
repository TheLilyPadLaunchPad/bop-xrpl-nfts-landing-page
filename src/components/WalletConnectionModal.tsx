import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Loader2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WalletConnectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    qrCode: string | null;
    deepLink: string | null;
    isConnecting: boolean;
    error: string | null;
}

export function WalletConnectionModal({
    isOpen,
    onClose,
    qrCode,
    deepLink,
    isConnecting,
    error,
}: WalletConnectionModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl gradient-text">
                        Connect Xaman Wallet
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Scan the QR code with your Xaman mobile app or click the link below
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {error ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20"
                        >
                            <p className="text-sm text-destructive">{error}</p>
                        </motion.div>
                    ) : qrCode ? (
                        <>
                            {/* QR Code Display */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="p-4 bg-white rounded-xl">
                                    <img
                                        src={qrCode}
                                        alt="Xaman QR Code"
                                        className="w-64 h-64"
                                    />
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Smartphone className="w-4 h-4" />
                                    <span>Scan with Xaman mobile app</span>
                                </div>
                            </motion.div>

                            {/* Deep Link Button */}
                            {deepLink && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => window.open(deepLink, '_blank')}
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Open Xaman App
                                    </Button>
                                </motion.div>
                            )}

                            {/* Waiting Message */}
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Waiting for you to sign in...</span>
                            </div>
                        </>
                    ) : isConnecting ? (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">
                                Preparing connection...
                            </p>
                        </div>
                    ) : null}

                    {/* Cancel Button */}
                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
