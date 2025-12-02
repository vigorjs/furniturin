<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Sale type enum untuk jenis penjualan produk.
 * Berdasarkan requirement: Clearance Sale, Stock Sale, Custom Sale
 */
enum SaleType: string
{
    case REGULAR = 'regular';
    case CLEARANCE = 'clearance';
    case STOCK_SALE = 'stock_sale';
    case CUSTOM = 'custom';
    case HOT_SALE = 'hot_sale';

    /**
     * Get label untuk ditampilkan di UI (Bahasa Indonesia).
     */
    public function label(): string
    {
        return match ($this) {
            self::REGULAR => 'Regular',
            self::CLEARANCE => 'Clearance Sale',
            self::STOCK_SALE => 'Stock Sale',
            self::CUSTOM => 'Custom Order',
            self::HOT_SALE => 'Hot Sale',
        };
    }

    /**
     * Get badge color untuk UI.
     */
    public function color(): string
    {
        return match ($this) {
            self::REGULAR => 'gray',
            self::CLEARANCE => 'orange',
            self::STOCK_SALE => 'blue',
            self::CUSTOM => 'purple',
            self::HOT_SALE => 'red',
        };
    }

    /**
     * Check apakah sale type ini eligible untuk diskon.
     */
    public function hasDiscount(): bool
    {
        return in_array($this, [self::CLEARANCE, self::STOCK_SALE, self::HOT_SALE]);
    }
}

