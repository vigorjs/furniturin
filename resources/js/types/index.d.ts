import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SiteSettings {
    site_name: string;
    site_description: string;
    contact_email: string;
    contact_phone: string;
    contact_whatsapp: string;
    address: string;
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
}

export interface PromoBannerData {
    id: number;
    title: string;
    description: string | null;
    cta_text: string;
    cta_link: string;
    icon: 'gift' | 'percent' | 'truck';
    bg_gradient: string;
    display_type: 'banner' | 'popup' | 'both';
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    siteSettings: SiteSettings;
    featuredCategories: any[]; // Using any[] to avoid circular dependency or import issues for now, or import ApiCategory if easy
    activePromoBanners: PromoBannerData[];
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles: string[];
    [key: string]: unknown; // This allows for additional properties...
}
