<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'sku' => $this->sku,
            'name' => $this->name,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'specifications' => $this->specifications,
            'price' => $this->price,
            'price_formatted' => $this->formatted_price,
            'discount_percentage' => $this->discount_percentage,
            'discount_starts_at' => $this->discount_starts_at?->toISOString(),
            'discount_ends_at' => $this->discount_ends_at?->toISOString(),
            'final_price' => $this->final_price,
            'final_price_formatted' => $this->formatted_final_price,
            'has_discount' => $this->hasActiveDiscount(),
            'stock_quantity' => $this->stock_quantity,
            'low_stock_threshold' => $this->low_stock_threshold,
            'track_stock' => $this->track_stock,
            'is_in_stock' => $this->isInStock(),
            'is_low_stock' => $this->isLowStock(),
            'weight' => $this->weight,
            'dimensions' => $this->dimensions,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
            ],
            'sale_type' => [
                'value' => $this->sale_type->value,
                'label' => $this->sale_type->label(),
            ],
            'is_featured' => $this->is_featured,
            'average_rating' => $this->average_rating,
            'review_count' => $this->review_count,
            'view_count' => $this->view_count,
            'sold_count' => $this->sold_count,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'primary_image' => $this->when(
                $this->relationLoaded('images'),
                fn () => $this->primary_image ? new ProductImageResource($this->primary_image) : null
            ),
            'reviews' => ProductReviewResource::collection($this->whenLoaded('reviews')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
