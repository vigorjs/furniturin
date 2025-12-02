<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Category\CreateCategoryAction;
use App\Actions\Category\DeleteCategoryAction;
use App\Actions\Category\UpdateCategoryAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryStoreRequest;
use App\Http\Requests\Admin\CategoryUpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view categories', only: ['index', 'show']),
            new Middleware('permission:create categories', only: ['create', 'store']),
            new Middleware('permission:edit categories', only: ['edit', 'update']),
            new Middleware('permission:delete categories', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $categories = Category::with('parent', 'children')
            ->withCount('products')
            ->orderBy('sort_order')
            ->paginate(15);

        return Inertia::render('Admin/Categories/Index', [
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function create(): Response
    {
        $parentCategories = Category::whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Categories/Create', [
            'parentCategories' => CategoryResource::collection($parentCategories),
        ]);
    }

    public function store(CategoryStoreRequest $request, CreateCategoryAction $action): RedirectResponse
    {
        $action->execute(
            $request->validated(),
            $request->file('image')
        );

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function edit(Category $category): Response
    {
        $parentCategories = Category::whereNull('parent_id')
            ->where('id', '!=', $category->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Categories/Edit', [
            'category' => new CategoryResource($category),
            'parentCategories' => CategoryResource::collection($parentCategories),
        ]);
    }

    public function update(
        CategoryUpdateRequest $request,
        Category $category,
        UpdateCategoryAction $action
    ): RedirectResponse {
        $action->execute(
            $category,
            $request->validated(),
            $request->file('image')
        );

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Category $category, DeleteCategoryAction $action): RedirectResponse
    {
        try {
            $action->execute($category);

            return redirect()
                ->route('admin.categories.index')
                ->with('success', 'Kategori berhasil dihapus.');
        } catch (\InvalidArgumentException $e) {
            return redirect()
                ->route('admin.categories.index')
                ->with('error', $e->getMessage());
        }
    }
}
