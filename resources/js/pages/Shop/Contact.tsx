import { router, useForm } from '@inertiajs/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Header, Footer, WhatsAppButton } from '@/components/shop';
import { SEOHead } from '@/components/seo';

const CONTACT_INFO = [
    { icon: MapPin, title: 'Alamat', lines: ['Jl. Furniture Indah No. 123', 'Jepara, Jawa Tengah 59411'] },
    { icon: Phone, title: 'Telepon', lines: ['+62 812-3456-7890', '+62 291-123-4567'] },
    { icon: Mail, title: 'Email', lines: ['hello@latifliving.com', 'support@latifliving.com'] },
    { icon: Clock, title: 'Jam Operasional', lines: ['Senin - Sabtu: 08:00 - 17:00', 'Minggu: 09:00 - 15:00'] },
];

export default function Contact() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            reset();
        }, 1500);
    };

    return (
        <>
            <SEOHead
                title="Kontak Kami"
                description="Hubungi Latif Living untuk pertanyaan, pemesanan, atau konsultasi furnitur. Alamat: Jl. Furniture Indah No. 123, Jepara. Telepon: +62 812-3456-7890. Email: hello@latifliving.com"
                keywords={['kontak latif living', 'alamat toko furnitur', 'telepon latif living', 'email latif living']}
            />
            <div className="bg-noise" />
            <Header cartCount={0} onCartClick={() => {}} onLogoClick={() => router.visit('/shop')} />

            <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                {/* Hero */}
                <div className="bg-gradient-to-r from-wood-dark to-terra-800 text-white py-16 mb-16">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
                        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
                        <p className="text-xl opacity-90">Kami siap membantu mewujudkan hunian impian Anda</p>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <h2 className="font-serif text-2xl text-terra-900 mb-6">Informasi Kontak</h2>
                            <div className="space-y-6">
                                {CONTACT_INFO.map((info, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-12 h-12 bg-wood/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <info.icon size={24} className="text-wood-dark" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-terra-900 mb-1">{info.title}</h3>
                                            {info.lines.map((line, j) => (
                                                <p key={j} className="text-sm text-terra-500">{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Contact */}
                            <div className="mt-8 p-6 bg-terra-900 rounded-2xl text-white">
                                <h3 className="font-medium mb-3">Butuh Respon Cepat?</h3>
                                <p className="text-sm opacity-80 mb-4">Hubungi kami via WhatsApp untuk respon lebih cepat</p>
                                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-wood hover:bg-wood-dark w-full py-3 rounded-xl transition-colors">
                                    <MessageCircle size={20} />
                                    <span>Chat WhatsApp</span>
                                </a>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-8 border border-terra-100">
                                <h2 className="font-serif text-2xl text-terra-900 mb-6">Kirim Pesan</h2>

                                {isSuccess ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-wood/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle size={40} className="text-wood-dark" />
                                        </div>
                                        <h3 className="text-xl font-medium text-terra-900 mb-2">Pesan Terkirim!</h3>
                                        <p className="text-terra-500 mb-6">Tim kami akan menghubungi Anda segera.</p>
                                        <button onClick={() => setIsSuccess(false)} className="text-wood hover:text-wood-dark">
                                            Kirim pesan lagi
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-terra-700 mb-2">Nama Lengkap *</label>
                                                <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none" placeholder="Nama Anda" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-terra-700 mb-2">Email *</label>
                                                <input type="email" required value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none" placeholder="email@example.com" />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-terra-700 mb-2">No. Telepon</label>
                                                <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none" placeholder="08xxxxxxxxxx" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-terra-700 mb-2">Subjek *</label>
                                                <select required value={data.subject} onChange={e => setData('subject', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none bg-white">
                                                    <option value="">Pilih subjek</option>
                                                    <option value="inquiry">Pertanyaan Produk</option>
                                                    <option value="order">Status Pesanan</option>
                                                    <option value="custom">Custom Order</option>
                                                    <option value="complaint">Komplain</option>
                                                    <option value="partnership">Kerjasama</option>
                                                    <option value="other">Lainnya</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-terra-700 mb-2">Pesan *</label>
                                            <textarea required rows={5} value={data.message} onChange={e => setData('message', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none resize-none" placeholder="Tuliskan pesan Anda..." />
                                        </div>
                                        <button type="submit" disabled={isSubmitting} className="w-full bg-terra-900 text-white py-4 rounded-xl font-medium hover:bg-wood-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                            {isSubmitting ? (<><span className="animate-spin">⏳</span> Mengirim...</>) : (<><Send size={20} /> Kirim Pesan</>)}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="mt-16">
                        <h2 className="font-serif text-2xl text-terra-900 mb-6">Lokasi Kami</h2>
                        <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-terra-200">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126646.19650689476!2d110.5944!3d-6.5877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e711ef138b2f51d%3A0x40dfe5e29e55df0!2sJepara%2C%20Jepara%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1699999999999!5m2!1sen!2sid" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Lokasi Latif Living"></iframe>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <WhatsAppButton phoneNumber="6281234567890" message="Halo, saya ingin bertanya tentang produk Latif Living" />
        </>
    );
}

