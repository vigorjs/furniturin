export const Footer = () => (
    <footer className="bg-terra-900 text-sand-200 py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16">
                <div className="md:col-span-5">
                    <h3 className="font-serif text-4xl text-white mb-6">Latif Living.</h3>
                    <p className="text-lg text-terra-400 font-light leading-relaxed max-w-md">
                        Furniture berkualitas tinggi untuk hunian modern. Kami percaya pada furniture yang bercerita—cerita Anda.
                    </p>
                </div>
                <div className="md:col-span-2 md:col-start-7">
                    <h4 className="font-medium text-white mb-6 tracking-wide">Belanja</h4>
                    <ul className="space-y-4 text-sm text-terra-400">
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Produk Baru</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Terlaris</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Ruang Tamu</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Pencahayaan</li>
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h4 className="font-medium text-white mb-6 tracking-wide">Perusahaan</h4>
                    <ul className="space-y-4 text-sm text-terra-400">
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Tentang Kami</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Keberlanjutan</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Karir</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Kontak</li>
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h4 className="font-medium text-white mb-6 tracking-wide">Bantuan</h4>
                    <ul className="space-y-4 text-sm text-terra-400">
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Pengiriman</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">Pengembalian</li>
                        <li className="hover:text-wood-light cursor-pointer transition-colors">FAQ</li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-xs text-terra-500">
                <p>&copy; 2025 Latif Living. Hak cipta dilindungi.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <span className="cursor-pointer hover:text-terra-300">Kebijakan Privasi</span>
                    <span className="cursor-pointer hover:text-terra-300">Syarat & Ketentuan</span>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;

