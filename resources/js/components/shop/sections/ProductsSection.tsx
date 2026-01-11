import { ApiProduct } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

// Placeholder images for products without images
const PLACEHOLDER_PRODUCTS = [
    '/images/placeholders/product-sofa.png',
    '/images/placeholders/product-dining-table.png',
    '/images/placeholders/product-chair.png',
];

interface ProductsSectionProps {
    products: ApiProduct[];
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
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

export const ProductsSection: React.FC<ProductsSectionProps> = ({
    products,
}) => {
    if (products.length === 0) {
        return null;
    }

    return (
        <section className="bg-white px-6 py-24 md:px-12">
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
                            Best Sellers
                        </span>
                        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-neutral-800 md:text-5xl">
                            Featured Products
                        </h2>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Link
                            href="/shop/products"
                            className="group flex items-center gap-2 font-medium text-neutral-800 transition-colors hover:text-teal-500"
                        >
                            View All
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Product Grid - 3-4 columns per design.md */}
                <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((apiProduct, index) => (
                        <Link
                            key={apiProduct.id}
                            href={`/shop/products/${apiProduct.slug}`}
                            className="group block"
                        >
                            {/* Product Card - Sharp corners, shadow hover per design.md */}
                            <div className="relative mb-4 overflow-hidden rounded-sm bg-neutral-50">
                                {/* Image Container */}
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img
                                        src={
                                            apiProduct.primary_image
                                                ?.image_url ||
                                            apiProduct.images?.[0]?.image_url ||
                                            PLACEHOLDER_PRODUCTS[
                                                index %
                                                    PLACEHOLDER_PRODUCTS.length
                                            ]
                                        }
                                        alt={apiProduct.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                    {apiProduct.has_discount && (
                                        <span className="rounded-sm bg-red-500 px-2.5 py-1 text-xs font-medium text-white">
                                            -{apiProduct.discount_percentage}%
                                        </span>
                                    )}
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-teal-500/0 transition-colors duration-300 group-hover:bg-teal-500/5" />
                            </div>

                            {/* Product Info */}
                            <div className="space-y-1.5">
                                <span className="text-xs font-medium tracking-wider text-teal-500 uppercase">
                                    {apiProduct.category?.name}
                                </span>
                                <h3 className="font-display text-lg leading-snug font-medium text-neutral-800 transition-colors group-hover:text-teal-500">
                                    {apiProduct.name}
                                </h3>
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-neutral-800">
                                            {apiProduct.final_price_formatted}
                                        </span>
                                        {apiProduct.has_discount && (
                                            <span className="text-sm text-neutral-400 line-through">
                                                {apiProduct.price_formatted}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star
                                            size={14}
                                            className="fill-accent-500 text-accent-500"
                                        />
                                        <span className="text-sm text-neutral-500">
                                            {Number(
                                                apiProduct.average_rating || 0,
                                            ).toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;
