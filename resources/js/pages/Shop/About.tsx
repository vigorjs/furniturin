import { router } from '@inertiajs/react';
import { Award, Users, Leaf, Heart, Target, Clock } from 'lucide-react';
import { Header, Footer, WhatsAppButton } from '@/components/shop';
import { SEOHead } from '@/components/seo';

const VALUES = [
    { icon: Award, title: 'Kualitas Premium', desc: 'Material terbaik dengan standar produksi tinggi' },
    { icon: Leaf, title: 'Ramah Lingkungan', desc: 'Kayu dari sumber berkelanjutan dan finishing aman' },
    { icon: Heart, title: 'Crafted with Love', desc: 'Setiap produk dibuat dengan ketelitian dan cinta' },
    { icon: Users, title: 'Tim Ahli', desc: 'Pengrajin berpengalaman lebih dari 15 tahun' },
];

const MILESTONES = [
    { year: '2010', title: 'Awal Mula', desc: 'Dimulai dari workshop kecil di Jepara' },
    { year: '2015', title: 'Ekspansi', desc: 'Membuka showroom pertama di Jakarta' },
    { year: '2020', title: 'Go Digital', desc: 'Meluncurkan platform e-commerce' },
    { year: '2024', title: 'Berkembang', desc: 'Melayani ribuan pelanggan di seluruh Indonesia' },
];

export default function About() {
    return (
        <>
            <SEOHead
                title="Tentang Kami"
                description="Latif Living - Toko furnitur premium Indonesia sejak 2010. Menghadirkan furniture berkualitas tinggi dengan sentuhan seni untuk hunian modern Indonesia. Pengrajin berpengalaman dari Jepara."
                keywords={['tentang latif living', 'furnitur jepara', 'mebel indonesia', 'furniture premium', 'pengrajin mebel']}
            />
            <div className="bg-noise" />
            <Header cartCount={0} onCartClick={() => {}} onLogoClick={() => router.visit('/shop')} />

            <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                {/* Hero */}
                <div className="bg-gradient-to-r from-terra-800 to-terra-900 text-white py-20 mb-16">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
                        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Tentang Latif Living</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Menghadirkan furniture berkualitas tinggi dengan sentuhan seni untuk hunian modern Indonesia
                        </p>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    {/* Story Section */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h2 className="font-serif text-3xl text-terra-900 mb-6">Cerita Kami</h2>
                            <div className="space-y-4 text-terra-600 leading-relaxed">
                                <p>
                                    <strong className="text-terra-900">Latif Living</strong> lahir dari passion terhadap seni furniture dan
                                    keinginan untuk menghadirkan produk berkualitas tinggi yang dapat dijangkau oleh keluarga Indonesia.
                                </p>
                                <p>
                                    Berawal dari workshop kecil di Jepara, kota yang terkenal dengan keahlian ukir kayunya,
                                    kami tumbuh menjadi brand furniture terpercaya yang melayani pelanggan di seluruh Indonesia.
                                </p>
                                <p>
                                    Setiap produk Latif Living dibuat dengan teliti oleh pengrajin berpengalaman,
                                    menggunakan material pilihan dan proses quality control yang ketat.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-terra-200">
                                <img src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800" alt="Workshop" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-wood-dark text-white p-6 rounded-2xl">
                                <div className="text-3xl font-bold">14+</div>
                                <div className="text-sm opacity-80">Tahun Pengalaman</div>
                            </div>
                        </div>
                    </div>

                    {/* Vision & Mission */}
                    <div className="grid md:grid-cols-2 gap-8 mb-20">
                        <div className="bg-white rounded-2xl p-8 border border-terra-100">
                            <div className="w-14 h-14 bg-wood/10 rounded-xl flex items-center justify-center mb-6">
                                <Target size={28} className="text-wood-dark" />
                            </div>
                            <h3 className="font-serif text-2xl text-terra-900 mb-4">Visi</h3>
                            <p className="text-terra-600 leading-relaxed">
                                Menjadi brand furniture terdepan di Indonesia yang menghadirkan produk berkualitas premium
                                dengan harga terjangkau, serta berkontribusi pada pelestarian seni kerajinan kayu tradisional.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 border border-terra-100">
                            <div className="w-14 h-14 bg-wood/10 rounded-xl flex items-center justify-center mb-6">
                                <Clock size={28} className="text-wood-dark" />
                            </div>
                            <h3 className="font-serif text-2xl text-terra-900 mb-4">Misi</h3>
                            <ul className="text-terra-600 space-y-2">
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-wood rounded-full mt-2"></span>Menghadirkan furniture berkualitas dengan desain modern</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-wood rounded-full mt-2"></span>Memberdayakan pengrajin lokal dengan upah yang layak</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-wood rounded-full mt-2"></span>Menggunakan material ramah lingkungan</li>
                                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-wood rounded-full mt-2"></span>Memberikan pelayanan terbaik kepada pelanggan</li>
                            </ul>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="mb-20">
                        <h2 className="font-serif text-3xl text-terra-900 text-center mb-12">Nilai-Nilai Kami</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {VALUES.map((v, i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 border border-terra-100 text-center hover:shadow-lg transition-shadow">
                                    <div className="w-16 h-16 bg-wood/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <v.icon size={32} className="text-wood-dark" />
                                    </div>
                                    <h3 className="font-medium text-terra-900 mb-2">{v.title}</h3>
                                    <p className="text-sm text-terra-500">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-20">
                        <h2 className="font-serif text-3xl text-terra-900 text-center mb-12">Perjalanan Kami</h2>
                        <div className="relative">
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-terra-200 hidden md:block"></div>
                            <div className="space-y-8">
                                {MILESTONES.map((m, i) => (
                                    <div key={i} className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                            <div className="bg-white rounded-2xl p-6 border border-terra-100 inline-block">
                                                <div className="text-wood-dark font-bold text-xl mb-1">{m.year}</div>
                                                <h4 className="font-medium text-terra-900 mb-1">{m.title}</h4>
                                                <p className="text-sm text-terra-500">{m.desc}</p>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex w-4 h-4 bg-wood rounded-full border-4 border-sand-50 z-10"></div>
                                        <div className="flex-1 hidden md:block"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-terra-900 rounded-3xl p-12 text-center text-white">
                        <h2 className="font-serif text-3xl mb-4">Siap Wujudkan Hunian Impian?</h2>
                        <p className="opacity-80 mb-8 max-w-xl mx-auto">Konsultasikan kebutuhan furniture Anda dengan tim kami</p>
                        <a href="/shop/products" className="inline-flex items-center gap-2 bg-wood text-white px-8 py-4 rounded-full font-medium hover:bg-wood-dark transition-colors">
                            Lihat Koleksi Kami
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
            <WhatsAppButton phoneNumber="6281234567890" message="Halo, saya ingin tahu lebih lanjut tentang Latif Living" />
        </>
    );
}

