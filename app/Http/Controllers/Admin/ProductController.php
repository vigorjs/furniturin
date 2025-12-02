<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Product\CreateProductAction;
use App\Actions\Product\DeleteProductAction;
use App\Actions\Product\UpdateProductAction;
use App\Enums\ProductStatus;
use App\Enums\SaleType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductStoreRequest;
use App\Http\Requests\Admin\ProductUpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view products', only: ['index', 'show']),
            new Middleware('permission:create products', only: ['create', 'store']),
            new Middleware('permission:edit products', only: ['edit', 'update']),
            new Middleware('permission:delete products', only: ['destroy']),
        ];
    }

    public function index(Request $request): Response
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::exact('category_id'),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('sale_type'),
                AllowedFilter::exact('is_featured'),
            ])
            ->allowedSorts(['name', 'price', 'stock_quantity', 'created_at', 'sold_count'])
            ->with(['category', 'images'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'filters' => $request->only(['filter', 'sort']),
            'statuses' => ProductStatus::cases(),
            'saleTypes' => SaleType::cases(),
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Products/Create', [
            'categories' => CategoryResource::collection($categories),
            'statuses' => ProductStatus::cases(),
            'saleTypes' => SaleType::cases(),
        ]);
    }

    public function store(ProductStoreRequest $request, CreateProductAction $action): RedirectResponse
    {
        /** @var array<int, \Illuminate\Http\UploadedFile> $images */
        $images = $request->file('images', []);

        $action->execute($request->validated(), $images);

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function show(Product $product): Response
    {
        $product->load(['category', 'images', 'reviews.user']);

        return Inertia::render('Admin/Products/Show', [
            'product' => new ProductResource($product),
        ]);
    }

    public function edit(Product $product): Response
    {
        $product->load(['category', 'images']);
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Products/Edit', [
            'product' => new ProductResource($product),
            'categories' => CategoryResource::collection($categories),
            'statuses' => ProductStatus::cases(),
            'saleTypes' => SaleType::cases(),
        ]);
    }

    public function update(
        ProductUpdateRequest $request,
        Product $product,
        UpdateProductAction $action
    ): RedirectResponse {
        /** @var array<int, \Illuminate\Http\UploadedFile> $newImages */
        $newImages = $request->file('images', []);

        /** @var array<int, int> $deleteImageIds */
        $deleteImageIds = $request->input('delete_images', []);

        $action->execute($product, $request->validated(), $newImages, $deleteImageIds);

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product, DeleteProductAction $action): RedirectResponse
    {
        $action->execute($product);

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}
