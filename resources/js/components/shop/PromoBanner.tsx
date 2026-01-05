import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Percent, Truck, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PromoBannerProps {
    type?: 'banner' | 'popup';
    storageKey?: string;
    delayPopup?: number; // delay in ms before showing popup
    onVisibilityChange?: (visible: boolean) => void; // callback when banner visibility changes
}

interface PromoData {
    id: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    icon: 'gift' | 'percent' | 'truck';
    bgColor: string;
}

// Sample promo data - in production this would come from API/CMS
const PROMOS: PromoData[] = [
    {
        id: 'flash-sale',
        title: 'Flash Sale! 🔥',
        description: 'Diskon hingga 70% untuk produk pilihan',
        ctaText: 'Lihat Sekarang',
        ctaLink: '/shop/hot-sale',
        icon: 'percent',
        bgColor: 'from-terra-800 to-wood-dark',
    },
    {
        id: 'free-shipping',
        title: 'Gratis Ongkir! 🚚',
        description: 'Untuk pembelian minimal Rp 500.000',
        ctaText: 'Belanja Sekarang',
        ctaLink: '/shop/products',
        icon: 'truck',
        bgColor: 'from-terra-700 to-terra-900',
    },
    {
        id: 'new-member',
        title: 'Member Baru! 🎁',
        description: 'Dapatkan voucher Rp 100.000 untuk pembelian pertama',
        ctaText: 'Daftar Sekarang',
        ctaLink: '/register',
        icon: 'gift',
        bgColor: 'from-wood to-wood-dark',
    },
];

const IconMap = {
    gift: Gift,
    percent: Percent,
    truck: Truck,
};

function getRandomPromo(): PromoData {
    return PROMOS[Math.floor(Math.random() * PROMOS.length)];
}

function shouldShowPromo(storageKey: string): boolean {
    const dismissed = localStorage.getItem(storageKey);
    if (dismissed) {
        const dismissedTime = parseInt(dismissed, 10);
        // Show again after 24 hours
        if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
            return false;
        }
    }
    return true;
}

export function PromoBanner({ type = 'banner', storageKey = 'promo_dismissed', delayPopup = 3000, onVisibilityChange }: PromoBannerProps) {
    const [currentPromo] = useState<PromoData>(() => getRandomPromo());
    const [isVisible, setIsVisible] = useState(() => type === 'banner' && shouldShowPromo(storageKey));

    useEffect(() => {
        if (!shouldShowPromo(storageKey)) return;

        if (type === 'popup') {
            const timer = setTimeout(() => setIsVisible(true), delayPopup);
            return () => clearTimeout(timer);
        }
    }, [type, storageKey, delayPopup]);

    // Notify parent about visibility changes (for banner type only)
    useEffect(() => {
        if (type === 'banner' && onVisibilityChange) {
            onVisibilityChange(isVisible);
        }
    }, [isVisible, type, onVisibilityChange]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem(storageKey, Date.now().toString());
    };

    const Icon = IconMap[currentPromo.icon];

    if (type === 'banner') {
        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r ${currentPromo.bgColor} text-white overflow-hidden`}
                    >
                        <div className="max-w-[1400px] mx-auto px-4 py-2 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 justify-center">
                                <Icon size={18} />
                                <span className="font-medium">{currentPromo.title}</span>
                                <span className="hidden sm:inline opacity-90">- {currentPromo.description}</span>
                                <Link href={currentPromo.ctaLink} className="hidden md:flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm transition-colors">
                                    {currentPromo.ctaText} <ArrowRight size={14} />
                                </Link>
                            </div>
                            <button onClick={handleDismiss} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Popup variant
    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50" onClick={handleDismiss} />
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
                        <div className={`bg-gradient-to-br ${currentPromo.bgColor} rounded-sm p-8 text-white text-center shadow-2xl`}>
                            <button onClick={handleDismiss} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"><Icon size={32} /></div>
                            <h2 className="text-2xl font-bold mb-2">{currentPromo.title}</h2>
                            <p className="opacity-90 mb-6">{currentPromo.description}</p>
                            <Link href={currentPromo.ctaLink} onClick={handleDismiss} className="inline-flex items-center gap-2 bg-white text-terra-900 px-6 py-3 rounded-full font-medium hover:bg-terra-50 transition-colors">
                                {currentPromo.ctaText} <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

