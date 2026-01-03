import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: null,
    },
    {
        title: 'Two-Factor Auth',
        href: show(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <>
            <div className="bg-noise" />
            <main className="min-h-screen bg-sand-50 pt-20 pb-20">
                <div className="mx-auto max-w-[1400px] px-6 pt-8 md:px-12">
                    <div className="mb-8 md:mb-12">
                        <h1 className="font-serif text-3xl font-medium text-terra-900 md:text-4xl">
                            Settings
                        </h1>
                        <p className="mt-2 text-terra-500">
                            Manage your profile and account settings
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:space-x-12">
                        <aside className="mb-8 w-full max-w-xs lg:mb-0 lg:w-64">
                            <nav className="flex flex-col space-y-2">
                                {sidebarNavItems.map((item, index) => {
                                    const isActive = isSameUrl(
                                        currentPath,
                                        item.href,
                                    );
                                    return (
                                        <Link
                                            key={`${resolveUrl(item.href)}-${index}`}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                                                isActive
                                                    ? 'border-l-4 border-terra-900 bg-sand-100 text-terra-900 shadow-sm'
                                                    : 'text-terra-600 hover:bg-sand-100 hover:text-terra-900',
                                            )}
                                        >
                                            {item.icon && (
                                                <item.icon className="h-5 w-5" />
                                            )}
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </aside>

                        <div className="flex-1">
                            <div className="animate-in duration-500 fade-in slide-in-from-bottom-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
