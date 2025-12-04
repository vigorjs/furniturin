import { Quote, Star } from 'lucide-react';
import { HomeTestimonial } from '@/types/shop';

interface TestimonialsSectionProps {
    testimonials: HomeTestimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-terra-900 relative overflow-hidden">
            <div className="absolute top-20 left-20 text-[400px] font-serif text-white opacity-[0.02] pointer-events-none">"</div>
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <span className="text-wood-light font-medium uppercase tracking-widest text-xs">Testimoni</span>
                    <h2 className="font-serif text-5xl text-white mt-2">Kata Pelanggan</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                                <Quote size={24} className="text-wood" />
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < t.rating ? "text-yellow-500 fill-yellow-500" : "text-terra-600"}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-terra-200 text-lg leading-relaxed mb-8">{t.text}</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-terra-700 rounded-full flex items-center justify-center font-serif text-white text-lg">
                                    {t.author[0]}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{t.author}</p>
                                    <p className="text-terra-400 text-sm">{t.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;

