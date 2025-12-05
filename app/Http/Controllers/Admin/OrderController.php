<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Order\CancelOrderAction;
use App\Actions\Order\UpdateOrderStatusAction;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OrderUpdateRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class OrderController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view orders', only: ['index', 'show']),
            new Middleware('permission:edit orders', only: ['update']),
        ];
    }

    public function index(Request $request): Response
    {
        $orders = QueryBuilder::for(Order::class)
            ->allowedFilters([
                AllowedFilter::partial('order_number'),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('payment_status'),
                AllowedFilter::scope('date_from', 'createdAfter'),
                AllowedFilter::scope('date_to', 'createdBefore'),
            ])
            ->allowedSorts(['order_number', 'total', 'created_at', 'status'])
            ->with(['user', 'items'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => OrderResource::collection($orders),
            'filters' => $request->only(['filter', 'sort']),
            'statuses' => collect(OrderStatus::cases())->map(fn ($status) => [
                'value' => $status->value,
                'name' => $status->label(),
            ])->all(),
            'paymentStatuses' => collect(PaymentStatus::cases())->map(fn ($status) => [
                'value' => $status->value,
                'name' => $status->label(),
            ])->all(),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'items.product.images']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => (new OrderResource($order))->resolve(),
            'statuses' => collect(OrderStatus::cases())->map(fn ($status) => [
                'value' => $status->value,
                'name' => $status->label(),
            ])->all(),
            'paymentStatuses' => collect(PaymentStatus::cases())->map(fn ($status) => [
                'value' => $status->value,
                'name' => $status->label(),
            ])->all(),
        ]);
    }

    public function update(
        OrderUpdateRequest $request,
        Order $order,
        UpdateOrderStatusAction $statusAction,
        CancelOrderAction $cancelAction
    ): RedirectResponse {
        $validated = $request->validated();

        // Handle cancellation
        if (isset($validated['status']) && $validated['status'] === OrderStatus::CANCELLED->value) {
            try {
                $cancelAction->execute($order, $validated['cancellation_reason'] ?? 'Dibatalkan oleh admin');

                return redirect()
                    ->route('admin.orders.show', $order)
                    ->with('success', 'Pesanan berhasil dibatalkan.');
            } catch (\InvalidArgumentException $e) {
                return redirect()
                    ->route('admin.orders.show', $order)
                    ->with('error', $e->getMessage());
            }
        }

        // Handle status update
        if (isset($validated['status'])) {
            $statusAction->execute(
                $order,
                OrderStatus::from($validated['status']),
                $validated['tracking_number'] ?? null
            );
        }

        // Handle payment status update
        if (isset($validated['payment_status'])) {
            $order->update([
                'payment_status' => PaymentStatus::from($validated['payment_status']),
                'paid_at' => $validated['payment_status'] === PaymentStatus::PAID->value ? now() : $order->paid_at,
            ]);
        }

        // Handle admin notes
        if (isset($validated['admin_notes'])) {
            $order->update(['admin_notes' => $validated['admin_notes']]);
        }

        return redirect()
            ->route('admin.orders.show', $order)
            ->with('success', 'Pesanan berhasil diperbarui.');
    }
}
