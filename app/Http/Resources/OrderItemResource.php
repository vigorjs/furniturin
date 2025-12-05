<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin OrderItem
 */
class OrderItemResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'product_sku' => $this->product_sku,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'unit_price_formatted' => $this->formatted_unit_price,
            'subtotal' => $this->subtotal,
            'subtotal_formatted' => $this->formatted_subtotal,
            'options' => $this->options,
            'product' => $this->relationLoaded('product') && $this->product
                ? (new ProductResource($this->product))->resolve()
                : null,
        ];
    }
}
