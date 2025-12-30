import {
    about,
    contact,
    faq,
    home,
    privacy,
    returns,
    shipping,
    terms,
} from '@/routes/shop';
import { hotSale, index as productsIndex } from '@/routes/shop/products';
import { SiteSettings } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export const Footer = () => {
    const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Furniturin';
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden bg-teal-500 py-20 text-white">
            {/* Decorative Element */}
            <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/2 rounded-full bg-teal-400/30 blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
                <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-16 md:grid-cols-12">
                    {/* Brand Section */}
                    <div className="md:col-span-5">
                        <Link href={home.url()}>
                            <img
                                src="/assets/images/logo.webp"
                                alt={siteName}
                                className="mb-6 h-10 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="max-w-md text-lg leading-relaxed font-light text-teal-200/80">
                            Premium quality furniture for modern living. We
                            believe in furniture that tells a story—your story.
                        </p>
                    </div>

                    {/* Shop Links */}
                    <div className="md:col-span-2 md:col-start-7">
                        <h4 className="mb-6 font-medium tracking-wide text-white">
                            Shop
                        </h4>
                        <ul className="space-y-4 text-sm text-teal-200/70">
                            <li>
                                <Link
                                    href={productsIndex.url()}
                                    className="transition-colors hover:text-accent-500"
                                >
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={hotSale.url()}
                                    className="transition-colors hover:text-accent-500"
                                >
                                    Hot Sale
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={productsIndex.url({
                                        query: { sort: 'newest' },
                                    })}
                                    className="transition-colors hover:text-accent-500"
                                >
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={productsIndex.url({
                                        query: { sort: 'best_seller' },
                                    })}
                                    className="transition-colors hover:text-accent-500"
                                >
                                    Best Sellers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="md:col-span-2">
                        <h4 className="mb-6 font-medium tracking-wide text-white">
                            Company
                        </h4>
                        <ul className="space-y-4 text-sm text-teal-200/70">
                            <li>
                                <Link
                                    href={about.url()}
                                    className="transition-colors hover:text-accent-500"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={contact.url()}
                                    className="transition-colors hover:text-accent-500"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={faq.url()}
                                    className="transition-colors hover:text-accent-500"
                                >
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="md:col-span-2">
                        <h4 className="mb-6 font-medium tracking-wide text-white">
                            Support
                        </h4>
                        <ul className="space-y-4 text-sm text-teal-200/70">
                            <li>
                                <Link
                                    href={shipping.url()}
                                    className="transition-colors hover:text-accent-500"
                                >
                                    Shipping
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={returns.url()}
                                    className="transition-colors hover:text-accent-500"
                                >
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={faq.url()}
                                    className="transition-colors hover:text-accent-500"
                                >
                                    Help Center
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col items-center justify-between pt-8 text-xs text-teal-200/50 md:flex-row">
                    <p>
                        &copy; {currentYear} {siteName}. All rights reserved.
                    </p>
                    <div className="mt-4 flex gap-6 md:mt-0">
                        <Link
                            href={privacy.url()}
                            className="transition-colors hover:text-accent-500"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href={terms.url()}
                            className="transition-colors hover:text-accent-500"
                        >
                            Terms & Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
