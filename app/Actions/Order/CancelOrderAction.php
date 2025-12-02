<?php

declare(strict_types=1);

namespace App\Actions\Order;

use App\Models\Order;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CancelOrderAction
{
    public function execute(Order $order, string $reason): Order
    {
        if (! $order->status->isCancellable()) {
            throw new InvalidArgumentException('Pesanan tidak dapat dibatalkan.');
        }

        return DB::transaction(function () use ($order, $reason) {
            // Restore stock for each item
            /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItem> $orderItems */
            $orderItems = $order->items;

            foreach ($orderItems as $item) {
                /** @var \App\Models\Product|null $product */
                $product = $item->product;
                if ($product && $product->track_stock) {
                    $product->addStock($item->quantity);
                }
            }

            $order->cancel($reason);

            return $order->fresh();
        });
    }
}

