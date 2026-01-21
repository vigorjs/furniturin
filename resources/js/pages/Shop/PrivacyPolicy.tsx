import ShopLayout from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function PrivacyPolicy() {
    const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Furniturin';

    return (
        <>
            <Head title={`Kebijakan Privasi - ${siteName}`} />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                    <div className="mx-auto max-w-4xl px-6 md:px-12">
                        <div className="rounded-sm border border-terra-100 bg-white p-8 shadow-sm md:p-12">
                            <h1 className="mb-8 font-serif text-4xl text-terra-900">
                                Kebijakan Privasi
                            </h1>
                            <p className="mb-8 text-sm text-terra-500">
                                Terakhir diperbarui: Desember 2025
                            </p>

                            <div className="prose prose-terra max-w-none space-y-8">
                                <section>
                                    <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                        1. Informasi yang Kami Kumpulkan
                                    </h2>
                                    <p className="mb-4 leading-relaxed text-terra-600">
                                        Kami mengumpulkan informasi yang Anda
                                        berikan secara langsung, termasuk:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-terra-600">
                                        <li>
                                            Nama lengkap dan informasi kontak
                                            (email, nomor telepon)
                                        </li>
                                        <li>Alamat pengiriman dan penagihan</li>
                                        <li>
                                            Informasi pembayaran (diproses
                                            secara aman)
                                        </li>
                                        <li>
                                            Riwayat pesanan dan preferensi
                                            produk
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                        2. Penggunaan Informasi
                                    </h2>
                                    <p className="mb-4 leading-relaxed text-terra-600">
                                        Informasi Anda digunakan untuk:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-terra-600">
                                        <li>
                                            Memproses dan mengirimkan pesanan
                                            Anda
                                        </li>
                                        <li>
                                            Berkomunikasi mengenai pesanan dan
                                            layanan
                                        </li>
                                        <li>
                                            Mengirimkan informasi promosi
                                            (dengan persetujuan Anda)
                                        </li>
                                        <li>
                                            Meningkatkan layanan dan pengalaman
                                            berbelanja
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                        3. Keamanan Data
                                    </h2>
                                    <p className="leading-relaxed text-terra-600">
                                        Kami menerapkan langkah-langkah keamanan
                                        teknis dan organisasional untuk
                                        melindungi data pribadi Anda dari akses
                                        tidak sah, perubahan, pengungkapan, atau
                                        penghancuran. Data sensitif dienkripsi
                                        menggunakan teknologi SSL.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                        4. Berbagi Informasi
                                    </h2>
                                    <p className="leading-relaxed text-terra-600">
                                        Kami tidak menjual data pribadi Anda.
                                        Informasi hanya dibagikan kepada pihak
                                        ketiga yang diperlukan untuk memproses
                                        pesanan (jasa pengiriman, payment
                                        gateway) dengan standar keamanan yang
                                        ketat.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                        5. Hak Anda
                                    </h2>
                                    <p className="mb-4 leading-relaxed text-terra-600">
                                        Anda memiliki hak untuk:
                                    </p>
                                    <ul className="list-disc space-y-2 pl-6 text-terra-600">
                                        <li>
                                            Mengakses dan memperbarui informasi
                                            pribadi Anda
                                        </li>
                                        <li>Meminta penghapusan data Anda</li>
                                        <li>
                                            Berhenti berlangganan dari
                                            komunikasi pemasaran
                                        </li>
                                        <li>
                                            Mengajukan keluhan terkait privasi
                                            data
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                        6. Hubungi Kami
                                    </h2>
                                    <p className="leading-relaxed text-terra-600">
                                        Jika Anda memiliki pertanyaan tentang
                                        kebijakan privasi ini, silakan hubungi
                                        kami
                                        {siteSettings?.contact_email && (
                                            <>
                                                {' '}
                                                melalui email di{' '}
                                                <a
                                                    href={`mailto:${siteSettings.contact_email}`}
                                                    className="text-terra-700 underline"
                                                >
                                                    {siteSettings.contact_email}
                                                </a>
                                            </>
                                        )}
                                        {siteSettings?.contact_whatsapp && (
                                            <>
                                                {' '}
                                                atau melalui{' '}
                                                <a
                                                    href={`https://wa.me/${siteSettings.contact_whatsapp}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-terra-700 underline"
                                                >
                                                    WhatsApp
                                                </a>
                                            </>
                                        )}
                                        .
                                    </p>
                                </section>
                            </div>
                        </div>
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}
