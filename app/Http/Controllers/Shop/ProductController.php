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
                AllowedFilter::callback('category_id', function ($query, $value) {
                    $categoryIds = Category::where('id', $value)
                        ->orWhere('parent_id', $value)
                        ->pluck('id');
                    $query->whereIn('category_id', $categoryIds);
                }),
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

        $currentCategory = null;
        if ($request->filled('filter.category_id')) {
            $currentCategory = Category::find($request->input('filter.category_id'));
        }

        return Inertia::render('Shop/Products/Index', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'currentCategory' => $currentCategory ? new CategoryResource($currentCategory) : null,
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
            ->with(['images', 'category'])
            ->limit(4)
            ->get();

        return Inertia::render('Shop/Products/Show', [
            'product' => (new ProductResource($product))->resolve(),
            'relatedProducts' => ProductResource::collection($relatedProducts)->resolve(),
        ]);
    }

    public function byCategory(Category $category, Request $request): Response
    {
        // Get all descendant category IDs including self
        $categoryIds = Category::where('id', $category->id)
            ->orWhere('parent_id', $category->id)
            ->pluck('id');

        $products = QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::exact('sale_type'),
                AllowedFilter::scope('price_min', 'priceMin'),
                AllowedFilter::scope('price_max', 'priceMax'),
            ])
            ->allowedSorts(['name', 'price', 'created_at', 'sold_count', 'average_rating'])
            ->active()
            ->whereIn('category_id', $categoryIds)
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

    public function hotSale(Request $request): Response
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::callback('category_id', function ($query, $value) {
                     $categoryIds = Category::where('id', $value)
                        ->orWhere('parent_id', $value)
                        ->pluck('id');
                    $query->whereIn('category_id', $categoryIds);
                }),
                AllowedFilter::scope('price_min', 'priceMin'),
                AllowedFilter::scope('price_max', 'priceMax'),
            ])
            ->allowedSorts(['name', 'price', 'created_at', 'sold_count', 'average_rating', 'discount_percentage'])
            ->active()
            ->where('sale_type', 'hot_sale')
            ->with(['category', 'images'])
            ->paginate(12)
            ->withQueryString();

        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();

        $currentCategory = null;
        if ($request->filled('filter.category_id')) {
            $currentCategory = Category::find($request->input('filter.category_id'));
        }

        return Inertia::render('Shop/Sale/HotSale', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'currentCategory' => $currentCategory ? new CategoryResource($currentCategory) : null,
            'filters' => $request->only(['filter', 'sort']),
        ]);
    }

    public function clearance(Request $request): Response
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::callback('category_id', function ($query, $value) {
                     $categoryIds = Category::where('id', $value)
                        ->orWhere('parent_id', $value)
                        ->pluck('id');
                    $query->whereIn('category_id', $categoryIds);
                }),
                AllowedFilter::scope('price_min', 'priceMin'),
                AllowedFilter::scope('price_max', 'priceMax'),
            ])
            ->allowedSorts(['name', 'price', 'created_at', 'sold_count', 'average_rating', 'discount_percentage'])
            ->active()
            ->where('sale_type', 'clearance')
            ->with(['category', 'images'])
            ->paginate(12)
            ->withQueryString();

        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();

        $currentCategory = null;
        if ($request->filled('filter.category_id')) {
            $currentCategory = Category::find($request->input('filter.category_id'));
        }

        return Inertia::render('Shop/Sale/Clearance', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'currentCategory' => $currentCategory ? new CategoryResource($currentCategory) : null,
            'filters' => $request->only(['filter', 'sort']),
        ]);
    }

    public function stockSale(Request $request): Response
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::callback('category_id', function ($query, $value) {
                     $categoryIds = Category::where('id', $value)
                        ->orWhere('parent_id', $value)
                        ->pluck('id');
                    $query->whereIn('category_id', $categoryIds);
                }),
                AllowedFilter::scope('price_min', 'priceMin'),
                AllowedFilter::scope('price_max', 'priceMax'),
            ])
            ->allowedSorts(['name', 'price', 'created_at', 'sold_count', 'average_rating', 'discount_percentage'])
            ->active()
            ->where('sale_type', 'stock_sale')
            ->with(['category', 'images'])
            ->paginate(12)
            ->withQueryString();

        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();

        $currentCategory = null;
        if ($request->filled('filter.category_id')) {
            $currentCategory = Category::find($request->input('filter.category_id'));
        }

        return Inertia::render('Shop/Sale/StockSale', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'currentCategory' => $currentCategory ? new CategoryResource($currentCategory) : null,
            'filters' => $request->only(['filter', 'sort']),
        ]);
    }

    public function compare(Request $request): Response
    {
        $ids = $request->query('ids', '');
        $productIds = array_filter(explode(',', $ids), fn ($id) => is_numeric($id));

        $products = Product::active()
            ->whereIn('id', $productIds)
            ->with(['category', 'images'])
            ->get();

        return Inertia::render('Shop/Compare', [
            'products' => ProductResource::collection($products),
        ]);
    }
}
