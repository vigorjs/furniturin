import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Header, Footer } from '@/components/shop';
import { ApiCategory } from '@/types/shop';

interface Props {
    categories: ApiCategory[];
}

// Placeholder images untuk kategori
const CATEGORY_IMAGES: Record<string, string> = {
    'ruang-tamu': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    'ruang-makan': 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800',
    'kamar-tidur': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    'kantor': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
    'outdoor': 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
    'dekorasi': 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
    'pencahayaan': 'https://images.unsplash.com/photo-1507473888900-52ea7556162f?w=800',
    'default': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800',
};

export default function CategoriesIndex({ categories }: Props) {
    return (
        <>
            <Head title="Kategori - Latif Living" />
            <div className="bg-noise" />
            <Header cartCount={0} onCartClick={() => {}} onLogoClick={() => router.visit('/shop')} />

            <main className="min-h-screen bg-white pt-28 pb-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="font-serif text-4xl md:text-5xl text-terra-900 mb-4">Jelajahi Kategori</h1>
                        <p className="text-terra-500 max-w-xl mx-auto">
                            Temukan koleksi furniture berkualitas untuk setiap ruangan di rumah Anda
                        </p>
                    </div>

                    {/* Categories Grid - Bento Style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, index) => (
                            <CategoryCard key={category.id} category={category} index={index} />
                        ))}
                    </div>

                    {/* Empty State */}
                    {categories.length === 0 && (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-medium text-terra-900 mb-2">Belum ada kategori</h3>
                            <p className="text-terra-500">Kategori produk akan segera tersedia</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

interface CategoryCardProps {
    category: ApiCategory;
    index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
    const imageUrl = category.image_url || CATEGORY_IMAGES[category.slug] || CATEGORY_IMAGES['default'];

    // Make first 2 cards larger on desktop
    const isLarge = index < 2;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={isLarge ? 'lg:col-span-1 lg:row-span-2' : ''}
        >
            <Link
                href={`/shop/category/${category.slug}`}
                className="group block relative overflow-hidden rounded-3xl bg-sand-100 h-full"
            >
                <div className={`relative ${isLarge ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                    <img
                        src={imageUrl}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">{category.name}</h3>
                        {category.description && (
                            <p className="text-white/80 text-sm mb-4 line-clamp-2">{category.description}</p>
                        )}
                        {category.products_count !== undefined && (
                            <span className="text-white/60 text-sm">{category.products_count} Produk</span>
                        )}
                        <div className="flex items-center gap-2 mt-4 text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                            <span className="text-sm font-medium">Lihat Koleksi</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Featured Badge */}
                    {category.is_featured && (
                        <span className="absolute top-4 left-4 bg-wood text-white px-3 py-1 rounded-full text-sm font-medium">
                            Unggulan
                        </span>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}

