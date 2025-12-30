# Admin UI Overview

## Features

Based on `routes/admin.php` and `resources/js/pages/Admin`, the following features exist:

1.  **Dashboard** (`/admin`)
    - Stats overview (Total Products, Orders, Customers, Revenue).
    - Recent orders list.
    - Low stock alerts.
    - Visual graphs (mocked or real?).

2.  **Products Management** (`/admin/products`)
    - List products with search.
    - Create/Edit/Delete products.
    - View product details.
    - Columns: Name, SKU, Category, Price, Stock, Status.
    - **Issues**: Pagination UI is missing (data is passed but not rendered). Filter button is present but non-functional.

3.  **Categories Management** (`/admin/categories`)
    - List/Create/Edit/Delete categories.

4.  **Orders Management** (`/admin/orders`)
    - List orders.
    - View order details.
    - Update order status.

5.  **Customers** (`/admin/customers`)
    - List customers.
    - View customer details (orders history).

6.  **Reviews** (`/admin/reviews`)
    - List product reviews.
    - Approve/Reject/Delete reviews.

7.  **Reports** (`/admin/reports`)
    - View reports (likely sales/performance).

8.  **User Management** (Super Admin) (`/admin/users`)
    - CRUD operations for admin/staff users.

9.  **Settings** (`/admin/settings`)
    - General settings.
    - Homepage settings.
    - Payment settings.

## Identified UI Issues (Broken)

1.  **Products Index**:
    - **Pagination Missing**: The `links` prop is received from Inertia/Backend but not rendered in the UI. Users cannot navigate past the first page.
    - **Filter Button**: The "Filter" button exists but does nothing when clicked. No filter modal or dropdown appears.
    - **Hardcoded Colors**: Status colors are hardcoded in the component, making it inconsistent if reused elsewhere.

2.  **Dashboard**:
    - **Hardcoded Labels**: Status strings 'pending', 'processing', etc. are mapped manually.

3.  **General**:
    - **Responsiveness**: Need to verify if tables are responsive on mobile (they have `overflow-x-auto` so might be okay).
    - **Feedback**: Confirmation for delete uses native `confirm()`, which is not ideal for a "premium" UI. Should use a modal.
    - **Design**: While clean, it could use more "premium" touches like better shadows, transitions, or a more unified theme (Terra/Sand theme seems to be the current one).

## Next Steps

- Implement Pagination component.
- Implement working Filters (or remove the button if not ready).
- Replace native `confirm()` with a proper Modal.
- Extract status badges to reusable components.
- Ensure consistent styling across all admin pages.
