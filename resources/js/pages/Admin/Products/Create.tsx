import AdminLayout from '@/layouts/admin/admin-layout';
import { compressImage } from '@/utils/image-compress';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
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
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, processing, errors } = useForm({
        name: '',
        sku: '',
        category_id: '',
        description: '',
        price: '',
        discount_percentage: '',
        stock_quantity: '',
        status: 'active',
        sale_type: 'regular',
        is_featured: false,
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
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('sku', data.sku);
        formData.append('category_id', data.category_id);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('discount_percentage', data.discount_percentage);
        formData.append('stock_quantity', data.stock_quantity);
        formData.append('status', data.status);
        formData.append('sale_type', data.sale_type);
        formData.append('is_featured', data.is_featured ? '1' : '0');

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
                    {/* Basic Info */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Informasi Dasar
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Nama Produk *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    placeholder="Masukkan nama produk"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    SKU *
                                </label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) =>
                                        setData('sku', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    placeholder="KRS-001"
                                />
                                {errors.sku && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.sku}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Kategori *
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData('category_id', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                >
                                    <option value="">Pilih kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    placeholder="Deskripsi produk..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Gambar Produk
                        </h2>
                        <div className="space-y-4">
                            {/* Upload Area */}
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
                                            ke 2MB)
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Preview */}
                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {previewImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className="group relative"
                                        >
                                            <img
                                                src={img.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="aspect-square w-full rounded-xl border border-terra-100 object-cover"
                                            />
                                            {index === 0 && (
                                                <span className="absolute top-2 left-2 rounded-lg bg-wood px-2 py-1 text-xs text-white">
                                                    Utama
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(index)
                                                }
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

                    {/* Pricing */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Harga & Stok
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Harga *
                                </label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData('price', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
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
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Stok *
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
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status & Tipe Penjualan */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Status & Tipe Penjualan
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Status Produk
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                >
                                    {statuses.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Tipe Penjualan
                                </label>
                                <select
                                    value={data.sale_type}
                                    onChange={(e) =>
                                        setData('sale_type', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                >
                                    {saleTypes.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <label className="flex cursor-pointer items-center gap-3 self-end pb-3">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) =>
                                        setData('is_featured', e.target.checked)
                                    }
                                    className="h-5 w-5 rounded border-terra-300 text-terra-900 focus:ring-wood"
                                />
                                <span className="text-terra-700">
                                    Produk Unggulan
                                </span>
                            </label>
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
