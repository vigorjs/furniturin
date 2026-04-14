import {
  ApiCategory,
  ApiProduct,
  CarouselBannerSlide,
  HeroSettings,
  HomeTestimonial,
  HomeValue,
} from '@/types/shop';
import { motion } from 'framer-motion';
import { CarouselBannerSection } from './sections/CarouselBannerSection';
import { CatalogSection } from './sections/CatalogSection';
import { CategoriesSection } from './sections/CategoriesSection';
import { HeroSection } from './sections/HeroSection';
import { NewsletterSection } from './sections/NewsletterSection';
import { ProductsSection } from './sections/ProductsSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { TrustSection } from './sections/TrustSection';
import { ValuesSection } from './sections/ValuesSection';

interface SectionVisibility {
  hero: boolean;
  carousel_banners: boolean;
  trust: boolean;
  categories: boolean;
  catalog: boolean;
  values: boolean;
  products: boolean;
  testimonials: boolean;
  newsletter: boolean;
}

interface LandingViewProps {
  featuredProducts: ApiProduct[];
  featuredCategories: ApiCategory[];
  testimonials: HomeTestimonial[];
  heroSettings: HeroSettings;
  trustLogos: string[] | { name: string; logo_url?: string }[];
  values: HomeValue[];
  carouselBanners?: CarouselBannerSlide[];
  sectionVisibility?: SectionVisibility;
}

export const LandingView: React.FC<LandingViewProps> = ({
  featuredProducts,
  featuredCategories,
  testimonials,
  heroSettings,
  trustLogos,
  values,
  carouselBanners,
  sectionVisibility,
}) => {
  // Default all sections to visible
  const visibility = sectionVisibility ?? {
    hero: true,
    carousel_banners: true,
    trust: true,
    categories: true,
    catalog: true,
    values: true,
    products: true,
    testimonials: true,
    newsletter: true,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden"
    >
      {visibility.hero && <HeroSection settings={heroSettings} />}
      {visibility.carousel_banners &&
        carouselBanners &&
        carouselBanners.length > 0 && (
          <CarouselBannerSection banners={carouselBanners} />
        )}
      {visibility.trust && <TrustSection logos={trustLogos} />}
      {visibility.categories && (
        <CategoriesSection categories={featuredCategories} />
      )}
      {visibility.catalog && <CatalogSection />}
      {visibility.values && <ValuesSection values={values} />}
      {visibility.products && <ProductsSection products={featuredProducts} />}
      {visibility.testimonials && (
        <TestimonialsSection testimonials={testimonials} />
      )}
      {visibility.newsletter && <NewsletterSection />}
    </motion.div>
  );
};

export default LandingView;
