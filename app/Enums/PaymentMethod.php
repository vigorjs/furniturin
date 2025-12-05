<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Payment method enum untuk metode pembayaran yang didukung.
 */
enum PaymentMethod: string
{
    case BANK_TRANSFER = 'bank_transfer';
    case COD = 'cod';

    /**
     * Get label untuk ditampilkan di UI (Bahasa Indonesia).
     */
    public function label(): string
    {
        return match ($this) {
            self::BANK_TRANSFER => 'Transfer Bank',
            self::COD => 'Bayar di Tempat (COD)',
        };
    }

    /**
     * Get description untuk UI.
     */
    public function description(): string
    {
        return match ($this) {
            self::BANK_TRANSFER => 'Transfer ke rekening bank kami, konfirmasi via WhatsApp',
            self::COD => 'Bayar tunai saat barang diterima',
        };
    }

    /**
     * Get icon name untuk UI.
     */
    public function icon(): string
    {
        return match ($this) {
            self::BANK_TRANSFER => 'building-library',
            self::COD => 'banknotes',
        };
    }

    /**
     * Check apakah metode ini memerlukan verifikasi pembayaran manual.
     */
    public function requiresManualVerification(): bool
    {
        return true; // Both methods require manual verification
    }
}

