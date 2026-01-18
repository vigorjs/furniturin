import { ApiCategory } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoriesSectionProps {
    categories: ApiCategory[];
}

// Default placeholder images
const PLACEHOLDER_IMAGES = [
    '/images/placeholders/category-living-room.png',
    '/images/placeholders/category-dining-room.png',
    '/images/placeholders/category-bedroom.png',
    '/images/placeholders/category-workspace.png',
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' as const },
    },
};

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
    categories,
}) => {
    const displayCategories = categories.slice(0, 4);

    if (displayCategories.length === 0) {
        return null;
    }

    return (
        <section className="bg-neutral-50 px-6 py-24 md:px-12">
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
                        <span className="text-xs font-medium tracking-[0.15em] text-teal-500 uppercase">
                            Browse
                        </span>
                        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-neutral-800 md:text-5xl">
                            Shop by Room
                        </h2>
                    </motion.div>
                    <motion.p
                        variants={itemVariants}
                        className="max-w-md text-left leading-relaxed text-neutral-500 md:text-right"
                    >
                        Explore our curated collections designed with care for
                        every space in your home.
                    </motion.p>
                </motion.div>

                {/* Category Grid - Fixed layout */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
                >
                    {displayCategories.map((category, index) => (
                        <motion.div key={category.id} variants={itemVariants}>
                            <Link
                                href={`/shop/products?filter[category]=${category.slug}`}
                                className="group relative block cursor-pointer overflow-hidden rounded-sm"
                            >
                                {/* Image */}
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={
                                            category.image_url ||
                                            PLACEHOLDER_IMAGES[
                                                index %
                                                    PLACEHOLDER_IMAGES.length
                                            ]
                                        }
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={category.name}
                                    />
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/50" />

                                {/* Content */}
                                <div className="absolute right-0 bottom-0 left-0 p-6">
                                    <h3 className="font-display text-xl font-medium text-white md:text-2xl">
                                        {category.name}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <span>Explore</span>
                                        <ArrowRight
                                            size={14}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default CategoriesSection;
