<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::exact('category_id'),
                AllowedFilter::exact('sale_type'),
                AllowedFilter::scope('price_min', 'priceMin'),
                AllowedFilter::scope('price_max', 'priceMax'),
            ])
            ->allowedSorts(['name', 'price', 'created_at', 'sold_count', 'average_rating'])
            ->active()
            ->with(['category', 'images'])
            ->paginate(12)
            ->withQueryString();

        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Shop/Products/Index', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'filters' => $request->only(['filter', 'sort']),
        ]);
    }

    public function show(Product $product): Response
    {
        // Increment view count
        $product->increment('view_count');

        $product->load([
            'category',
            'images',
            'reviews' => fn ($query) => $query->approved()->with('user')->latest()->limit(10),
        ]);

        // Get related products
        $relatedProducts = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('images')
            ->limit(4)
            ->get();

        return Inertia::render('Shop/Products/Show', [
            'product' => new ProductResource($product),
            'relatedProducts' => ProductResource::collection($relatedProducts),
        ]);
    }

    public function byCategory(Category $category, Request $request): Response
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::exact('sale_type'),
                AllowedFilter::scope('price_min', 'priceMin'),
                AllowedFilter::scope('price_max', 'priceMax'),
            ])
            ->allowedSorts(['name', 'price', 'created_at', 'sold_count', 'average_rating'])
            ->active()
            ->where('category_id', $category->id)
            ->with(['category', 'images'])
            ->paginate(12)
            ->withQueryString();

        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Shop/Products/Index', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'currentCategory' => new CategoryResource($category),
            'filters' => $request->only(['filter', 'sort']),
        ]);
    }
}
