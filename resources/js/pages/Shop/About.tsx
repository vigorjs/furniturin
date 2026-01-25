import { SEOHead } from '@/components/seo';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import { Award, Clock, Heart, Leaf, Target, Users } from 'lucide-react';

const VALUES = [
    {
        icon: Award,
        title: 'Kualitas Premium',
        desc: 'Material terbaik dengan standar produksi tinggi',
    },
    {
        icon: Leaf,
        title: 'Ramah Lingkungan',
        desc: 'Kayu dari sumber berkelanjutan dan finishing aman',
    },
    {
        icon: Heart,
        title: 'Crafted with Love',
        desc: 'Setiap produk dibuat dengan ketelitian dan cinta',
    },
    {
        icon: Users,
        title: 'Tim Ahli',
        desc: 'Pengrajin berpengalaman lebih dari 15 tahun',
    },
];

const MILESTONES = [
    {
        year: '2010',
        title: 'Awal Mula',
        desc: 'Dimulai dari workshop kecil di Jepara',
    },
    {
        year: '2015',
        title: 'Ekspansi',
        desc: 'Membuka showroom pertama di Jakarta',
    },
    {
        year: '2020',
        title: 'Go Digital',
        desc: 'Meluncurkan platform e-commerce',
    },
    {
        year: '2024',
        title: 'Berkembang',
        desc: 'Melayani ribuan pelanggan di seluruh Indonesia',
    },
];

export default function About() {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Furniturin';

    return (
        <>
            <SEOHead
                title="Tentang Kami"
                description={`${siteName} - Toko furnitur premium Indonesia sejak 2010. Menghadirkan furniture berkualitas tinggi dengan sentuhan seni untuk hunian modern Indonesia. Pengrajin berpengalaman dari Jepara.`}
                keywords={[
                    'tentang kami',
                    'furnitur jepara',
                    'mebel indonesia',
                    'furniture premium',
                    'pengrajin mebel',
                ]}
            />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pb-20">
                    {/* Hero */}
                    <div className="mb-16 bg-gradient-to-r from-teal-600 to-teal-700 py-20 text-white">
                        <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
                            <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                                Tentang {siteName}
                            </h1>
                            <p className="mx-auto max-w-2xl text-xl opacity-90">
                                Menghadirkan furniture berkualitas tinggi dengan
                                sentuhan seni untuk hunian modern Indonesia
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        {/* Story Section */}
                        <div className="mb-20 grid items-center gap-12 md:grid-cols-2">
                            <div>
                                <h2 className="mb-6 font-serif text-3xl text-terra-900">
                                    Cerita Kami
                                </h2>
                                <div className="space-y-4 leading-relaxed text-terra-600">
                                    <p>
                                        <strong className="text-terra-900">
                                            {siteName}
                                        </strong>{' '}
                                        lahir dari passion terhadap seni
                                        furniture dan keinginan untuk
                                        menghadirkan produk berkualitas tinggi
                                        yang dapat dijangkau oleh keluarga
                                        Indonesia.
                                    </p>
                                    <p>
                                        Berawal dari workshop kecil di Jepara,
                                        kota yang terkenal dengan keahlian ukir
                                        kayunya, kami tumbuh menjadi brand
                                        furniture terpercaya yang melayani
                                        pelanggan di seluruh Indonesia.
                                    </p>
                                    <p>
                                        Setiap produk {siteName} dibuat dengan
                                        teliti oleh pengrajin berpengalaman,
                                        menggunakan material pilihan dan proses
                                        quality control yang ketat.
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-[4/3] overflow-hidden rounded-sm bg-neutral-200">
                                    <img
                                        src="/images/placeholder-about.svg"
                                        alt="Workshop"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -left-6 rounded-sm bg-teal-600 p-6 text-white">
                                    <div className="text-3xl font-bold">
                                        14+
                                    </div>
                                    <div className="text-sm opacity-80">
                                        Tahun Pengalaman
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vision & Mission */}
                        <div className="mb-20 grid gap-8 md:grid-cols-2">
                            <div className="rounded-sm border border-terra-100 bg-white p-8">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-teal-100">
                                    <Target
                                        size={28}
                                        className="text-teal-600"
                                    />
                                </div>
                                <h3 className="mb-4 font-serif text-2xl text-terra-900">
                                    Visi
                                </h3>
                                <p className="leading-relaxed text-terra-600">
                                    Menjadi brand furniture terdepan di
                                    Indonesia yang menghadirkan produk
                                    berkualitas premium dengan harga terjangkau,
                                    serta berkontribusi pada pelestarian seni
                                    kerajinan kayu tradisional.
                                </p>
                            </div>
                            <div className="rounded-sm border border-terra-100 bg-white p-8">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-teal-100">
                                    <Clock
                                        size={28}
                                        className="text-teal-600"
                                    />
                                </div>
                                <h3 className="mb-4 font-serif text-2xl text-terra-900">
                                    Misi
                                </h3>
                                <ul className="space-y-2 text-terra-600">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                                        Menghadirkan furniture berkualitas
                                        dengan desain modern
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                                        Memberdayakan pengrajin lokal dengan
                                        upah yang layak
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                                        Menggunakan material ramah lingkungan
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                                        Memberikan pelayanan terbaik kepada
                                        pelanggan
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Values */}
                        <div className="mb-20">
                            <h2 className="mb-12 text-center font-serif text-3xl text-terra-900">
                                Nilai-Nilai Kami
                            </h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {VALUES.map((v, i) => (
                                    <div
                                        key={i}
                                        className="rounded-sm border border-terra-100 bg-white p-6 text-center transition-shadow hover:shadow-lg"
                                    >
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                                            <v.icon
                                                size={32}
                                                className="text-teal-600"
                                            />
                                        </div>
                                        <h3 className="mb-2 font-medium text-terra-900">
                                            {v.title}
                                        </h3>
                                        <p className="text-sm text-terra-500">
                                            {v.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="mb-20">
                            <h2 className="mb-12 text-center font-serif text-3xl text-terra-900">
                                Perjalanan Kami
                            </h2>
                            <div className="relative">
                                <div className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 bg-terra-200 md:block"></div>
                                <div className="space-y-8">
                                    {MILESTONES.map((m, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                        >
                                            <div
                                                className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                                            >
                                                <div className="inline-block rounded-sm border border-terra-100 bg-white p-6">
                                                    <div className="mb-1 text-xl font-bold text-teal-600">
                                                        {m.year}
                                                    </div>
                                                    <h4 className="mb-1 font-medium text-terra-900">
                                                        {m.title}
                                                    </h4>
                                                    <p className="text-sm text-terra-500">
                                                        {m.desc}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="z-10 hidden h-4 w-4 rounded-full border-4 border-sand-50 bg-wood md:flex"></div>
                                            <div className="hidden flex-1 md:block"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="rounded-sm bg-teal-700 p-12 text-center text-white">
                            <h2 className="mb-4 font-serif text-3xl">
                                Siap Wujudkan Hunian Impian?
                            </h2>
                            <p className="mx-auto mb-8 max-w-xl opacity-80">
                                Konsultasikan kebutuhan furniture Anda dengan
                                tim kami
                            </p>
                            <a
                                href="/shop/products"
                                className="inline-flex items-center gap-2 rounded-sm bg-white px-8 py-4 font-medium text-teal-700 transition-colors hover:bg-teal-50"
                            >
                                Lihat Koleksi Kami
                            </a>
                        </div>
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}
