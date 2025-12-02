<?php

declare(strict_types=1);

namespace App\Models;

use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * CartItem Model
 *
 * Item di shopping cart.
 *
 * @property int $id
 * @property int $cart_id
 * @property int $product_id
 * @property int $quantity
 * @property int $unit_price
 * @property array|null $options
 */
class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'unit_price',
        'options',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'integer',
            'options' => 'array',
        ];
    }

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // ==================== Accessors ====================

    public function getSubtotalAttribute(): int
    {
        return $this->unit_price * $this->quantity;
    }

    public function getSubtotalMoneyAttribute(): Money
    {
        return Money::IDR($this->subtotal);
    }

    public function getUnitPriceMoneyAttribute(): Money
    {
        return Money::IDR($this->unit_price);
    }

    public function getFormattedUnitPriceAttribute(): string
    {
        return $this->unit_price_money->format();
    }

    public function getFormattedSubtotalAttribute(): string
    {
        return $this->subtotal_money->format();
    }

    // ==================== Helper Methods ====================

    public function updateQuantity(int $quantity): void
    {
        if ($quantity <= 0) {
            $this->delete();

            return;
        }

        $this->update(['quantity' => $quantity]);
    }

    public function syncPriceWithProduct(): void
    {
        /** @var Product $product */
        $product = $this->product;
        $this->update(['unit_price' => $product->final_price]);
    }
}
