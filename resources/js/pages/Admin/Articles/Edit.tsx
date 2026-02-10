import { TagInput } from '@/components/TagInput';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  author: string;
  author_id: number | null;
  status: string;
  tags: string[];
  read_time: number;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
}

interface EditArticleProps {
  article: Article;
  statuses: Array<{ value: string; label: string }>;
}

export default function EditArticle({ article, statuses }: EditArticleProps) {
  const [formData, setFormData] = useState({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    author: article.author,
    author_id: article.author_id,
    status: article.status,
    tags: article.tags || [],
    published_at: article.published_at || '',
    meta_title: article.meta_title || '',
    meta_description: article.meta_description || '',
    meta_keywords: article.meta_keywords || '',
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    article.featured_image ? `/storage/${article.featured_image}` : null,
  );
  const [removeImage, setRemoveImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSeo, setShowSeo] = useState(
    !!(article.meta_title || article.meta_description || article.meta_keywords),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFeaturedImage(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const data = new FormData();
    data.append('_method', 'PUT');

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'tags') {
        (value as string[]).forEach((tag) => {
          data.append('tags[]', tag);
        });
      } else if (value !== null && value !== '') {
        data.append(key, String(value));
      }
    });

    if (featuredImage) {
      data.append('featured_image', featuredImage);
    }

    if (removeImage) {
      data.append('remove_image', '1');
    }

    router.post(`/admin/articles/${article.id}`, data, {
      forceFormData: true,
      onSuccess: () => {
        setIsSubmitting(false);
      },
      onError: (errors) => {
        setErrors(errors);
        setIsSubmitting(false);
      },
    });
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/admin' },
        { title: 'Artikel', href: '/admin/articles' },
        { title: 'Edit Artikel', href: `/admin/articles/${article.id}/edit` },
      ]}
    >
      <Head title={`Edit: ${article.title}`} />

      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/articles"
              className="rounded-lg p-2 text-terra-600 transition-colors hover:bg-terra-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-terra-900">
                Edit Artikel
              </h1>
              <p className="mt-1 text-terra-500">{article.title}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content - Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic Information */}
              <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-terra-900">
                  Informasi Dasar
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-medium text-terra-700"
                    >
                      Judul <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                      placeholder="Judul artikel"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="slug"
                      className="mb-2 block text-sm font-medium text-terra-700"
                    >
                      Slug
                    </label>
                    <input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          slug: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                      placeholder="slug-artikel"
                    />
                    {errors.slug && (
                      <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="excerpt"
                      className="mb-2 block text-sm font-medium text-terra-700"
                    >
                      Ringkasan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          excerpt: e.target.value,
                        })
                      }
                      className="w-full resize-none rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                      placeholder="Ringkasan singkat artikel (maks 500 karakter)"
                      rows={3}
                      maxLength={500}
                    />
                    <div className="mt-1 flex justify-between">
                      {errors.excerpt && (
                        <p className="text-sm text-red-600">{errors.excerpt}</p>
                      )}
                      <p className="ml-auto text-xs text-terra-400">
                        {formData.excerpt.length}/500 karakter
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-terra-700">
                      Waktu Baca
                    </label>
                    <p className="text-sm text-terra-600">
                      {article.read_time} menit
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-terra-900">
                  Konten
                </h2>
                <div data-color-mode="light">
                  <MDEditor
                    value={formData.content}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        content: val || '',
                      })
                    }
                    height={500}
                    preview="edit"
                    className="!border !border-terra-200 !shadow-none"
                  />
                </div>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>

              {/* SEO */}
              <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-terra-900">
                    SEO (Opsional)
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowSeo(!showSeo)}
                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    {showSeo ? 'Sembunyikan' : 'Tampilkan Pengaturan SEO'}
                  </button>
                </div>
                {showSeo && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="meta_title"
                        className="mb-2 block text-sm font-medium text-terra-700"
                      >
                        Meta Title
                      </label>
                      <input
                        id="meta_title"
                        value={formData.meta_title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meta_title: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                        placeholder="Judul untuk SEO"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="meta_description"
                        className="mb-2 block text-sm font-medium text-terra-700"
                      >
                        Meta Description
                      </label>
                      <textarea
                        id="meta_description"
                        value={formData.meta_description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meta_description: e.target.value,
                          })
                        }
                        className="w-full resize-none rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                        placeholder="Deskripsi untuk SEO (maks 500 karakter)"
                        rows={3}
                        maxLength={500}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="meta_keywords"
                        className="mb-2 block text-sm font-medium text-terra-700"
                      >
                        Meta Keywords
                      </label>
                      <input
                        id="meta_keywords"
                        value={formData.meta_keywords}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            meta_keywords: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6 lg:col-span-1">
              {/* Actions */}
              <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-terra-900">
                  Publikasi
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="status"
                      className="mb-2 block text-sm font-medium text-terra-700"
                    >
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="published_at"
                      className="mb-2 block text-sm font-medium text-terra-700"
                    >
                      Tanggal Publikasi
                    </label>
                    <input
                      id="published_at"
                      type="datetime-local"
                      value={formData.published_at}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          published_at: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-3 font-medium text-white transition-all hover:bg-teal-700 disabled:opacity-50"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Author & Tags */}
              <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-terra-900">
                  Atribut
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="author"
                      className="mb-2 block text-sm font-medium text-terra-700"
                    >
                      Penulis <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="author"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                      placeholder="Nama penulis"
                    />
                    {errors.author && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.author}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="tags"
                      className="mb-2 block text-sm font-medium text-terra-700"
                    >
                      Tag
                    </label>
                    <TagInput
                      value={formData.tags}
                      onChange={(tags) =>
                        setFormData({
                          ...formData,
                          tags,
                        })
                      }
                      placeholder="Tambah tag"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-terra-900">
                  Gambar Unggulan
                </h2>
                <div>
                  {imagePreview && !removeImage ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="aspect-video w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 rounded-lg bg-red-500 p-1.5 text-white shadow-sm transition-colors hover:bg-red-600"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer rounded-xl border-2 border-dashed border-terra-200 p-8 text-center transition-colors hover:border-wood"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Upload className="mx-auto mb-4 h-12 w-12 text-terra-400" />
                      <p className="font-medium text-terra-700">
                        Klik untuk upload
                      </p>
                      {errors.featured_image && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.featured_image}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
