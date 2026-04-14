import { Combobox } from '@/components/ui/combobox';
import AdminLayout from '@/layouts/admin/admin-layout';
import { compressImage } from '@/utils/image-compress';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Globe,
    Loader2,
    Plus,
    Star,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface StatusOption {
    value: string;
    name: string;
}

interface SaleTypeOption {
    value: string;
    name: string;
}

interface CreateProductProps {
    categories: Category[];
    statuses: StatusOption[];
    saleTypes: SaleTypeOption[];
}

export default function CreateProduct({
    categories,
    statuses,
    saleTypes,
}: CreateProductProps) {
    const [previewImages, setPreviewImages] = useState<
        { file: File; preview: string }[]
    >([]);
    const [primaryIndex, setPrimaryIndex] = useState(0);
    const [isCompressing, setIsCompressing] = useState(false);
    const [specifications, setSpecifications] = useState<
        { key: string; value: string }[]
    >([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, processing, errors } = useForm({
        name: '',
        sku: '',
        category_id: '',
        short_description: '',
        description: '',
        price: '',
        compare_price: '',
        cost_price: '',
        stock_quantity: '',
        low_stock_threshold: '5',
        track_stock: true,
        allow_backorder: false,
        is_pre_order: false,
        weight: '',
        length: '',
        width: '',
        height: '',
        shipping_class: '',
        material: '',
        color: '',
        status: 'active',
        sale_type: 'regular',
        is_featured: false,
        is_new_arrival: false,
        discount_percentage: '',
        discount_starts_at: '',
        discount_ends_at: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
    });

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;
        if (!files) return;

        setIsCompressing(true);
        try {
            const fileArray = Array.from(files);
            const compressedImages = await Promise.all(
                fileArray.map(async (file) => {
                    const compressedFile = await compressImage(file, {
                        maxSizeMB: 2,
                    });
                    return {
                        file: compressedFile,
                        preview: URL.createObjectURL(compressedFile),
                    };
                }),
            );
            setPreviewImages((prev) => [...prev, ...compressedImages]);
        } catch (error) {
            console.error('Error compressing images:', error);
        } finally {
            setIsCompressing(false);
        }
    };

    const removeImage = (index: number) => {
        setPreviewImages((prev) => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
        if (primaryIndex === index) {
            setPrimaryIndex(0);
        } else if (primaryIndex > index) {
            setPrimaryIndex(primaryIndex - 1);
        }
    };

    const addSpecification = () => {
        setSpecifications((prev) => [...prev, { key: '', value: '' }]);
    };

    const removeSpecification = (index: number) => {
        setSpecifications((prev) => prev.filter((_, i) => i !== index));
    };

    const updateSpecification = (
        index: number,
        field: 'key' | 'value',
        value: string,
    ) => {
        setSpecifications((prev) =>
            prev.map((spec, i) =>
                i === index ? { ...spec, [field]: value } : spec,
            ),
        );
    };

    const marginPercentage =
        data.price && data.cost_price
            ? (
                  ((Number(data.price) - Number(data.cost_price)) /
                      Number(data.price)) *
                  100
              ).toFixed(1)
            : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('sku', data.sku);
        formData.append('category_id', data.category_id);
        formData.append('short_description', data.short_description);
        formData.append('description', data.description);
        formData.append('price', data.price);
        if (data.compare_price)
            formData.append('compare_price', data.compare_price);
        if (data.cost_price) formData.append('cost_price', data.cost_price);
        formData.append('stock_quantity', data.stock_quantity);
        formData.append('low_stock_threshold', data.low_stock_threshold);
        formData.append('track_stock', data.track_stock ? '1' : '0');
        formData.append('allow_backorder', data.allow_backorder ? '1' : '0');
        formData.append('is_pre_order', data.is_pre_order ? '1' : '0');
        if (data.weight) formData.append('weight', data.weight);
        if (data.length) formData.append('length', data.length);
        if (data.width) formData.append('width', data.width);
        if (data.height) formData.append('height', data.height);
        if (data.shipping_class)
            formData.append('shipping_class', data.shipping_class);
        if (data.material) formData.append('material', data.material);
        if (data.color) formData.append('color', data.color);

        // Build specifications object
        const specsObj: Record<string, string> = {};
        specifications.forEach((spec) => {
            if (spec.key.trim() && spec.value.trim()) {
                specsObj[spec.key.trim()] = spec.value.trim();
            }
        });
        if (Object.keys(specsObj).length > 0) {
            formData.append('specifications', JSON.stringify(specsObj));
        }

        formData.append('status', data.status);
        formData.append('sale_type', data.sale_type);
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('is_new_arrival', data.is_new_arrival ? '1' : '0');
        if (data.discount_percentage)
            formData.append('discount_percentage', data.discount_percentage);
        if (data.discount_starts_at)
            formData.append('discount_starts_at', data.discount_starts_at);
        if (data.discount_ends_at)
            formData.append('discount_ends_at', data.discount_ends_at);
        if (data.meta_title) formData.append('meta_title', data.meta_title);
        if (data.meta_description)
            formData.append('meta_description', data.meta_description);
        if (data.meta_keywords)
            formData.append('meta_keywords', data.meta_keywords);

        previewImages.forEach((img) => {
            formData.append('images[]', img.file);
        });

        router.post('/admin/products', formData, {
            forceFormData: true,
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
        });
    };

    const inputClass =
        'w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none';
    const labelClass = 'mb-2 block text-sm font-medium text-terra-700';

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Produk', href: '/admin/products' },
                { title: 'Tambah Produk', href: '/admin/products/create' },
            ]}
        >
            <Head title="Tambah Produk" />

            <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="rounded-lg p-2 text-terra-600 transition-colors hover:bg-terra-100"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">
                            Tambah Produk Baru
                        </h1>
                        <p className="mt-1 text-terra-500">
                            Isi detail produk di bawah ini
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Informasi Umum */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Informasi Umum
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Nama Produk *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Masukkan nama produk"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>SKU *</label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) =>
                                        setData('sku', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="KRS-001"
                                />
                                {errors.sku && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.sku}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Kategori *
                                </label>
                                <Combobox
                                    options={categories.map((cat) => ({
                                        value: String(cat.id),
                                        label: cat.name,
                                    }))}
                                    value={data.category_id}
                                    onChange={(val) =>
                                        setData('category_id', val)
                                    }
                                    placeholder="Pilih kategori"
                                    searchPlaceholder="Cari kategori..."
                                    emptyText="Kategori tidak ditemukan."
                                />
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Deskripsi Singkat
                                </label>
                                <textarea
                                    value={data.short_description}
                                    onChange={(e) =>
                                        setData(
                                            'short_description',
                                            e.target.value.slice(0, 500),
                                        )
                                    }
                                    rows={2}
                                    className={inputClass + ' resize-none'}
                                    placeholder="Ringkasan singkat tentang produk..."
                                />
                                <p className="mt-1 text-right text-xs text-terra-400">
                                    {data.short_description.length}/500
                                </p>
                                {errors.short_description && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.short_description}
                                    </p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Deskripsi Lengkap
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={5}
                                    className={inputClass + ' resize-none'}
                                    placeholder="Deskripsi lengkap produk..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Harga */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Harga
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label className={labelClass}>
                                    Harga Jual *
                                </label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-terra-400">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        className={inputClass + ' pl-10'}
                                        placeholder="0"
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Harga Coret
                                </label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-terra-400">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        value={data.compare_price}
                                        onChange={(e) =>
                                            setData(
                                                'compare_price',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass + ' pl-10'}
                                        placeholder="0"
                                    />
                                </div>
                                {errors.compare_price && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.compare_price}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Harga Modal
                                </label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-terra-400">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        value={data.cost_price}
                                        onChange={(e) =>
                                            setData(
                                                'cost_price',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass + ' pl-10'}
                                        placeholder="0"
                                    />
                                </div>
                                {marginPercentage && (
                                    <p className="mt-1 text-xs text-terra-500">
                                        Margin:{' '}
                                        <span
                                            className={
                                                Number(marginPercentage) > 0
                                                    ? 'text-green-600'
                                                    : 'text-red-500'
                                            }
                                        >
                                            {marginPercentage}%
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Inventori */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Inventori
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label className={labelClass}>
                                    Jumlah Stok *
                                </label>
                                <input
                                    type="number"
                                    value={data.stock_quantity}
                                    onChange={(e) =>
                                        setData(
                                            'stock_quantity',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    placeholder="0"
                                />
                                {errors.stock_quantity && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.stock_quantity}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Batas Stok Rendah
                                </label>
                                <input
                                    type="number"
                                    value={data.low_stock_threshold}
                                    onChange={(e) =>
                                        setData(
                                            'low_stock_threshold',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    placeholder="5"
                                />
                            </div>
                            <div className="flex flex-col justify-end gap-3">
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.track_stock}
                                        onChange={(e) =>
                                            setData(
                                                'track_stock',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-5 w-5 rounded border-terra-300 text-terra-900 focus:ring-wood"
                                    />
                                    <span className="text-sm text-terra-700">
                                        Lacak Stok
                                    </span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.allow_backorder}
                                        onChange={(e) =>
                                            setData(
                                                'allow_backorder',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-5 w-5 rounded border-terra-300 text-terra-900 focus:ring-wood"
                                    />
                                    <span className="text-sm text-terra-700">
                                        Izinkan Backorder
                                    </span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.is_pre_order}
                                        onChange={(e) =>
                                            setData(
                                                'is_pre_order',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-5 w-5 rounded border-terra-300 text-terra-900 focus:ring-wood"
                                    />
                                    <span className="text-sm text-terra-700">
                                        Produk Pre-Order
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 4. Pengiriman */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Pengiriman
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Berat (kg)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.weight}
                                    onChange={(e) =>
                                        setData('weight', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Kelas Pengiriman
                                </label>
                                <Combobox
                                    options={[
                                        { value: 'free_shipping', label: 'Gratis Ongkir' },
                                        { value: 'flat_rate', label: 'Tarif Tetap' },
                                        { value: 'local_pickup', label: 'Ambil di Tempat' },
                                    ]}
                                    value={data.shipping_class}
                                    onChange={(val) =>
                                        setData('shipping_class', val)
                                    }
                                    placeholder="Tidak ada"
                                    searchPlaceholder="Cari kelas pengiriman..."
                                    emptyText="Tidak ditemukan."
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Dimensi (cm)
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.length}
                                            onChange={(e) =>
                                                setData(
                                                    'length',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="Panjang"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.width}
                                            onChange={(e) =>
                                                setData(
                                                    'width',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="Lebar"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.height}
                                            onChange={(e) =>
                                                setData(
                                                    'height',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="Tinggi"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Atribut */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Atribut
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Material</label>
                                <input
                                    type="text"
                                    value={data.material}
                                    onChange={(e) =>
                                        setData('material', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Kayu Jati, MDF, dll"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Warna</label>
                                <input
                                    type="text"
                                    value={data.color}
                                    onChange={(e) =>
                                        setData('color', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Coklat Tua, Natural, dll"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="mb-3 flex items-center justify-between">
                                <label className={labelClass + ' mb-0'}>
                                    Spesifikasi
                                </label>
                                <button
                                    type="button"
                                    onClick={addSpecification}
                                    className="flex items-center gap-1 rounded-lg bg-terra-100 px-3 py-1.5 text-sm text-terra-700 transition-colors hover:bg-terra-200"
                                >
                                    <Plus className="h-4 w-4" /> Tambah
                                </button>
                            </div>
                            {specifications.length > 0 && (
                                <div className="space-y-3">
                                    {specifications.map((spec, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3"
                                        >
                                            <input
                                                type="text"
                                                value={spec.key}
                                                onChange={(e) =>
                                                    updateSpecification(
                                                        index,
                                                        'key',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                                placeholder="Nama (cth: Garansi)"
                                            />
                                            <input
                                                type="text"
                                                value={spec.value}
                                                onChange={(e) =>
                                                    updateSpecification(
                                                        index,
                                                        'value',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                                placeholder="Nilai (cth: 2 Tahun)"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSpecification(index)
                                                }
                                                className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {specifications.length === 0 && (
                                <p className="text-sm text-terra-400">
                                    Belum ada spesifikasi. Klik tombol "Tambah"
                                    untuk menambahkan.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 6. Media */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Media
                        </h2>
                        <div className="space-y-4">
                            <div
                                className={`cursor-pointer rounded-xl border-2 border-dashed border-terra-200 p-8 text-center transition-colors hover:border-wood ${isCompressing ? 'pointer-events-none opacity-50' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={isCompressing}
                                />
                                {isCompressing ? (
                                    <>
                                        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-terra-400" />
                                        <p className="font-medium text-terra-700">
                                            Mengompres gambar...
                                        </p>
                                        <p className="mt-1 text-sm text-terra-400">
                                            Mohon tunggu sebentar
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mx-auto mb-4 h-12 w-12 text-terra-400" />
                                        <p className="font-medium text-terra-700">
                                            Klik untuk upload gambar
                                        </p>
                                        <p className="mt-1 text-sm text-terra-400">
                                            PNG, JPG, WEBP (otomatis dikompres
                                            ke 2MB). Klik gambar untuk
                                            jadikan gambar utama.
                                        </p>
                                    </>
                                )}
                            </div>

                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {previewImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`group relative cursor-pointer rounded-xl border-2 transition-colors ${
                                                index === primaryIndex
                                                    ? 'border-wood'
                                                    : 'border-terra-100 hover:border-terra-300'
                                            }`}
                                            onClick={() =>
                                                setPrimaryIndex(index)
                                            }
                                        >
                                            <img
                                                src={img.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="aspect-square w-full rounded-xl object-cover"
                                            />
                                            {index === primaryIndex && (
                                                <span className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-wood px-2 py-1 text-xs text-white">
                                                    <Star className="h-3 w-3" />{' '}
                                                    Utama
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage(index);
                                                }}
                                                className="absolute top-2 right-2 rounded-lg bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 7. Status & Penjualan */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Status & Penjualan
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label className={labelClass}>
                                    Status Produk
                                </label>
                                <Combobox
                                    options={statuses.map((s) => ({
                                        value: s.value,
                                        label: s.name,
                                    }))}
                                    value={data.status}
                                    onChange={(val) =>
                                        setData('status', val)
                                    }
                                    placeholder="Pilih status"
                                    searchPlaceholder="Cari status..."
                                    emptyText="Status tidak ditemukan."
                                />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Tipe Penjualan
                                </label>
                                <Combobox
                                    options={saleTypes.map((t) => ({
                                        value: t.value,
                                        label: t.name,
                                    }))}
                                    value={data.sale_type}
                                    onChange={(val) =>
                                        setData('sale_type', val)
                                    }
                                    placeholder="Pilih tipe penjualan"
                                    searchPlaceholder="Cari tipe penjualan..."
                                    emptyText="Tipe tidak ditemukan."
                                />
                            </div>
                            <div className="flex flex-col justify-end gap-3">
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) =>
                                            setData(
                                                'is_featured',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-5 w-5 rounded border-terra-300 text-terra-900 focus:ring-wood"
                                    />
                                    <span className="text-sm text-terra-700">
                                        Produk Unggulan
                                    </span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.is_new_arrival}
                                        onChange={(e) =>
                                            setData(
                                                'is_new_arrival',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-5 w-5 rounded border-terra-300 text-terra-900 focus:ring-wood"
                                    />
                                    <span className="text-sm text-terra-700">
                                        Produk Baru
                                    </span>
                                </label>
                            </div>
                        </div>
                        {['clearance', 'stock_sale', 'hot_sale'].includes(
                            data.sale_type,
                        ) && (
                            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-terra-100 pt-6 md:grid-cols-3">
                                <div>
                                    <label className={labelClass}>
                                        Diskon (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.discount_percentage}
                                        onChange={(e) =>
                                            setData(
                                                'discount_percentage',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        Mulai Diskon
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.discount_starts_at}
                                        onChange={(e) =>
                                            setData(
                                                'discount_starts_at',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        Akhir Diskon
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.discount_ends_at}
                                        onChange={(e) =>
                                            setData(
                                                'discount_ends_at',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 8. SEO */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Globe className="h-5 w-5 text-terra-500" />
                            <h2 className="text-lg font-semibold text-terra-900">
                                SEO
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className={labelClass}>
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={data.meta_title}
                                    onChange={(e) =>
                                        setData('meta_title', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Judul halaman untuk mesin pencari"
                                    maxLength={60}
                                />
                                <p className="mt-1 text-right text-xs text-terra-400">
                                    {data.meta_title.length}/60
                                </p>
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Meta Description
                                </label>
                                <textarea
                                    value={data.meta_description}
                                    onChange={(e) =>
                                        setData(
                                            'meta_description',
                                            e.target.value,
                                        )
                                    }
                                    rows={2}
                                    className={inputClass + ' resize-none'}
                                    placeholder="Deskripsi singkat untuk mesin pencari"
                                    maxLength={160}
                                />
                                <p className="mt-1 text-right text-xs text-terra-400">
                                    {data.meta_description.length}/160
                                </p>
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Meta Keywords
                                </label>
                                <input
                                    type="text"
                                    value={data.meta_keywords}
                                    onChange={(e) =>
                                        setData(
                                            'meta_keywords',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    placeholder="kata kunci 1, kata kunci 2, kata kunci 3"
                                />
                                <p className="mt-1 text-xs text-terra-400">
                                    Pisahkan dengan koma
                                </p>
                            </div>

                            {/* SERP Preview */}
                            {(data.meta_title || data.name) && (
                                <div className="rounded-xl bg-sand-50 p-4">
                                    <p className="mb-2 text-xs font-medium text-terra-500">
                                        Preview Google
                                    </p>
                                    <div className="space-y-1">
                                        <p className="truncate text-lg text-blue-700">
                                            {data.meta_title || data.name}
                                        </p>
                                        <p className="text-sm text-green-700">
                                            furniturin.com/shop/products/
                                            {data.name
                                                .toLowerCase()
                                                .replace(/\s+/g, '-') ||
                                                'produk-baru'}
                                        </p>
                                        <p className="line-clamp-2 text-sm text-terra-600">
                                            {data.meta_description ||
                                                data.short_description ||
                                                'Deskripsi produk akan tampil di sini...'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href="/admin/products"
                            className="rounded-xl border border-terra-200 px-6 py-3 font-medium text-terra-700 transition-colors hover:bg-terra-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-terra-900 px-6 py-3 font-medium text-white transition-colors hover:bg-wood-dark disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
