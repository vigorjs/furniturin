import ShopLayout from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Terms() {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Latif Living';

    return (
        <>
            <Head title={`Syarat & Ketentuan - ${siteName}`} />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                    <div className="max-w-4xl mx-auto px-6 md:px-12">
                        <div className="bg-white rounded-sm p-8 md:p-12 shadow-sm border border-terra-100">
                            <h1 className="font-serif text-4xl text-terra-900 mb-8">Syarat & Ketentuan</h1>
                            <p className="text-terra-500 text-sm mb-8">Terakhir diperbarui: Desember 2025</p>

                            <div className="prose prose-terra max-w-none space-y-8">
                                <section>
                                    <h2 className="font-serif text-2xl text-terra-900 mb-4">1. Ketentuan Umum</h2>
                                    <p className="text-terra-600 leading-relaxed">
                                        Dengan mengakses dan menggunakan website {siteName}, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak setuju dengan ketentuan ini, mohon untuk tidak menggunakan layanan kami.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="font-serif text-2xl text-terra-900 mb-4">2. Pemesanan & Pembayaran</h2>
                                    <ul className="list-disc pl-6 text-terra-600 space-y-2">
                                        <li>Harga produk dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu</li>
                                        <li>Pesanan dianggap sah setelah pembayaran dikonfirmasi</li>
                                        <li>Pembayaran harus dilakukan dalam waktu 24 jam setelah pemesanan untuk Transfer Bank</li>
                                        <li>Kami berhak membatalkan pesanan jika pembayaran tidak diterima dalam waktu yang ditentukan</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="font-serif text-2xl text-terra-900 mb-4">3. Pengiriman</h2>
                                    <ul className="list-disc pl-6 text-terra-600 space-y-2">
                                        <li>Waktu pengiriman adalah estimasi dan dapat berbeda tergantung kondisi</li>
                                        <li>Pembeli bertanggung jawab memastikan alamat pengiriman yang benar</li>
                                        <li>Kerusakan akibat pengiriman harus dilaporkan dalam 24 jam setelah penerimaan</li>
                                        <li>Biaya pengiriman ulang akibat alamat salah ditanggung pembeli</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="font-serif text-2xl text-terra-900 mb-4">4. Garansi Produk</h2>
                                    <p className="text-terra-600 leading-relaxed mb-4">
                                        Semua produk {siteName} bergaransi 1 tahun untuk kerusakan struktural akibat cacat produksi. Garansi tidak berlaku untuk:
                                    </p>
                                    <ul className="list-disc pl-6 text-terra-600 space-y-2">
                                        <li>Kerusakan akibat pemakaian tidak wajar</li>
                                        <li>Kerusakan akibat modifikasi oleh pihak ketiga</li>
                                        <li>Perubahan warna alami pada material kayu</li>
                                        <li>Keausan normal akibat pemakaian sehari-hari</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="font-serif text-2xl text-terra-900 mb-4">5. Pembatalan & Pengembalian</h2>
                                    <ul className="list-disc pl-6 text-terra-600 space-y-2">
                                        <li>Pembatalan dapat dilakukan sebelum pesanan diproses dengan potongan 10% biaya admin</li>
                                        <li>Custom order tidak dapat dibatalkan setelah produksi dimulai</li>
                                        <li>Pengembalian produk harus dalam kondisi asli dan kemasan lengkap</li>
                                        <li>Refund akan diproses dalam 7-14 hari kerja setelah produk diterima kembali</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="font-serif text-2xl text-terra-900 mb-4">6. Hak Kekayaan Intelektual</h2>
                                    <p className="text-terra-600 leading-relaxed">
                                        Seluruh konten di website ini termasuk gambar, desain, logo, dan teks adalah milik {siteName} dan dilindungi hak cipta. Dilarang menyalin atau menggunakan tanpa izin tertulis.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="font-serif text-2xl text-terra-900 mb-4">7. Perubahan Ketentuan</h2>
                                    <p className="text-terra-600 leading-relaxed">
                                        Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku segera setelah dipublikasikan di website. Penggunaan berkelanjutan atas layanan kami dianggap sebagai persetujuan atas perubahan tersebut.
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

