<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Midtrans\Notification;

class MidtransController extends Controller
{
    public function notification(Request $request)
    {
        try {
            $notification = new Notification();

            $transaction = $notification->transaction_status;
            $type = $notification->payment_type;
            $orderId = $notification->order_id;
            $fraud = $notification->fraud_status;

            $order = Order::where('order_number', $orderId)->first();

            if (! $order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            if ($transaction == 'capture') {
                if ($type == 'credit_card') {
                    if ($fraud == 'challenge') {
                        $order->update(['payment_status' => PaymentStatus::PENDING]); // Challenge by FDS
                    } else {
                        $order->markAsPaid();
                        $order->update(['status' => OrderStatus::PROCESSING]);
                    }
                }
            } elseif ($transaction == 'settlement') {
                $order->markAsPaid();
                $order->update(['status' => OrderStatus::PROCESSING]);
            } elseif ($transaction == 'pending') {
                $order->update(['payment_status' => PaymentStatus::PENDING]);
            } elseif ($transaction == 'deny') {
                $order->update(['payment_status' => PaymentStatus::FAILED]);
                $order->update(['status' => OrderStatus::CANCELLED, 'cancellation_reason' => 'Payment Denied']);
            } elseif ($transaction == 'expire') {
                $order->update(['payment_status' => PaymentStatus::FAILED]);
                $order->update(['status' => OrderStatus::CANCELLED, 'cancellation_reason' => 'Payment Expired']);
            } elseif ($transaction == 'cancel') {
                $order->update(['payment_status' => PaymentStatus::FAILED]);
                $order->update(['status' => OrderStatus::CANCELLED, 'cancellation_reason' => 'Payment Cancelled']);
            }

            return response()->json(['message' => 'Notification processed']);
        } catch (\Exception $e) {
            Log::error('Midtrans Notification Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error processing notification'], 500);
        }
    }
}
