<?php

declare(strict_types=1);

namespace App\Actions\Category;

use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class DeleteCategoryAction
{
    public function execute(Category $category): bool
    {
        // Check if category has products
        if ($category->products()->exists()) {
            throw new InvalidArgumentException('Kategori tidak dapat dihapus karena masih memiliki produk.');
        }

        // Check if category has children
        if ($category->children()->exists()) {
            throw new InvalidArgumentException('Kategori tidak dapat dihapus karena masih memiliki sub-kategori.');
        }

        // Delete image if exists
        if ($category->image_path) {
            Storage::disk('public')->delete($category->image_path);
        }

        return (bool) $category->delete();
    }
}

