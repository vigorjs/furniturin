import { Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page?: number;
    links?: PaginationLink[];
}

interface PaginationProps {
    links?: PaginationLink[]; // Made optional
    meta?: PaginationMeta;
    // For raw paginator (not resource collection), the fields are at the root
    paginator?: PaginationMeta & { data?: any[] };
    className?: string;
}

export default function Pagination({
    links,
    meta,
    paginator,
    className = '',
}: PaginationProps) {
    // Normalize data
    const currentMeta = meta || paginator;
    const currentLinks = links || paginator?.links || [];

    // If no links, hide
    if (currentLinks.length === 0) return null;

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const url = new URL(window.location.href);
        url.searchParams.set('per_page', e.target.value);
        url.searchParams.set('page', '1'); // Reset to page 1

        router.visit(url.toString(), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div
            className={`flex flex-col items-center justify-between gap-4 border-t border-neutral-100 px-6 py-4 sm:flex-row ${className}`}
        >
            <div className="flex items-center gap-4">
                {/* Info Text */}
                {currentMeta && (
                    <div className="text-sm text-neutral-500">
                        Menampilkan{' '}
                        <span className="font-medium text-neutral-900">
                            {currentMeta.from || 0}
                        </span>{' '}
                        sampai{' '}
                        <span className="font-medium text-neutral-900">
                            {currentMeta.to || 0}
                        </span>{' '}
                        dari{' '}
                        <span className="font-medium text-neutral-900">
                            {currentMeta.total}
                        </span>{' '}
                        data
                    </div>
                )}

                {/* Per Page Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-500">Tampilkan</span>
                    <select
                        value={currentMeta?.per_page || 15}
                        onChange={handlePerPageChange}
                        className="rounded-lg border-neutral-200 bg-neutral-50 py-1 pr-8 pl-2 text-sm focus:border-teal-600 focus:ring-teal-600"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
                {/* First Page */}
                {currentLinks.length > 0 &&
                    currentMeta &&
                    (() => {
                        const isFirstPage = currentMeta.current_page === 1;
                        const firstPageUrl = (() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('page', '1');
                            return url.toString();
                        })();
                        return (
                            <Link
                                href={isFirstPage ? '#' : firstPageUrl}
                                preserveScroll
                                className={`rounded-lg p-2 text-neutral-500 transition-colors ${isFirstPage ? 'cursor-not-allowed opacity-50' : 'hover:bg-neutral-100'}`}
                                as="button"
                                disabled={isFirstPage}
                            >
                                <ChevronsLeft className="h-5 w-5" />
                            </Link>
                        );
                    })()}

                {/* Pagination Links */}
                <div className="flex items-center gap-1">
                    {currentLinks.map((link, index) => {
                        // Standard Laravel Pagination: First item is Previous, Last item is Next
                        const isPrevious = index === 0;
                        const isNext = index === currentLinks.length - 1;

                        // Render standard Prev/Next buttons as Chevrons
                        if (isPrevious) {
                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-lg p-2 text-neutral-500 transition-colors ${!link.url ? 'cursor-not-allowed opacity-50' : 'hover:bg-neutral-100'}`}
                                    as="button"
                                    disabled={!link.url}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Link>
                            );
                        }

                        if (isNext) {
                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-lg p-2 text-neutral-500 transition-colors ${!link.url ? 'cursor-not-allowed opacity-50' : 'hover:bg-neutral-100'}`}
                                    as="button"
                                    disabled={!link.url}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                            );
                        }

                        // Ellipsis separator
                        if (link.label === '...') {
                            return (
                                <span
                                    key={index}
                                    className="px-2 text-gray-400"
                                >
                                    ...
                                </span>
                            );
                        }

                        // Number links
                        return (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                    link.active
                                        ? 'bg-teal-600 text-white'
                                        : 'text-neutral-600 hover:bg-neutral-100'
                                } `}
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            </Link>
                        );
                    })}
                </div>

                {/* Last Page */}
                {currentLinks.length > 0 &&
                    currentMeta &&
                    (() => {
                        const isLastPage =
                            currentMeta.current_page === currentMeta.last_page;
                        const lastPageUrl = (() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set(
                                'page',
                                String(currentMeta.last_page),
                            );
                            return url.toString();
                        })();
                        return (
                            <Link
                                href={isLastPage ? '#' : lastPageUrl}
                                preserveScroll
                                className={`rounded-lg p-2 text-neutral-500 transition-colors ${isLastPage ? 'cursor-not-allowed opacity-50' : 'hover:bg-neutral-100'}`}
                                as="button"
                                disabled={isLastPage}
                            >
                                <ChevronsRight className="h-5 w-5" />
                            </Link>
                        );
                    })()}
            </div>
        </div>
    );
}
