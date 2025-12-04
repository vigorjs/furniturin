import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroSettings } from '@/types/shop';

interface HeroSectionProps {
    settings: HeroSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);

    return (
        <section className="relative min-h-[95vh] flex items-center pt-24 pb-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-[60%] h-full bg-[#f0ede6] -z-10 rounded-bl-[100px]" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative z-10 order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-block px-3 py-1 mb-6 border border-terra-800/30 rounded-full text-xs font-semibold uppercase tracking-widest text-terra-800">
                            {settings.badge}
                        </span>
                        <h1 className="font-serif text-6xl md:text-8xl leading-[1.1] mb-8 text-terra-900">
                            {settings.title} <br />
                            <span className="italic text-wood">{settings.title_highlight}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-terra-600 mb-10 max-w-lg leading-relaxed font-light">
                            {settings.description}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-terra-900 text-white px-10 py-4 rounded-full font-medium hover:bg-wood transition-all duration-300 shadow-xl shadow-terra-900/20">
                                Lihat Koleksi
                            </button>
                            <button className="px-10 py-4 rounded-full font-medium border border-terra-200 hover:border-terra-900 transition-colors duration-300">
                                Katalog
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="relative h-[600px] lg:h-[800px] w-full order-1 lg:order-2 flex items-center justify-center lg:justify-end">
                    <motion.div style={{ y: y1 }} className="absolute top-20 left-10 md:left-20 w-64 h-80 z-20 hidden md:block">
                        <img src={settings.image_secondary} className="w-full h-full object-cover rounded-2xl shadow-2xl" alt="Interior Detail" />
                    </motion.div>

                    <motion.div style={{ y: y2 }} className="relative z-10 w-full md:w-[80%] h-[90%] rounded-t-[200px] rounded-b-[20px] overflow-hidden shadow-2xl">
                        <img src={settings.image_main} className="w-full h-full object-cover" alt="Hero Furniture" />
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/40 to-transparent p-8">
                            <p className="text-white font-serif italic text-2xl">{settings.product_name}</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

