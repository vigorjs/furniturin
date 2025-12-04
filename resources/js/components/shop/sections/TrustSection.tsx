import { motion } from 'framer-motion';

interface TrustSectionProps {
    logos: string[];
}

export const TrustSection: React.FC<TrustSectionProps> = ({ logos }) => (
    <>
        {/* Trust / Press Logos Section */}
        <section className="py-12 border-y border-terra-100 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <p className="text-center text-terra-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">Dipercaya oleh Rumah Modern & Ditampilkan Di</p>
                <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    {logos.map((name) => (
                        <span key={name} className="font-serif text-2xl md:text-3xl font-bold text-terra-900 cursor-default">{name}</span>
                    ))}
                </div>
            </div>
        </section>

        {/* Marquee Section */}
        <div className="bg-terra-900 py-6 overflow-hidden whitespace-nowrap">
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                className="inline-block"
            >
                {Array(4).fill("Keberlanjutan • Keahlian • Desain Timeless • Hunian Modern • ").map((text, i) => (
                    <span key={i} className="text-terra-200/50 font-serif text-4xl mx-4">{text}</span>
                ))}
            </motion.div>
        </div>
    </>
);

export default TrustSection;

