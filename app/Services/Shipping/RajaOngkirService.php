<?php

namespace App\Services\Shipping;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RajaOngkirService
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $origin;

    public function __construct()
    {
        $this->apiKey = config('rajaongkir.api_key');
        $this->baseUrl = config('rajaongkir.base_url');
        $this->origin = config('rajaongkir.origin');
    }

    protected function makeRequest(string $method, string $endpoint, array $params = [])
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey,
            ])->$method("{$this->baseUrl}/{$endpoint}", $params);

            if ($response->failed()) {
                Log::error('RajaOngkir API Error', [
                    'endpoint' => $endpoint,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            return $response->json()['data'] ?? null;
        } catch (\Exception $e) {
            Log::error('RajaOngkir Request Exception', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    public function getProvinces()
    {
        // Komerce endpoint for provinces
        return $this->makeRequest('get', 'destination/province');
    }

    public function searchDestination($query)
    {
        // Komerce does not have a simple city list endpoint, uses search
        return $this->makeRequest('get', 'destination/domestic-destination', [
            'search' => $query,
            'limit' => 20
        ]);
    }

    // Deprecated/Unused in new Komerce flow but kept to avoid immediate breakage if referenced
    public function getCities($provinceId = null)
    {
        return [];
    }

    public function getCost(string $destination, int $weight, string $courier)
    {
        // Komerce uses POST form-urlencoded for cost
        // Endpoint: calculate/domestic-cost
        // Keys: origin, destination, weight, courier (integer IDs for origin/dest)
        
        $params = [
            'origin' => $this->origin,
            'destination' => $destination,
            'weight' => $weight,
            'courier' => $courier,
        ];

        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey,
            ])->asForm()->post("{$this->baseUrl}/calculate/domestic-cost", $params);

            if ($response->failed()) {
                Log::error('RajaOngkir Cost API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            return $response->json()['data'] ?? null;
        } catch (\Exception $e) {
            Log::error('RajaOngkir Request Exception', ['message' => $e->getMessage()]);
            return null;
        }
    }
}
