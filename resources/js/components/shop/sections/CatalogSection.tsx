import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Available catalogs from public/assets/pdf
const CATALOGS = [
    {
        id: 'lounge-chair',
        name: 'Lounge Chair',
        file: '/assets/pdf/LOUNGE CHAIR.pdf',
    },
    {
        id: 'dining-chair',
        name: 'Dining Chair',
        file: '/assets/pdf/DINING CHAIR.pdf',
    },
    { id: 'bar-stool', name: 'Bar Stool', file: '/assets/pdf/BAR STOOL.pdf' },
    {
        id: 'nightstand',
        name: 'Nightstand',
        file: '/assets/pdf/NIGHTSTAND.pdf',
    },
    {
        id: 'coffee-table',
        name: 'Coffee Table',
        file: '/assets/pdf/COFFEE TABLE.pdf',
    },
    {
        id: 'dining-table',
        name: 'Dining Table',
        file: '/assets/pdf/DINING TABLE.pdf',
    },
    { id: 'desk', name: 'Desk', file: '/assets/pdf/DESK.pdf' },
    {
        id: 'sideboard-tv',
        name: 'Sideboard & TV Cabinet',
        file: '/assets/pdf/SIDEBOARD & TV CABINET.pdf',
    },
    {
        id: 'bed-frames',
        name: 'Bed Frames',
        file: '/assets/pdf/BED FRAMES.pdf',
    },
    {
        id: 'sofa-bench',
        name: 'Sofa & Bench',
        file: '/assets/pdf/SOFA & BENCH.pdf',
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

// Page component with forwardRef - required by react-pageflip
interface PageCoverProps {
    children?: React.ReactNode;
    pageNumber: number;
    pdfFile: string;
    width: number;
}

const PageCover = forwardRef<HTMLDivElement, PageCoverProps>(
    ({ pageNumber, pdfFile, width }, ref) => {
        return (
            <div
                ref={ref}
                className="page-cover flex h-full w-full items-center justify-center bg-white"
                style={{ backgroundColor: '#fff' }}
            >
                <Document file={pdfFile} loading={null}>
                    <Page
                        pageNumber={pageNumber}
                        width={width}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                </Document>
            </div>
        );
    },
);
PageCover.displayName = 'PageCover';

// Regular page component with forwardRef
const FlipPage = forwardRef<HTMLDivElement, PageCoverProps>(
    ({ pageNumber, pdfFile, width }, ref) => {
        return (
            <div
                ref={ref}
                className="page flex h-full w-full items-center justify-center bg-white"
                style={{ backgroundColor: '#fff' }}
            >
                <Document file={pdfFile} loading={null}>
                    <Page
                        pageNumber={pageNumber}
                        width={width}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                </Document>
            </div>
        );
    },
);
FlipPage.displayName = 'FlipPage';

// Catalog Card component
const CatalogCard = ({
    catalog,
    onClick,
}: {
    catalog: (typeof CATALOGS)[0];
    onClick: () => void;
}) => {
    return (
        <motion.div
            variants={itemVariants}
            className="group relative cursor-pointer overflow-hidden bg-neutral-100 shadow-lg transition-all duration-300 hover:shadow-xl"
            onClick={onClick}
        >
            {/* PDF Cover Preview */}
            <div className="relative overflow-hidden">
                <Document
                    file={catalog.file}
                    loading={
                        <div className="flex aspect-[3/4] w-full items-center justify-center bg-neutral-200">
                            <BookOpen className="h-12 w-12 text-neutral-400" />
                        </div>
                    }
                >
                    <Page
                        pageNumber={1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="w-full transition-transform duration-500 group-hover:scale-105 [&>canvas]:!h-auto [&>canvas]:!w-full"
                    />
                </Document>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                    <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-800">
                            <BookOpen size={16} />
                            <span>Buka Katalog</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Flipbook Modal component
const FlipbookModal = ({
    catalog,
    onClose,
}: {
    catalog: (typeof CATALOGS)[0] | null;
    onClose: () => void;
}) => {
    const flipBookRef = useRef<any>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [targetPage, setTargetPage] = useState(0); // Track target page for immediate layout change
    const [isLoading, setIsLoading] = useState(true);
    const [pageWidth, setPageWidth] = useState(350);
    const [zoomLevel, setZoomLevel] = useState(1);

    // Calculate responsive dimensions - larger to fill screen
    useEffect(() => {
        const updateDimensions = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            // Calculate page dimensions based on viewport height (A4 aspect ratio 1:1.414)
            // More room now since we removed page indicator and hint
            const availableHeight = vh * 0.85; // 85% of viewport height
            const pageHeightFromVh = availableHeight;
            const pageWidthFromVh = pageHeightFromVh / 1.414;

            // For spread mode, we need 2 pages side by side
            const maxPageWidthForSpread = vw * 0.42; // Each page max 42% of viewport width

            // Use the smaller of the two calculations
            const calculatedWidth = Math.min(
                pageWidthFromVh,
                maxPageWidthForSpread,
            );

            // Set minimum and maximum bounds
            if (vw < 640) {
                setPageWidth(Math.max(vw * 0.38, 200));
            } else {
                setPageWidth(Math.max(Math.min(calculatedWidth, 600), 300));
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const onDocumentLoadSuccess = useCallback(
        ({ numPages }: { numPages: number }) => {
            setNumPages(numPages);
            setIsLoading(false);
        },
        [],
    );

    const goToPrev = () => {
        // Set target page immediately for instant layout change
        const prevPage = Math.max(0, currentPage - 2);
        setTargetPage(prevPage);
        flipBookRef.current?.pageFlip()?.flipPrev();
    };

    const goToNext = () => {
        // Set target page immediately for instant layout change
        const nextPage = Math.min(numPages - 1, currentPage + 2);
        setTargetPage(nextPage);
        flipBookRef.current?.pageFlip()?.flipNext();
    };

    const onFlip = useCallback((e: { data: number }) => {
        setCurrentPage(e.data);
        setTargetPage(e.data); // Sync target with actual page after flip completes
    }, []);

    // Handle flip state change - fires when flip starts (for clicks on PDF pages)
    const onChangeState = useCallback(
        (e: { data: string }) => {
            // When flip animation starts, predict the target page
            if (e.data === 'flipping') {
                const flipBook = flipBookRef.current?.pageFlip();
                if (flipBook) {
                    // Get current orientation to predict target
                    const current = flipBook.getCurrentPageIndex();
                    const orientation = flipBook.getOrientation();

                    // If we're on cover (page 0), going to spread
                    if (current === 0) {
                        setTargetPage(1);
                    }
                    // If we're on last page going back
                    else if (current >= numPages - 1) {
                        setTargetPage(numPages - 2);
                    }
                }
            }
        },
        [numPages],
    );

    const zoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 0.25, 2));
    };

    const zoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    };

    const resetZoom = () => {
        setZoomLevel(1);
    };

    if (!catalog) return null;

    const pageHeight = pageWidth * 1.414; // A4 aspect ratio

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative flex max-h-[95vh] w-full max-w-[95vw] flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-4 flex w-full items-center justify-between px-4">
                    <h2 className="font-display text-xl font-semibold text-white md:text-2xl">
                        {catalog.name}
                    </h2>
                    <div className="flex items-center gap-2">
                        {/* Zoom Controls */}
                        <button
                            onClick={zoomOut}
                            disabled={zoomLevel <= 0.5}
                            className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
                            title="Zoom Out"
                        >
                            <ZoomOut size={20} />
                        </button>
                        <span className="min-w-[3rem] text-center text-sm text-white">
                            {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                            onClick={zoomIn}
                            disabled={zoomLevel >= 2}
                            className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
                            title="Zoom In"
                        >
                            <ZoomIn size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="ml-2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Flipbook Container */}
                <div className="relative flex items-center justify-center gap-2 md:gap-4">
                    {/* Prev Button */}
                    <button
                        onClick={goToPrev}
                        disabled={currentPage === 0}
                        className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30 md:p-3"
                    >
                        <ChevronLeft size={24} className="md:h-7 md:w-7" />
                    </button>

                    {/* Flipbook */}
                    <div
                        className="relative shadow-2xl transition-transform duration-400"
                        style={{
                            // Shift to center when on cover (first page) or last page
                            // Use targetPage for immediate layout change when button clicked
                            transform:
                                targetPage === 0
                                    ? `translateX(-${pageWidth / 2}px)`
                                    : targetPage >= numPages - 1
                                      ? `translateX(${pageWidth / 2}px)`
                                      : 'translateX(0)',
                        }}
                    >
                        <div
                            style={{
                                transform: `scale(${zoomLevel})`,
                                transformOrigin: 'center center',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            {/* Hidden document to get page count */}
                            <div className="hidden">
                                <Document
                                    file={catalog.file}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                />
                            </div>

                            {/* Loading state */}
                            {isLoading && (
                                <div
                                    className="flex items-center justify-center bg-neutral-200"
                                    style={{
                                        width: pageWidth * 2,
                                        height: pageHeight,
                                    }}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
                                        <span className="text-neutral-600">
                                            Memuat katalog...
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Flipbook */}
                            {!isLoading && numPages > 0 && (
                                <HTMLFlipBook
                                    ref={flipBookRef}
                                    width={pageWidth}
                                    height={pageHeight}
                                    size="fixed"
                                    minWidth={200}
                                    maxWidth={600}
                                    minHeight={300}
                                    maxHeight={900}
                                    showCover={true}
                                    flippingTime={800}
                                    usePortrait={false}
                                    startPage={0}
                                    drawShadow={true}
                                    maxShadowOpacity={0.5}
                                    mobileScrollSupport={true}
                                    onFlip={onFlip}
                                    onChangeState={onChangeState}
                                    className=""
                                    style={{}}
                                    startZIndex={0}
                                    autoSize={false}
                                    clickEventForward={true}
                                    useMouseEvents={true}
                                    swipeDistance={30}
                                    showPageCorners={true}
                                    disableFlipByClick={false}
                                >
                                    {Array.from({ length: numPages }, (_, i) =>
                                        i === 0 ? (
                                            <PageCover
                                                key={`page-${i}`}
                                                pageNumber={i + 1}
                                                pdfFile={catalog.file}
                                                width={pageWidth}
                                            />
                                        ) : (
                                            <FlipPage
                                                key={`page-${i}`}
                                                pageNumber={i + 1}
                                                pdfFile={catalog.file}
                                                width={pageWidth}
                                            />
                                        ),
                                    )}
                                </HTMLFlipBook>
                            )}
                        </div>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={goToNext}
                        disabled={currentPage >= numPages - 2}
                        className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30 md:p-3"
                    >
                        <ChevronRight size={24} className="md:h-7 md:w-7" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const CatalogSection: React.FC = () => {
    const [selectedCatalog, setSelectedCatalog] = useState<
        (typeof CATALOGS)[0] | null
    >(null);

    return (
        <section className="bg-teal-900 px-6 py-24 md:px-12">
            <div className="mx-auto max-w-[1400px]">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                    className="mb-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
                >
                    <motion.div variants={itemVariants}>
                        <span className="text-xs font-medium tracking-[0.15em] text-teal-400 uppercase">
                            Katalog
                        </span>
                        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
                            Jelajahi Koleksi Kami
                        </h2>
                    </motion.div>
                    <motion.p
                        variants={itemVariants}
                        className="max-w-md text-left leading-relaxed text-neutral-400 md:text-right"
                    >
                        Temukan inspirasi dari katalog produk kami. Klik untuk
                        membuka dan jelajahi setiap halaman.
                    </motion.p>
                </motion.div>

                {/* Catalog Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5"
                >
                    {CATALOGS.map((catalog) => (
                        <CatalogCard
                            key={catalog.id}
                            catalog={catalog}
                            onClick={() => setSelectedCatalog(catalog)}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Flipbook Modal */}
            <AnimatePresence>
                {selectedCatalog && (
                    <FlipbookModal
                        catalog={selectedCatalog}
                        onClose={() => setSelectedCatalog(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default CatalogSection;
