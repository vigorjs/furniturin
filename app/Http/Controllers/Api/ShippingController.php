<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Shipping\RajaOngkirService;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    protected RajaOngkirService $rajaOngkir;

    public function __construct(RajaOngkirService $rajaOngkir)
    {
        $this->rajaOngkir = $rajaOngkir;
    }

    public function provinces()
    {
        $provinces = $this->rajaOngkir->getProvinces();
        return response()->json($provinces);
    }

    public function search(Request $request)
    {
        $query = $request->query('search');
        if (!$query) {
            return response()->json([]);
        }
        
        $destinations = $this->rajaongkir->searchDestination($query);
        return response()->json($destinations);
    }

    public function cost(Request $request)
    {
        $request->validate([
            'destination' => 'required',
            'weight' => 'required|integer',
            'courier' => 'required|string',
        ]);

        $costs = $this->rajaOngkir->getCost(
            $request->destination,
            $request->weight,
            $request->courier
        );

        return response()->json($costs);
    }
}
