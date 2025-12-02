<?php

declare(strict_types=1);

namespace App\Models;

use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * OrderItem Model
 *
 * Item dalam pesanan.
 *
 * @property int $id
 * @property int $order_id
 * @property int $product_id
 * @property string $product_name
 * @property string $product_sku
 * @property int $quantity
 * @property int $unit_price
 * @property int $subtotal
 * @property array|null $options
 */
class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'product_sku',
        'quantity',
        'unit_price',
        'subtotal',
        'options',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'integer',
            'subtotal' => 'integer',
            'options' => 'array',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // ==================== Accessors ====================

    public function getUnitPriceMoneyAttribute(): Money
    {
        return Money::IDR($this->unit_price);
    }

    public function getSubtotalMoneyAttribute(): Money
    {
        return Money::IDR($this->subtotal);
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

    /**
     * Create order item from cart item.
     */
    public static function fromCartItem(Order $order, CartItem $cartItem): self
    {
        /** @var Product $product */
        $product = $cartItem->product;

        /** @var self $orderItem */
        $orderItem = self::create([
            'order_id' => $order->id,
            'product_id' => $cartItem->product_id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'quantity' => $cartItem->quantity,
            'unit_price' => $cartItem->unit_price,
            'subtotal' => $cartItem->subtotal,
            'options' => $cartItem->options,
        ]);

        return $orderItem;
    }
}
