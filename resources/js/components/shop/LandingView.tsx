import { motion } from 'framer-motion';
import { Product, ApiProduct, ApiCategory, HomeTestimonial, HeroSettings, HomeValue } from '@/types/shop';
import { HeroSection } from './sections/HeroSection';
import { TrustSection } from './sections/TrustSection';
import { CategoriesSection } from './sections/CategoriesSection';
import { ValuesSection } from './sections/ValuesSection';
import { ProductsSection } from './sections/ProductsSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { NewsletterSection } from './sections/NewsletterSection';

interface LandingViewProps {
    onProductClick: (product: Product) => void;
    featuredProducts: ApiProduct[];
    featuredCategories: ApiCategory[];
    testimonials: HomeTestimonial[];
    heroSettings: HeroSettings;
    trustLogos: string[];
    values: HomeValue[];
}

export const LandingView: React.FC<LandingViewProps> = ({
    onProductClick,
    featuredProducts,
    featuredCategories,
    testimonials,
    heroSettings,
    trustLogos,
    values,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden"
        >
            <HeroSection settings={heroSettings} />
            <TrustSection logos={trustLogos} />
            <CategoriesSection categories={featuredCategories} />
            <ValuesSection values={values} />
            <ProductsSection products={featuredProducts} onProductClick={onProductClick} />
            <TestimonialsSection testimonials={testimonials} />
            <NewsletterSection />
        </motion.div>
    );
};

export default LandingView;

