import Pagination from '@/components/pagination';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
  AlertTriangle,
  Eye,
  FileText,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Article {
  id: number;
  title: string;
  slug: string;
  author: string;
  status: string;
  published_at: string | null;
  views: number;
  created_at: string;
}

interface ArticlesIndexProps {
  articles: {
    data: Article[];
    links: {
      first?: string;
      last?: string;
      prev?: string;
      next?: string;
    };
    meta: {
      current_page: number;
      last_page: number;
      from: number;
      to: number;
      total: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
    };
  };
  filters?: {
    search?: string;
    status?: string;
  };
  statuses: Array<{ value: string; label: string }>;
}

export default function ArticlesIndex({
  articles,
  filters = {},
  statuses,
}: ArticlesIndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    router.get(
      '/admin/articles',
      {
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
      },
    );
  };

  const handleReset = () => {
    setSearch('');
    setStatus('all');
    router.get('/admin/articles', {}, { preserveState: true });
  };

  const handleDelete = () => {
    if (!articleToDelete) return;

    setIsDeleting(true);
    router.delete(`/admin/articles/${articleToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setArticleToDelete(null);
        setIsDeleting(false);
      },
      onError: () => {
        setIsDeleting(false);
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      published: 'bg-green-100 text-green-700',
      archived: 'bg-yellow-100 text-yellow-700',
    };

    const labels = {
      draft: 'Draft',
      published: 'Dipublikasi',
      archived: 'Diarsipkan',
    };

    return (
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
        }`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/admin' },
        { title: 'Artikel', href: '/admin/articles' },
      ]}
    >
      <Head title="Kelola Artikel" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-terra-900">
              Kelola Artikel
            </h1>
            <p className="mt-1 text-terra-500">
              Kelola artikel dan konten blog untuk toko Anda
            </p>
          </div>
          <Link
            href="/admin/articles/create"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 font-medium text-white transition-all hover:bg-teal-700"
          >
            <Plus className="h-5 w-5" /> Tambah Artikel
          </Link>
        </div>

        {/* Filters */}
        <div className="space-y-4 rounded-2xl border border-terra-100 bg-white p-4 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-terra-400" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-terra-200 bg-sand-50 py-2.5 pr-4 pl-10 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-colors ${showFilters ? 'border-terra-300 bg-terra-50 text-terra-900' : 'border-terra-200 text-terra-700 hover:bg-terra-50'}`}
            >
              <Filter className="h-5 w-5" /> Filter
            </button>
            <button
              type="submit"
              className="hidden items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-white transition-colors hover:bg-teal-700 sm:inline-flex"
            >
              Cari
            </button>
          </form>

          {showFilters && (
            <div className="grid animate-in grid-cols-1 gap-4 border-t border-terra-100 pt-4 duration-200 slide-in-from-top-2 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-terra-700">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-terra-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-wood/50 focus:outline-none"
                >
                  <option value="all">Semua Status</option>
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 flex items-end gap-2 sm:col-span-1">
                <button
                  onClick={() => handleSearch()}
                  className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 sm:flex-none"
                >
                  Terapkan
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-lg border border-terra-200 px-4 py-2 text-sm font-medium text-terra-600 transition-colors hover:bg-terra-50 sm:flex-none"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-terra-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-terra-100 bg-sand-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Judul
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Penulis
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Tanggal Publikasi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Dilihat
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-terra-600">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terra-100">
                {articles.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-terra-50">
                        <FileText className="h-6 w-6 text-terra-400" />
                      </div>
                      <p className="mt-2 text-sm text-terra-500">
                        Tidak ada artikel ditemukan
                      </p>
                    </td>
                  </tr>
                ) : (
                  articles.data.map((article) => (
                    <tr
                      key={article.id}
                      className="transition-colors hover:bg-sand-50/50"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="font-medium text-terra-900 hover:text-teal-600"
                        >
                          {article.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-terra-600">
                        {article.author}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-terra-600">
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString(
                              'id-ID',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              },
                            )
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-terra-600">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-terra-400" />
                          {article.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="rounded-lg p-2 text-terra-500 transition-colors hover:bg-terra-100"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setArticleToDelete(article)}
                            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {articles.data.length > 0 && (
            <div className="border-t border-terra-100 bg-white px-6 py-4">
              <Pagination meta={articles.meta} links={articles.meta.links} />
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={!!articleToDelete}
        onOpenChange={(open) => !open && setArticleToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Hapus Artikel</DialogTitle>
            <DialogDescription className="text-center">
              Apakah Anda yakin ingin menghapus artikel{' '}
              <span className="font-semibold text-terra-900">
                "{articleToDelete?.title}"
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <DialogClose asChild>
              <button
                type="button"
                className="flex-1 rounded-xl border border-terra-200 px-4 py-2.5 font-medium text-terra-700 transition-colors hover:bg-terra-50 sm:flex-none"
              >
                Batal
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 sm:flex-none"
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
