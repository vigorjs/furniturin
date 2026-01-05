import { Product } from '@/types/shop';

// Placeholder image untuk produk tanpa gambar
const PLACEHOLDER_PRODUCT = '/images/placeholder-product.svg';

// Data produk furniture Indonesia - akan diganti dengan API nanti
export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Kursi Santai Kayu Jati',
        category: 'Kursi',
        price: 4500000,
        rating: 4.8,
        description:
            'Kursi santai dengan desain modern menggunakan kayu jati pilihan. Dilengkapi dengan bantalan kulit premium untuk kenyamanan maksimal.',
        features: ['Kulit Premium', 'Kayu Jati Solid', 'Ergonomis'],
        image: PLACEHOLDER_PRODUCT,
    },
    {
        id: '2',
        name: 'Sofa Minimalis 3 Dudukan',
        category: 'Ruang Tamu',
        price: 12000000,
        rating: 4.9,
        description:
            'Sofa minimalis dengan desain elegan, menggunakan kain premium anti noda. Cocok untuk ruang tamu modern.',
        features: ['Kaki Kayu Oak', 'Kain Anti Noda', 'Busa High Density'],
        image: PLACEHOLDER_PRODUCT,
    },
    {
        id: '3',
        name: 'Meja Makan Kayu Jati',
        category: 'Ruang Makan',
        price: 8900000,
        rating: 4.7,
        description:
            'Meja makan dari kayu jati solid dengan finishing natural. Dapat menampung 6-8 orang dengan nyaman.',
        features: [
            'Kayu Jati Solid',
            'Finishing Natural',
            'Dapat Diperpanjang',
        ],
        image: PLACEHOLDER_PRODUCT,
    },
    {
        id: '4',
        name: 'Lampu Lantai Kuningan',
        category: 'Pencahayaan',
        price: 2200000,
        rating: 4.6,
        description:
            'Lampu lantai dengan finishing kuningan antik. Memberikan pencahayaan hangat dan elegan untuk setiap sudut ruangan.',
        features: ['Kuningan Antik', 'LED Dimmable', 'Dasar Berat'],
        image: PLACEHOLDER_PRODUCT,
    },
    {
        id: '5',
        name: 'Set Vas Keramik Artisan',
        category: 'Dekorasi',
        price: 850000,
        rating: 4.9,
        description:
            'Set vas keramik buatan tangan dengan finishing matte. Cocok untuk bunga kering atau sebagai dekorasi standalone.',
        features: ['Buatan Tangan', 'Finishing Matte', 'Set 3 Pcs'],
        image: PLACEHOLDER_PRODUCT,
    },
    {
        id: '6',
        name: 'Karpet Wol Handmade',
        category: 'Tekstil',
        price: 3400000,
        rating: 4.5,
        description:
            'Karpet tenun tangan dari 100% wol New Zealand. Pola geometris netral yang cocok untuk berbagai gaya interior.',
        features: ['100% Wol', 'Tenun Tangan', 'Pewarna Ramah Lingkungan'],
        image: PLACEHOLDER_PRODUCT,
    },
];

// Format harga ke Rupiah
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

// Kategori untuk navigation
export const CATEGORIES = [
    { id: '1', name: 'Ruang Tamu', slug: 'ruang-tamu' },
    { id: '2', name: 'Ruang Makan', slug: 'ruang-makan' },
    { id: '3', name: 'Kamar Tidur', slug: 'kamar-tidur' },
    { id: '4', name: 'Pencahayaan', slug: 'pencahayaan' },
    { id: '5', name: 'Dekorasi', slug: 'dekorasi' },
];

// Testimonials
export const TESTIMONIALS = [
    {
        id: '1',
        text: 'Kualitas kursi santainya luar biasa. Sudah mengubah sudut baca saya menjadi tempat favorit di rumah.',
        author: 'Siti Rahayu',
        location: 'Jakarta',
    },
    {
        id: '2',
        text: 'Awalnya ragu beli furniture online, tapi Latif Living memberikan pelayanan terbaik. Sangat puas dengan sofa yang saya beli.',
        author: 'Budi Santoso',
        location: 'Surabaya',
    },
    {
        id: '3',
        text: 'Minimalis, fungsional, dan sangat indah. Finishing kayunya bahkan lebih bagus dari yang terlihat di foto.',
        author: 'Dewi Lestari',
        location: 'Bandung',
    },
];

// Navigation menu items
export const NAV_ITEMS = [
    { label: 'Koleksi', href: '/shop/products' },
    { label: 'Kategori', href: '/shop/categories' },
    { label: 'Hot Sale', href: '/shop/hot-sale' },
    { label: 'Clearance', href: '/shop/clearance' },
    { label: 'Tentang Kami', href: '/shop/about' },
    { label: 'Kontak', href: '/shop/contact' },
];
