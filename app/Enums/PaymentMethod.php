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
    case MIDTRANS = 'midtrans';
    case WHATSAPP = 'whatsapp';

    /**
     * Get label untuk ditampilkan di UI (Bahasa Indonesia).
     */
    public function label(): string
    {
        return match ($this) {
            self::BANK_TRANSFER => 'Transfer Bank (Manual)',
            self::COD => 'Cash on Delivery (COD)',
            self::MIDTRANS => 'Online Payment (Midtrans)',
            self::WHATSAPP => 'WhatsApp Order',
        };
    }

    /**
     * Get description untuk UI.
     */
    public function description(): string
    {
        return match ($this) {
            self::BANK_TRANSFER => 'Transfer ke rekening BCA/Mandiri, lalu upload bukti bayar.',
            self::COD => 'Bayar saat barang sampai (Biaya tambahan Rp 5.000).',
            self::MIDTRANS => 'Bayar otomatis via GoPay, OVO, ShopeePay, Kartu Kredit, dll.',
            self::WHATSAPP => 'Pesan via WhatsApp dan bayar langsung ke admin.',
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
        return match ($this) {
            self::BANK_TRANSFER, self::COD, self::WHATSAPP => true,
            self::MIDTRANS => false,
        };
    }
}
