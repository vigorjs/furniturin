import { motion } from 'framer-motion';

interface TrustSectionProps {
    logos: string[];
}

export const TrustSection: React.FC<TrustSectionProps> = ({ logos }) => (
    <>
        {/* Trust / Press Logos Section */}
        <section className="border-y border-neutral-100 bg-white py-16">
            <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                <p className="mb-10 text-center text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase">
                    Trusted by Modern Homes & Featured In
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale transition-all duration-500 hover:opacity-70 hover:grayscale-0 md:justify-between md:gap-12">
                    {logos.map((name) => (
                        <span
                            key={name}
                            className="cursor-default font-display text-xl font-semibold text-neutral-800 md:text-2xl"
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </div>
        </section>

        {/* Marquee Section */}
        <div className="overflow-hidden bg-teal-500 py-6 whitespace-nowrap">
            <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ repeat: Infinity, ease: 'linear', duration: 45 }}
                className="inline-block"
            >
                {Array(4)
                    .fill(
                        'Sustainability • Craftsmanship • Timeless Design • Modern Living • ',
                    )
                    .map((text, i) => (
                        <span
                            key={i}
                            className="mx-8 font-serif text-lg font-medium tracking-[0.2em] text-teal-100/90 uppercase md:text-xl"
                        >
                            {text}
                        </span>
                    ))}
            </motion.div>
        </div>
    </>
);

export default TrustSection;
