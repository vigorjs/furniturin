import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

export const NewsletterSection = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/shop/newsletter/subscribe', {
            preserveScroll: true,
            onSuccess: () => {
                setIsSuccess(true);
                setMessage('Terima kasih telah berlangganan! Anda akan menerima update terbaru dari kami.');
                reset();
                // Reset success message after 5 seconds
                setTimeout(() => {
                    setIsSuccess(false);
                    setMessage('');
                }, 5000);
            },
            onError: (errors) => {
                if (errors.email) {
                    setMessage(errors.email);
                }
            },
        });
    };

    return (
        <section className="py-24 px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto">
                <div className="bg-sand-100 rounded-[40px] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <h2 className="font-serif text-5xl text-terra-900">Bergabung dengan Keluarga Latif</h2>
                        <p className="text-terra-600 mt-4 text-lg">Dapatkan akses eksklusif ke koleksi terbaru, tips dekorasi, dan penawaran khusus.</p>
                    </div>
                    <div className="w-full md:w-auto">
                        {isSuccess ? (
                            <div className="flex items-center gap-3 bg-green-50 text-green-700 px-6 py-4 rounded-full">
                                <CheckCircle size={24} />
                                <span className="font-medium">{message}</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-terra-400" size={20} />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Alamat email Anda"
                                            className={`w-full sm:w-80 pl-12 pr-4 py-4 rounded-full border ${
                                                errors.email ? 'border-red-500' : 'border-terra-200'
                                            } focus:outline-none focus:border-wood transition-colors`}
                                            disabled={processing}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-terra-900 text-white px-8 py-4 rounded-full font-medium hover:bg-wood transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            'Berlangganan'
                                        )}
                                    </button>
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-2 ml-4">{errors.email}</p>
                                )}
                                {message && !isSuccess && (
                                    <p className="text-red-500 text-sm mt-2 ml-4">{message}</p>
                                )}
                                <p className="text-terra-400 text-xs mt-4 text-center sm:text-left">Dengan berlangganan, Anda menyetujui kebijakan privasi kami.</p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;

