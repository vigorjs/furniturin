import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { ApiCategory } from '@/types/shop';

interface CategoriesSectionProps {
    categories: ApiCategory[];
}

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop';

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
    // Ensure we have at least 3 categories for the layout
    const displayCategories = categories.slice(0, 3);

    if (displayCategories.length === 0) {
        return null;
    }

    return (
        <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                <h2 className="font-serif text-5xl text-terra-900">Ruangan Pilihan</h2>
                <p className="text-terra-500 max-w-sm text-right mt-4 md:mt-0">Jelajahi koleksi kami yang dirancang dengan penuh perhatian untuk setiap ruangan di rumah Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                {/* First category - large */}
                {displayCategories[0] && (
                    <Link
                        href={`/shop/category/${displayCategories[0].slug}`}
                        className="md:col-span-2 relative group overflow-hidden rounded-3xl cursor-pointer"
                    >
                        <img
                            src={displayCategories[0].image_url || PLACEHOLDER_IMAGE}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt={displayCategories[0].name}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <h3 className="font-serif text-3xl">{displayCategories[0].name}</h3>
                            <p className="text-sm opacity-80 mt-2 flex items-center gap-2">Jelajahi <ArrowRight size={14} /></p>
                        </div>
                    </Link>
                )}

                {/* Second and third categories - stacked */}
                <div className="flex flex-col gap-6">
                    {displayCategories[1] && (
                        <Link
                            href={`/shop/category/${displayCategories[1].slug}`}
                            className="flex-1 relative group overflow-hidden rounded-3xl cursor-pointer"
                        >
                            <img
                                src={displayCategories[1].image_url || PLACEHOLDER_IMAGE}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={displayCategories[1].name}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="font-serif text-2xl">{displayCategories[1].name}</h3>
                            </div>
                        </Link>
                    )}
                    {displayCategories[2] && (
                        <Link
                            href={`/shop/category/${displayCategories[2].slug}`}
                            className="flex-1 relative group overflow-hidden rounded-3xl cursor-pointer"
                        >
                            <img
                                src={displayCategories[2].image_url || PLACEHOLDER_IMAGE}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={displayCategories[2].name}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="font-serif text-2xl">{displayCategories[2].name}</h3>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;

