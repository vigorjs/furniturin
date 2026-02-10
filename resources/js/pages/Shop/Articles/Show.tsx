import { Badge } from '@/components/ui/badge';
import ShopLayout from '@/layouts/ShopLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Eye, Home, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  author_name: string;
  formatted_published_at: string;
  read_time: number;
  views: number;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
}

interface ArticleShowProps {
  article: Article;
}

export default function ArticleShow({ article }: ArticleShowProps) {
  return (
    <ShopLayout>
      <Head title={article.meta_title || article.title}>
        <meta
          name="description"
          content={article.meta_description || article.excerpt}
        />
        {article.meta_title && (
          <meta property="og:title" content={article.meta_title} />
        )}
        {article.excerpt && (
          <meta property="og:description" content={article.excerpt} />
        )}
        {article.featured_image_url && (
          <meta property="og:image" content={article.featured_image_url} />
        )}
      </Head>

      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-neutral-100 bg-neutral-50">
          <div className="mx-auto max-w-[1400px] px-6 py-3 md:px-12">
            <nav className="flex items-center gap-2 text-sm text-neutral-500">
              <Link
                href="/shop"
                className="flex items-center transition-colors hover:text-teal-600"
              >
                <Home className="h-3.5 w-3.5" />
              </Link>
              <span className="text-neutral-300">/</span>
              <Link
                href="/shop/articles"
                className="transition-colors hover:text-teal-600"
              >
                Artikel
              </Link>
              <span className="text-neutral-300">/</span>
              <span className="max-w-xs truncate text-neutral-700">
                {article.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Article Content */}
        <article className="mx-auto max-w-4xl px-6 py-10 md:px-8 md:py-14">
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {article.tags.map((tag, idx) => (
                <Link
                  key={idx}
                  href={`/shop/articles?tag=${encodeURIComponent(tag)}`}
                >
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif text-3xl leading-tight font-bold text-neutral-900 md:text-4xl lg:text-[2.75rem]">
            {article.title}
          </h1>

          {/* Meta info */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-neutral-400" />
              <span className="font-medium text-neutral-700">
                {article.author_name}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-neutral-400" />
              {article.formatted_published_at}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-neutral-400" />
              {article.read_time} menit baca
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-neutral-400" />
              {article.views} views
            </span>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-neutral-100" />

          {/* Featured Image */}
          {article.featured_image_url && (
            <div className="mb-10 overflow-hidden rounded-xl">
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="h-auto max-h-[480px] w-full object-cover"
              />
            </div>
          )}

          {/* Article Content — Markdown */}
          <div className="prose prose-neutral prose-headings:font-serif prose-headings:text-neutral-900 prose-p:leading-relaxed prose-p:text-neutral-700 prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-teal-500 prose-blockquote:bg-teal-50/50 prose-blockquote:text-neutral-700 max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="mt-10 mb-4 text-3xl font-bold text-neutral-900"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="mt-8 mb-3 text-2xl font-bold text-neutral-900"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="mt-6 mb-2 text-xl font-semibold text-neutral-900"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p
                    className="mb-5 leading-[1.8] text-neutral-700"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    className="mb-5 ml-1 list-disc space-y-2 pl-5 text-neutral-700"
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="mb-5 ml-1 list-decimal space-y-2 pl-5 text-neutral-700"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => (
                  <li className="leading-relaxed" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="my-6 rounded-r-lg border-l-4 border-teal-500 bg-teal-50/60 p-5 text-neutral-700 italic"
                    {...props}
                  />
                ),
                code: ({ node, className, children, ...props }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code
                      className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm text-teal-700"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code
                      className="block overflow-x-auto rounded-lg bg-neutral-900 p-5 font-mono text-sm leading-relaxed text-neutral-100"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                img: ({ node, ...props }) => (
                  <img
                    className="my-8 rounded-xl shadow-sm"
                    loading="lazy"
                    {...props}
                  />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-teal-600 transition-colors hover:text-teal-700 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                table: ({ node, ...props }) => (
                  <div className="my-6 overflow-x-auto rounded-lg border border-neutral-200">
                    <table className="min-w-full text-sm" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="bg-neutral-50 px-4 py-3 text-left font-semibold text-neutral-700"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="border-t border-neutral-100 px-4 py-3 text-neutral-600"
                    {...props}
                  />
                ),
                hr: () => <hr className="my-8 border-neutral-200" />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Back Link */}
          <div className="mt-14 border-t border-neutral-100 pt-8">
            <Link
              href="/shop/articles"
              className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-teal-600"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Kembali ke Artikel
            </Link>
          </div>
        </article>
      </div>
    </ShopLayout>
  );
}
