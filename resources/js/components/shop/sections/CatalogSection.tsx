import DearFlipViewer from '@/components/DearFlipViewer';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useState } from 'react';

// Available catalogs from public/assets/pdf
const CATALOGS = [
    {
        id: 'lounge-chair',
        name: 'Lounge Chair',
        file: '/assets/pdf/LOUNGE CHAIR.pdf',
        thumbnail: '/assets/pdf/thumbnails/LOUNGE CHAIR.png',
    },
    {
        id: 'dining-chair',
        name: 'Dining Chair',
        file: '/assets/pdf/DINING CHAIR.pdf',
        thumbnail: '/assets/pdf/thumbnails/DINING CHAIR.png',
    },
    {
        id: 'bar-stool',
        name: 'Bar Stool',
        file: '/assets/pdf/BAR STOOL.pdf',
        thumbnail: '/assets/pdf/thumbnails/BAR STOOL.png',
    },
    {
        id: 'nightstand',
        name: 'Nightstand',
        file: '/assets/pdf/NIGHTSTAND.pdf',
        thumbnail: '/assets/pdf/thumbnails/NIGHTSTAND.png',
    },
    {
        id: 'coffee-table',
        name: 'Coffee Table',
        file: '/assets/pdf/COFFEE TABLE.pdf',
        thumbnail: '/assets/pdf/thumbnails/COFFEE TABLE.png',
    },
    {
        id: 'dining-table',
        name: 'Dining Table',
        file: '/assets/pdf/DINING TABLE.pdf',
        thumbnail: '/assets/pdf/thumbnails/DINING TABLE.png',
    },
    {
        id: 'desk',
        name: 'Desk',
        file: '/assets/pdf/DESK.pdf',
        thumbnail: '/assets/pdf/thumbnails/DESK.png',
    },
    {
        id: 'sideboard-tv',
        name: 'Sideboard & TV Cabinet',
        file: '/assets/pdf/SIDEBOARD & TV CABINET.pdf',
        thumbnail: '/assets/pdf/thumbnails/SIDEBOARD & TV CABINET.png',
    },
    {
        id: 'bed-frames',
        name: 'Bed Frames',
        file: '/assets/pdf/BED FRAMES.pdf',
        thumbnail: '/assets/pdf/thumbnails/BED FRAMES.png',
    },
    {
        id: 'sofa-bench',
        name: 'Sofa & Bench',
        file: '/assets/pdf/SOFA & BENCH.pdf',
        thumbnail: '/assets/pdf/thumbnails/SOFA & BENCH.png',
    },
    {
        id: 'accessories',
        name: 'Accessories',
        file: '/assets/pdf/ACCESSORIES.pdf',
        thumbnail: '/assets/pdf/thumbnails/ACCESSORIES.png',
    },
    {
        id: 'bookshelf',
        name: 'Bookshelf',
        file: '/assets/pdf/BOOKSHELF.pdf',
        thumbnail: '/assets/pdf/thumbnails/BOOKSHELF.png',
    },
    {
        id: 'dresser-wardrobe',
        name: 'Dresser & Wardrobe',
        file: '/assets/pdf/DRESSER & WARDROBE.pdf',
        thumbnail: '/assets/pdf/thumbnails/DRESSER & WARDROBE.png',
    },
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

// Catalog Card component with thumbnail image
const CatalogCard = ({
    catalog,
    onClick,
    className,
}: {
    catalog: (typeof CATALOGS)[0];
    onClick: () => void;
    className?: string;
}) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <motion.div
            variants={itemVariants}
            onClick={onClick}
            className={`group cursor-pointer ${className || ''}`}
        >
            <div
                className="relative overflow-hidden border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                style={{ aspectRatio: '1 / 1.414' }} // A4 aspect ratio
            >
                {/* Thumbnail Image */}
                <div className="absolute inset-0">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                        </div>
                    )}
                    <img
                        src={catalog.thumbnail}
                        alt={catalog.name}
                        className="h-full w-full object-cover"
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                    />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                    <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="rounded-sm bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-lg">
                            Buka Katalog
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Flipbook Modal component using DearFlip
const FlipbookModal = ({
    catalog,
    onClose,
}: {
    catalog: (typeof CATALOGS)[0] | null;
    onClose: () => void;
}) => {
    if (!catalog) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black"
            onClick={onClose}
        >
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between bg-neutral-900 px-4 py-3">
                <h2 className="font-display text-lg font-semibold text-white md:text-xl">
                    {catalog.name}
                </h2>
                <button
                    onClick={onClose}
                    className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                    title="Close"
                >
                    <X size={24} />
                </button>
            </div>

            {/* DearFlip Viewer - Full Height */}
            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                <DearFlipViewer
                    pdfURL={catalog.file}
                    options={{
                        webgl: true,
                        backgroundColor: 'rgb(0, 0, 0)',
                        maxTextureSize: 2048,
                        pageMode: window.innerWidth <= 768 ? 1 : 2,
                        singlePageMode: window.innerWidth <= 768 ? 1 : 0,
                        soundEnable: false,
                        enableSound: false,
                        height: '100%',
                    }}
                />
            </div>
        </motion.div>
    );
};

export const CatalogSection: React.FC<{ className?: string }> = ({
    className = 'py-20 md:py-28',
}) => {
    const [selectedCatalog, setSelectedCatalog] = useState<
        (typeof CATALOGS)[0] | null
    >(null);

    return (
        <>
            <section className={`bg-neutral-50 ${className}`}>
                <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                        className="mb-16 text-center"
                    >
                        <span className="mb-4 inline-block text-xs font-medium tracking-[0.2em] text-teal-500 uppercase">
                            Katalog Produk
                        </span>
                        <h2 className="mb-4 font-display text-3xl font-semibold text-neutral-800 md:text-4xl">
                            Jelajahi Koleksi Kami
                        </h2>
                        <p className="mx-auto max-w-xl text-neutral-600">
                            Telusuri katalog lengkap kami dengan tampilan
                            flipbook interaktif
                        </p>
                    </motion.div>

                    {/* Catalog Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="grid grid-cols-2 items-center gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5"
                    >
                        {CATALOGS.map((catalog, index) => (
                            <CatalogCard
                                key={catalog.id}
                                catalog={catalog}
                                onClick={() => setSelectedCatalog(catalog)}
                                className={` ${index === 10 ? 'lg:col-start-2' : ''} ${index === 12 ? 'md:col-start-2 lg:col-start-auto' : ''} `}
                            />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Flipbook Modal */}
            <AnimatePresence>
                {selectedCatalog && (
                    <FlipbookModal
                        catalog={selectedCatalog}
                        onClose={() => setSelectedCatalog(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default CatalogSection;
