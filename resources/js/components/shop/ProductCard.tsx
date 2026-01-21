import { ApiProduct } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { Star } from 'lucide-react';

interface ProductCardProps {
    product: ApiProduct;
    className?: string;
}

// Placeholder images for products without images
const PLACEHOLDER_PRODUCTS = [
    '/images/placeholders/product-sofa.png',
    '/images/placeholders/product-dining-table.png',
    '/images/placeholders/product-chair.png',
];

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    className = '',
}) => {
    return (
        <Link
            href={`/shop/products/${product.slug}`}
            className={`group block ${className}`}
        >
            {/* Product Card - Sharp corners, shadow hover per design.md */}
            <div className="relative mb-4 overflow-hidden rounded-sm bg-neutral-50">
                {/* Image Container */}
                <div className="aspect-[4/5] overflow-hidden">
                    <img
                        src={
                            product.primary_image?.image_url ||
                            product.images?.[0]?.image_url ||
                            PLACEHOLDER_PRODUCTS[0] // Fallback if no images and no index context
                        }
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.has_discount && (
                        <span className="rounded-sm bg-red-500 px-2.5 py-1 text-xs font-medium text-white">
                            -{product.discount_percentage}%
                        </span>
                    )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-teal-500/0 transition-colors duration-300 group-hover:bg-teal-500/5" />
            </div>

            {/* Product Info */}
            <div className="space-y-1.5">
                <span className="text-xs font-medium tracking-wider text-teal-500 uppercase">
                    {product.category?.name}
                </span>
                <h3 className="font-display text-lg leading-snug font-medium text-neutral-800 transition-colors group-hover:text-teal-500">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-800">
                            {product.final_price_formatted}
                        </span>
                        {product.has_discount && (
                            <span className="text-sm text-neutral-400 line-through">
                                {product.price_formatted}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Star
                            size={14}
                            className="fill-accent-500 text-accent-500"
                        />
                        <span className="text-sm text-neutral-500">
                            {Number(product.average_rating || 0).toFixed(1)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
