import { router, useForm } from '@inertiajs/react';
import { Palette, Ruler, Upload, Send, CheckCircle, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { Header, Footer, WhatsAppButton } from '@/components/shop';
import { SEOHead } from '@/components/seo';

const FURNITURE_TYPES = [
    'Kursi', 'Meja', 'Lemari', 'Sofa', 'Rak', 'Tempat Tidur', 'Meja TV', 'Nakas', 'Lainnya'
];

const MATERIALS = [
    { id: 'kayu-jati', name: 'Kayu Jati', description: 'Kuat dan tahan lama' },
    { id: 'kayu-mahoni', name: 'Kayu Mahoni', description: 'Elegan dan berkelas' },
    { id: 'kayu-pinus', name: 'Kayu Pinus', description: 'Ringan dan ekonomis' },
    { id: 'multipleks', name: 'Multipleks/Plywood', description: 'Modern dan praktis' },
    { id: 'rotan', name: 'Rotan', description: 'Natural dan artistik' },
    { id: 'kombinasi', name: 'Kombinasi', description: 'Mix material' },
];

export default function CustomOrder() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { data, setData, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        furniture_type: '',
        material: '',
        width: '',
        height: '',
        depth: '',
        color: '',
        description: '',
        budget: '',
        images: [] as File[],
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + previewImages.length > 5) {
            alert('Maksimal 5 gambar');
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);
        setData('images', [...data.images, ...files]);
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(previewImages[index]);
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setData('images', data.images.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate submission - in production, this would be a real API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            reset();
            setPreviewImages([]);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <>
                <SEOHead
                    title="Custom Order Berhasil"
                    description="Permintaan custom order Anda telah terkirim. Tim Latif Living akan menghubungi Anda dalam 1-2 hari kerja."
                />
                <div className="bg-noise" />
                <Header cartCount={0} onCartClick={() => {}} onLogoClick={() => router.visit('/shop')} />
                <main className="min-h-screen bg-sand-50 pt-28 pb-20 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto px-6">
                        <div className="w-24 h-24 bg-wood/20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle size={48} className="text-wood-dark" />
                        </div>
                        <h1 className="font-serif text-3xl text-terra-900 mb-4">Permintaan Terkirim!</h1>
                        <p className="text-terra-600 mb-8">
                            Terima kasih! Tim kami akan menghubungi Anda dalam 1-2 hari kerja untuk konsultasi lebih lanjut.
                        </p>
                        <button onClick={() => setIsSuccess(false)} className="bg-terra-900 text-white px-8 py-3 rounded-full hover:bg-wood-dark transition-colors">
                            Buat Permintaan Lagi
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <SEOHead
                title="Custom Order - Pesan Furnitur Sesuai Keinginan"
                description="Pesan furnitur custom sesuai keinginan Anda di Latif Living. Pilih material, ukuran, dan desain. Konsultasi gratis dengan tim ahli kami."
                keywords={['custom order', 'furnitur custom', 'pesan mebel', 'furniture custom jepara', 'desain furnitur']}
            />
            <div className="bg-noise" />
            <Header cartCount={0} onCartClick={() => {}} onLogoClick={() => router.visit('/shop')} />

            <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-wood-dark to-terra-800 text-white py-16 mb-12">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Palette size={40} className="text-wood-light" />
                            <h1 className="font-serif text-4xl md:text-5xl font-bold">CUSTOM ORDER</h1>
                            <Ruler size={40} className="text-wood-light" />
                        </div>
                        <p className="text-xl opacity-90">Wujudkan Furniture Impian Anda</p>
                        <p className="text-sm mt-2 opacity-75">Desain sesuai kebutuhan, material pilihan, ukuran presisi</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    {/* Info Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-2xl p-6 border border-terra-100 text-center">
                            <div className="w-12 h-12 bg-wood/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Palette size={24} className="text-wood-dark" />
                            </div>
                            <h3 className="font-medium text-terra-900 mb-2">Desain Bebas</h3>
                            <p className="text-sm text-terra-500">Upload referensi atau gambarkan ide Anda</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-terra-100 text-center">
                            <div className="w-12 h-12 bg-wood/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Ruler size={24} className="text-wood-dark" />
                            </div>
                            <h3 className="font-medium text-terra-900 mb-2">Ukuran Presisi</h3>
                            <p className="text-sm text-terra-500">Sesuaikan dengan ruangan Anda</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-terra-100 text-center">
                            <div className="w-12 h-12 bg-wood/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={24} className="text-wood-dark" />
                            </div>
                            <h3 className="font-medium text-terra-900 mb-2">Garansi Kualitas</h3>
                            <p className="text-sm text-terra-500">Material premium, hasil sempurna</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-terra-100">
                        <h2 className="font-serif text-2xl text-terra-900 mb-6">Form Permintaan Custom</h2>

                        {/* Contact Info */}
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Nama Lengkap *</label>
                                <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none" placeholder="Nama Anda" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Email *</label>
                                <input type="email" required value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none" placeholder="email@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">No. WhatsApp *</label>
                                <input type="tel" required value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none" placeholder="08xxxxxxxxxx" />
                            </div>
                        </div>

                        {/* Product Type & Material */}
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Jenis Furniture *</label>
                                <select required value={data.furniture_type} onChange={e => setData('furniture_type', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none bg-white">
                                    <option value="">Pilih jenis furniture</option>
                                    {FURNITURE_TYPES.map(type => (<option key={type} value={type}>{type}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Material *</label>
                                <select required value={data.material} onChange={e => setData('material', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none bg-white">
                                    <option value="">Pilih material</option>
                                    {MATERIALS.map(m => (<option key={m.id} value={m.id}>{m.name} - {m.description}</option>))}
                                </select>
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-terra-700 mb-2">Ukuran (cm) - Opsional</label>
                            <div className="grid grid-cols-3 gap-4">
                                <input type="number" value={data.width} onChange={e => setData('width', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none" placeholder="Lebar" />
                                <input type="number" value={data.height} onChange={e => setData('height', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none" placeholder="Tinggi" />
                                <input type="number" value={data.depth} onChange={e => setData('depth', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none" placeholder="Kedalaman" />
                            </div>
                        </div>

                        {/* Color & Budget */}
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Warna/Finishing</label>
                                <input type="text" value={data.color} onChange={e => setData('color', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none" placeholder="Contoh: Natural, Walnut, Putih" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-terra-700 mb-2">Estimasi Budget</label>
                                <input type="text" value={data.budget} onChange={e => setData('budget', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none" placeholder="Contoh: 5-10 juta" />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-terra-700 mb-2">Deskripsi Detail *</label>
                            <textarea required rows={4} value={data.description} onChange={e => setData('description', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-terra-200 focus:border-wood focus:ring-1 focus:ring-wood outline-none resize-none" placeholder="Jelaskan detail furniture yang Anda inginkan..." />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-terra-700 mb-2">Upload Referensi Gambar (Maks. 5)</label>
                            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                            <div className="flex flex-wrap gap-4">
                                {previewImages.map((src, idx) => (
                                    <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-terra-200">
                                        <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-6 h-6 bg-terra-900/80 rounded-full flex items-center justify-center text-white hover:bg-terra-900">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {previewImages.length < 5 && (
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-xl border-2 border-dashed border-terra-300 flex flex-col items-center justify-center text-terra-400 hover:border-wood hover:text-wood transition-colors">
                                        <Upload size={24} />
                                        <span className="text-xs mt-1">Upload</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={isSubmitting} className="w-full bg-terra-900 text-white py-4 rounded-xl font-medium hover:bg-wood-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                            {isSubmitting ? (<><span className="animate-spin">⏳</span> Mengirim...</>) : (<><Send size={20} /> Kirim Permintaan</>)}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
            <WhatsAppButton phoneNumber="6281234567890" message="Halo, saya ingin konsultasi custom order furniture" />
        </>
    );
}

