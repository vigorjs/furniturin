import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ShopLayout from '@/layouts/ShopLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock, Search, User } from 'lucide-react';
import { useState } from 'react';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt_truncated: string;
  featured_image_url: string | null;
  author_name: string;
  formatted_published_at: string;
  read_time: number;
  views: number;
  tags: string[];
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
    tag?: string;
  };
}

export default function ArticlesIndex({
  articles,
  filters = {},
}: ArticlesIndexProps) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = () => {
    router.get(
      '/shop/articles',
      {
        search: search || undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
      },
    );
  };

  const featuredArticle = articles.data.length > 0 ? articles.data[0] : null;
  const restArticles = articles.data.length > 1 ? articles.data.slice(1) : [];
  const isFirstPage =
    !articles.meta.current_page || articles.meta.current_page === 1;

  return (
    <ShopLayout>
      <Head title="Artikel & Berita" />

      <div className="min-h-screen bg-neutral-50">
        {/* Hero Header */}
        <div className="border-b border-neutral-100 bg-white">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center px-6 py-8 md:px-12 md:py-8">
            <h1 className="font-serif text-2xl text-neutral-900 sm:text-4xl md:text-5xl">
              Artikel & Berita
            </h1>
            <p className="mt-1 max-w-[400px] text-center text-sm text-neutral-500 sm:mt-2 sm:text-base">
              Temukan inspirasi, tips perawatan, dan tren terbaru seputar
              furniture untuk rumah impian Anda.
            </p>

            {/* Search */}
            <div className="mt-6 w-full max-w-lg">
              <div className="relative">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Cari artikel..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  className="border-neutral-200 pl-10 text-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-12">
          {articles.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 rounded-full bg-neutral-100 p-6">
                <Search className="h-8 w-8 text-neutral-300" />
              </div>
              <h3 className="text-lg font-medium text-neutral-700">
                Tidak ada artikel ditemukan
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Coba kata kunci lain atau hapus filter pencarian
              </p>
            </div>
          ) : (
            <>
              {/* Featured Article (first page only, first article) */}
              {isFirstPage && featuredArticle && !filters.search && (
                <Link
                  href={`/shop/articles/${featuredArticle.slug}`}
                  className="group mb-10 block overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-[16/10] overflow-hidden bg-neutral-100 md:aspect-auto md:min-h-[320px]">
                      {featuredArticle.featured_image_url ? (
                        <img
                          src={featuredArticle.featured_image_url}
                          alt={featuredArticle.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal-50 to-neutral-100">
                          <div className="text-center">
                            <span className="text-5xl">📰</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-6 md:p-10">
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                        <span className="rounded-full bg-teal-50 px-3 py-1 font-medium text-teal-600">
                          Artikel Terbaru
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {featuredArticle.formatted_published_at}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-neutral-900 transition-colors group-hover:text-teal-600 md:text-3xl">
                        {featuredArticle.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-neutral-600">
                        {featuredArticle.excerpt_truncated}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
                        <span className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          {featuredArticle.author_name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {featuredArticle.read_time} menit baca
                        </span>
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-teal-600 transition-all group-hover:gap-3">
                        Baca Selengkapnya
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Articles Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(isFirstPage && !filters.search
                  ? restArticles
                  : articles.data
                ).map((article) => (
                  <Link
                    key={article.id}
                    href={`/shop/articles/${article.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Image */}
                    <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                      {article.featured_image_url ? (
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal-50 to-neutral-50">
                          <span className="text-4xl opacity-60">📰</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="mb-2.5 flex flex-wrap gap-1.5">
                          {article.tags.slice(0, 2).map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-medium text-neutral-600"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900 transition-colors group-hover:text-teal-600">
                        {article.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-500">
                        {article.excerpt_truncated}
                      </p>

                      {/* Meta */}
                      <div className="mt-4 flex items-center gap-3 border-t border-neutral-50 pt-4 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.author_name}
                        </span>
                        <span className="text-neutral-200">•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.formatted_published_at}
                        </span>
                        <span className="text-neutral-200">•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.read_time} min
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {articles.meta.last_page > 1 && (
                <div className="mt-10">
                  <Pagination paginator={articles.meta} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ShopLayout>
  );
}
