import { SEOHead } from '@/components/seo';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
} from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Latif Living';
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    // Build contact info from settings
    const contactInfo = [
        {
            icon: MapPin,
            title: 'Alamat',
            lines: siteSettings?.address
                ? [siteSettings.address]
                : ['Alamat belum diatur'],
        },
        {
            icon: Phone,
            title: 'Telepon',
            lines: siteSettings?.contact_phone
                ? [siteSettings.contact_phone]
                : ['Telepon belum diatur'],
        },
        {
            icon: Mail,
            title: 'Email',
            lines: siteSettings?.contact_email
                ? [siteSettings.contact_email]
                : ['Email belum diatur'],
        },
        {
            icon: Clock,
            title: 'Jam Operasional',
            lines: ['Senin - Sabtu: 08:00 - 17:00', 'Minggu: 09:00 - 15:00'],
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            reset();
        }, 1500);
    };

    // Build SEO description from settings
    const seoDescription = `Hubungi ${siteSettings?.site_name || 'kami'} untuk pertanyaan, pemesanan, atau konsultasi furnitur.${siteSettings?.address ? ` Alamat: ${siteSettings.address}.` : ''}${siteSettings?.contact_phone ? ` Telepon: ${siteSettings.contact_phone}.` : ''}${siteSettings?.contact_email ? ` Email: ${siteSettings.contact_email}` : ''}`;

    return (
        <>
            <SEOHead
                title="Kontak Kami"
                description={seoDescription}
                keywords={[
                    'kontak',
                    'alamat toko furnitur',
                    'telepon',
                    'email',
                ]}
            />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pb-20">
                    {/* Hero */}
                    <div className="mb-16 bg-gradient-to-r from-teal-600 to-teal-700 py-16 text-white">
                        <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
                            <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                                Hubungi Kami
                            </h1>
                            <p className="text-xl opacity-90">
                                Kami siap membantu mewujudkan hunian impian Anda
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        <div className="grid gap-12 lg:grid-cols-3">
                            {/* Contact Info */}
                            <div className="lg:col-span-1">
                                <h2 className="mb-6 font-serif text-2xl text-terra-900">
                                    Informasi Kontak
                                </h2>
                                <div className="space-y-6">
                                    {contactInfo.map((info, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-teal-100">
                                                <info.icon
                                                    size={24}
                                                    className="text-teal-600"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="mb-1 font-medium text-terra-900">
                                                    {info.title}
                                                </h3>
                                                {info.lines.map((line, j) => (
                                                    <p
                                                        key={j}
                                                        className="text-sm text-terra-500"
                                                    >
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick Contact */}
                                {siteSettings?.contact_whatsapp && (
                                    <div className="mt-8 rounded-sm bg-teal-700 p-6 text-white">
                                        <h3 className="mb-3 font-medium">
                                            Butuh Respon Cepat?
                                        </h3>
                                        <p className="mb-4 text-sm opacity-80">
                                            Hubungi kami via WhatsApp untuk
                                            respon lebih cepat
                                        </p>
                                        <a
                                            href={`https://wa.me/${siteSettings.contact_whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex w-full items-center justify-center gap-2 rounded-sm bg-white py-3 font-medium text-teal-700 transition-colors hover:bg-teal-50"
                                        >
                                            <MessageCircle size={20} />
                                            <span>Chat WhatsApp</span>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <div className="rounded-sm border border-terra-100 bg-white p-8">
                                    <h2 className="mb-6 font-serif text-2xl text-terra-900">
                                        Kirim Pesan
                                    </h2>

                                    {isSuccess ? (
                                        <div className="py-12 text-center">
                                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
                                                <CheckCircle
                                                    size={40}
                                                    className="text-teal-600"
                                                />
                                            </div>
                                            <h3 className="mb-2 text-xl font-medium text-terra-900">
                                                Pesan Terkirim!
                                            </h3>
                                            <p className="mb-6 text-terra-500">
                                                Tim kami akan menghubungi Anda
                                                segera.
                                            </p>
                                            <button
                                                onClick={() =>
                                                    setIsSuccess(false)
                                                }
                                                className="text-wood hover:text-wood-dark"
                                            >
                                                Kirim pesan lagi
                                            </button>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-terra-700">
                                                        Nama Lengkap *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                                                        placeholder="Nama Anda"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-terra-700">
                                                        Email *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={data.email}
                                                        onChange={(e) =>
                                                            setData(
                                                                'email',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-sm border border-neutral-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                                        placeholder="email@example.com"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-terra-700">
                                                        No. Telepon
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={data.phone}
                                                        onChange={(e) =>
                                                            setData(
                                                                'phone',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                                                        placeholder="08xxxxxxxxxx"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-terra-700">
                                                        Subjek *
                                                    </label>
                                                    <select
                                                        required
                                                        value={data.subject}
                                                        onChange={(e) =>
                                                            setData(
                                                                'subject',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-sm border border-terra-200 bg-white px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                                                    >
                                                        <option value="">
                                                            Pilih subjek
                                                        </option>
                                                        <option value="inquiry">
                                                            Pertanyaan Produk
                                                        </option>
                                                        <option value="order">
                                                            Status Pesanan
                                                        </option>
                                                        <option value="custom">
                                                            Custom Order
                                                        </option>
                                                        <option value="complaint">
                                                            Komplain
                                                        </option>
                                                        <option value="partnership">
                                                            Kerjasama
                                                        </option>
                                                        <option value="other">
                                                            Lainnya
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                                    Pesan *
                                                </label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={data.message}
                                                    onChange={(e) =>
                                                        setData(
                                                            'message',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full resize-none rounded-sm border border-neutral-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                                    placeholder="Tuliskan pesan Anda..."
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex w-full items-center justify-center gap-2 rounded-sm bg-teal-600 py-4 font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="animate-spin">
                                                            ⏳
                                                        </span>{' '}
                                                        Mengirim...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send size={20} /> Kirim
                                                        Pesan
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="mt-16">
                            <h2 className="mb-6 font-serif text-2xl text-terra-900">
                                Lokasi Kami
                            </h2>
                            <div className="aspect-[21/9] overflow-hidden rounded-sm bg-terra-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126646.19650689476!2d110.5944!3d-6.5877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e711ef138b2f51d%3A0x40dfe5e29e55df0!2sJepara%2C%20Jepara%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1699999999999!5m2!1sen!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`Lokasi ${siteName}`}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}
