<?php

declare(strict_types=1);

namespace App\Models;

use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Cart Model
 *
 * Shopping cart. Mendukung guest cart dan authenticated cart.
 *
 * @property int $id
 * @property int|null $user_id
 * @property string|null $session_id
 * @property string|null $coupon_code
 * @property int $discount_amount
 * @property string|null $notes
 */
class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'coupon_code',
        'discount_amount',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'discount_amount' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    // ==================== Accessors ====================

    public function getSubtotalAttribute(): int
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, CartItem> $items */
        $items = $this->items;

        return $items->sum(fn (CartItem $item) => $item->subtotal);
    }

    public function getSubtotalMoneyAttribute(): Money
    {
        return Money::IDR($this->subtotal);
    }

    public function getTotalAttribute(): int
    {
        return max(0, $this->subtotal - $this->discount_amount);
    }

    public function getTotalMoneyAttribute(): Money
    {
        return Money::IDR($this->total);
    }

    public function getItemCountAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    public function getFormattedSubtotalAttribute(): string
    {
        return $this->subtotal_money->format();
    }

    public function getFormattedTotalAttribute(): string
    {
        return $this->total_money->format();
    }

    // ==================== Helper Methods ====================

    public function isEmpty(): bool
    {
        return $this->items->isEmpty();
    }

    public function clear(): void
    {
        $this->items()->delete();
        $this->update([
            'coupon_code' => null,
            'discount_amount' => 0,
        ]);
    }

    /**
     * Merge guest cart ke authenticated cart.
     */
    public function mergeWith(Cart $guestCart): void
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, CartItem> $guestItems */
        $guestItems = $guestCart->items;

        foreach ($guestItems as $guestItem) {
            /** @var CartItem|null $existingItem */
            $existingItem = $this->items()
                ->where('product_id', $guestItem->product_id)
                ->first();

            if ($existingItem) {
                $existingItem->increment('quantity', $guestItem->quantity);
            } else {
                $this->items()->create([
                    'product_id' => $guestItem->product_id,
                    'quantity' => $guestItem->quantity,
                    'unit_price' => $guestItem->unit_price,
                    'options' => $guestItem->options,
                ]);
            }
        }

        $guestCart->delete();
    }
}
