<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Payment method enum untuk metode pembayaran yang didukung.
 */
enum PaymentMethod: string
{
    case BANK_TRANSFER = 'bank_transfer';
    case E_WALLET = 'e_wallet';
    case COD = 'cod';
    case CREDIT_CARD = 'credit_card';
    case VIRTUAL_ACCOUNT = 'virtual_account';

    /**
     * Get label untuk ditampilkan di UI (Bahasa Indonesia).
     */
    public function label(): string
    {
        return match ($this) {
            self::BANK_TRANSFER => 'Transfer Bank',
            self::E_WALLET => 'E-Wallet',
            self::COD => 'Bayar di Tempat (COD)',
            self::CREDIT_CARD => 'Kartu Kredit',
            self::VIRTUAL_ACCOUNT => 'Virtual Account',
        };
    }

    /**
     * Get icon name untuk UI.
     */
    public function icon(): string
    {
        return match ($this) {
            self::BANK_TRANSFER => 'building-library',
            self::E_WALLET => 'wallet',
            self::COD => 'truck',
            self::CREDIT_CARD => 'credit-card',
            self::VIRTUAL_ACCOUNT => 'document-text',
        };
    }

    /**
     * Check apakah metode ini memerlukan verifikasi pembayaran manual.
     */
    public function requiresManualVerification(): bool
    {
        return in_array($this, [self::BANK_TRANSFER, self::COD]);
    }
}

