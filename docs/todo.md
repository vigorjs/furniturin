# Project Audit & Roadmap

## Overview

Status audit for the Furniture Marketplace project.
**Goal**: Identify completed features and define a roadmap for missing core functionality (Midtrans, UI, etc.).

## 1. Core Features Status

### ✅ Done (Implemented)

- **Authentication**:
    - Login & Register (Laravel Fortify/Breeze logic inferred).
    - Role-based interaction (Admin vs User).
- **Product Management**:
    - Browse Products (Index, Show, Categories).
    - Product Search (Filtering by price, category, etc.).
    - Admin: CRUD for Products and Categories.
- **Shopping Cart**:
    - Add to cart, update quantity, remove items.
    - Merge guest cart with user cart upon login.
- **Checkout & Orders**:
    - Checkout form with Address selection/creation.
    - **Stock Management**: Stock is automatically deducted when an order is placed (`CreateOrderAction`).
    - **COD Support**: Logic for COD fees is implemented.
    - Order History: Users can view their past orders.
    - Admin Order Management: Admin can view orders.

### ❌ Not Done / Needs Improvement

- **Payment Gateway (Midtrans)**:
    - **CRITICAL**: No integration with Midtrans found. Currently, only manual payment/COD logic exists.
    - Needs: `stok/midtrans` or similar package, callback handling, and Snap token generation.
- **User Reviews**:
    - **Missing Interface**: While the backend has `ProductReview` model and Admin approval routes (`reviews.approve`), there is **no route or controller method** for users to actually _submit_ a review.
- **Order Management (Advanced)**:
    - **Status Updates**: verification needed on how Admin updates order status (Shipped, Delivered, Completed).
    - **Cancellation**: Basic cancellation route exists, but needs testing to ensure it refunds stock (if applicable) or handles payment voiding.
- **Marketplace Logic**:
    - The project is currently a **Single-Vendor** store (Admin sells, Users buy). If the goal is a true "Marketplace" (multi-vendor), significant refactoring is needed to add "Seller" roles and dashboards.

## 2. UI/UX & Frontend (Inertia + React)

### ⚠️ Issues to Address

- **Consistency**:
    - User reported "messy" UI. Need to standardize components using the installed `shadcn/ui` (@radix-ui) library.
    - Ensure all pages use the same Layouts (Navbar, Footer).
- **Responsive Design**:
    - Verify mobile responsiveness for complex tables (Cart, Order History) and Grid layouts (Product listing).
- **Feedback**:
    - Add toast notifications (Success/Error) for actions like "Added to Cart" or "Profile Updated".

## 3. Roadmap / Todo List

### Phase 1: Core Functional Fixes

- [ ] **Install Midtrans**:
    - [ ] Install `midtrans/midtrans-php`.
    - [ ] Create `PaymentService` to handle Snap Token generation.
    - [ ] Create Controller for Payment Callbacks (Webhook).
    - [ ] Update `CheckoutController` to redirect to generic payment page or call Midtrans.
- [ ] **Implement User Reviews**:
    - [ ] Add `store` method to `ReviewController`.
    - [ ] Add frontend form on `Product/Show` page (only for users who bought the item?).
- [ ] **Fix Stock Return on Cancel**:
    - [ ] Ensure that cancelling an order _increments_ the stock back.

### Phase 2: UI/UX Calibration

- [ ] **Design System Audit**:
    - [ ] Standardize Buttons, Inputs, Cards using `resources/js/Components`.
    - [ ] Fix spacing and typography consistency.
- [ ] **Checkout Flow**:
    - [ ] Improve the Checkout UI to clearly show Payment Method selection (Midtrans vs COD).

### Phase 3: Marketplace Expansion (If required)

- [ ] Add `Become a Seller` flow.
- [ ] Separate `Seller Dashboard` from Admin Dashboard.
