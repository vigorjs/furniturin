import { CatalogSection } from '@/components/shop/sections/CatalogSection';
import { ShopLayout } from '@/layouts/ShopLayout';
import { Head } from '@inertiajs/react';

export default function Catalog() {
    return (
        <ShopLayout>
            <Head title="Katalog Produk" />
            <CatalogSection className="pt-8 pb-20 md:pt-12 md:pb-28" />
        </ShopLayout>
    );
}
