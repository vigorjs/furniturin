import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router } from '@inertiajs/react';
import { Star, Check, X, Clock, User, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Review {
    id: number;
    product: { id: number; name: string; image: string | null } | null;
    user: { id: number; name: string } | null;
    rating: number;
    title: string | null;
    comment: string;
    is_approved: boolean;
    created_at: string;
}

interface ReviewsIndexProps {
    reviews: Review[];
    filters?: { filter?: Record<string, string> };
}

export default function ReviewsIndex({ reviews, filters, next_page_url }: ReviewsIndexProps & { next_page_url: string | null }) {
    // Safely get filter value - check if filter is an object
    const filterObj = filters?.filter && typeof filters.filter === 'object' ? filters.filter : {};
    const [statusFilter, setStatusFilter] = useState(filterObj.is_approved || '');
    const [loadingMore, setLoadingMore] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleApprove = (id: number) => {
        router.patch(`/admin/reviews/${id}/approve`, {}, { preserveScroll: true });
    };

    const handleReject = (id: number) => {
        router.patch(`/admin/reviews/${id}/reject`, {}, { preserveScroll: true });
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/reviews/${deleteId}`, {
                preserveScroll: true,
                onFinish: () => setDeleteId(null),
            });
        }
    };

    const handleFilterChange = (value: string) => {
        setStatusFilter(value);
        router.get('/admin/reviews', value ? { 'filter[is_approved]': value } : {}, { preserveState: true });
    };

    const loadMore = () => {
        if (next_page_url && !loadingMore) {
            setLoadingMore(true);
            router.get(next_page_url, {}, {
                preserveState: true,
                preserveScroll: true,
                only: ['reviews', 'next_page_url'],
                onFinish: () => setLoadingMore(false),
            });
        }
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Ulasan', href: '/admin/reviews' }]}>
            <Head title="Kelola Ulasan" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-terra-900">Kelola Ulasan</h1>
                    <p className="text-terra-500 mt-1">Moderasi ulasan produk dari pelanggan</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-terra-100">
                    <select
                        value={statusFilter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-terra-200 bg-white text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                    >
                        <option value="" className="text-terra-900 bg-white">Semua Status</option>
                        <option value="1" className="text-terra-900 bg-white">Disetujui</option>
                        <option value="0" className="text-terra-900 bg-white">Belum Disetujui</option>
                    </select>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 shadow-sm border border-terra-100 text-center">
                            <Star className="w-12 h-12 text-terra-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-terra-900">Tidak ada ulasan</h3>
                            <p className="text-terra-500 mt-1">Belum ada ulasan yang perlu dimoderasi</p>
                        </div>
                    ) : (
                        <>
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-wood/10 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-wood" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-terra-900">{review.user?.name || 'Anonim'}</p>
                                                    <p className="text-sm text-terra-500">{review.created_at}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-terra-600 mb-2">Produk: <span className="font-medium text-terra-900">{review.product?.name || '-'}</span></p>
                                            <div className="flex items-center gap-1 mb-3">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-terra-200'}`} />
                                                ))}
                                            </div>
                                            {review.title && <p className="font-medium text-terra-900 mb-1">{review.title}</p>}
                                            <p className="text-terra-700">{review.comment}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${review.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {review.is_approved ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                {review.is_approved ? 'Disetujui' : 'Menunggu'}
                                            </span>
                                            <div className="flex gap-2">
                                                {!review.is_approved && (
                                                    <button onClick={() => handleApprove(review.id)} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Setujui">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {review.is_approved && (
                                                    <button onClick={() => handleReject(review.id)} className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors" title="Batalkan Persetujuan">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button onClick={() => confirmDelete(review.id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Hapus">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Infinite Scroll Sentinel */}
                             {next_page_url ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: false, margin: "100px" }}
                                    onViewportEnter={loadMore}
                                    className="py-8 flex justify-center"
                                >
                                    {loadingMore && (
                                        <div className="flex items-center gap-2 text-terra-500">
                                            <div className="w-2 h-2 bg-terra-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-terra-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-terra-400 rounded-full animate-bounce"></div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="py-8 text-center text-terra-400 text-sm">
                                    Semua ulasan telah ditampilkan
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus review ini? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

