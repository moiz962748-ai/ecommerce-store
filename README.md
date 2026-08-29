# 🛍️ Multi-Tenant Multi-Theme E-Commerce Platform

A production-ready, full-stack multi-tenant e-commerce platform built with a modern decoupled architecture. Features isolated tenant management, automated domain-based dynamic theming, an advanced product variant engine, and real-time client/server state synchronization.

---

## ⚡ Core Features

* **Multi-Tenant Architecture**: Complete tenant isolation powered by dynamic subdomain routing (`/store/clothing`, `/store/sports`, `/store/electronics`, `/store/boutique`).
* **Dynamic Theme & Mode Engine**: Automated UI adaptation (color palettes, active navigation tabs, buttons, badges, and announcement bars) customized per tenant niche, paired with dark/light mode support.
* **Product & Variant Suite**: Complete variant management (size, color, material, editions) with dynamic live price recalculation, per-variant SKU auto-generation, and instant gallery updates.
* **Client-Side Image Optimization**: Integrated canvas-based image compression reducing payload size before network transmission.
* **Real-Time Shopping Engine**: Unified local-first Cart & Wishlist state with instant local storage cross-tab dispatching and backend database persistence for authenticated sessions.
* **Granular RBAC**: Role-Based Access Control enforcing distinct permissions across `ADMIN`, `PARTNER`, and `CUSTOMER` roles.

---

## 🛠️ Tech Stack

### Frontend (CMS & Storefront)
* **Framework**: Next.js 14+ (App Router, Server & Client Components)
* **Language**: TypeScript
* **Styling**: Tailwind CSS, PostCSS
* **Form & Validation**: React Hook Form, Zod Resolver
* **Icons & UI**: Lucide React, Radix UI Primitives

### Backend (API Service)
* **Framework**: NestJS (Modular Architecture)
* **Language**: TypeScript
* **Database & ORM**: PostgreSQL, Drizzle ORM
* **Authentication**: Passport.js, JWT Guards, Custom RBAC Decorators
* **Data Integrity**: Class Validator, Class Transformer

---

## 📁 Project Structure

```text
├── backend/                        # NestJS API Application
│   ├── src/
│   │   ├── auth/                   # JWT strategies & RBAC guards
│   │   ├── common/                 # Store access interceptors & helpers
│   │   ├── db/                     # Drizzle schema definitions & client
│   │   ├── products/               # Product & Variant controllers & services
│   │   ├── stores/                 # Multi-tenant configuration module
│   │   ├── cart/                   # Cart persistence service
│   │   └── main.ts                 # Bootstrap with enlarged payload limit
│   └── drizzle.config.ts
│
└── frontend-cms/                   # Next.js Storefront & Admin Portal
    ├── src/
    │   ├── app/
    │   │   ├── dashboard/products/ # Partner CMS Product & Variant CRUD
    │   │   └── store/[subdomain]/  # Dynamic Tenant Public Storefronts
    │   │       ├── page.tsx        # Dynamic Tenant Catalog & Featured Grid
    │   │       └── products/[id]/  # Interactive Variant Switcher Page
    │   ├── components/             # Reusable UI, Themed Navbar & Headers
    │   └── lib/                    # API client, auth utilities, theme maps
    └── tailwind.config.ts

🚀 Getting Started
Prerequisites
Node.js: v18.x or higher

Package Manager: npm or pnpm

Database: Running PostgreSQL instance

1. Backend Setup
Bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
Set your .env variables:

Code snippet
DATABASE_URL=postgres://user:password@localhost:5432/ecommerce_db
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
Apply migrations and start development server:

Bash
# Push database schema via Drizzle
npx drizzle-kit push:pg

# Run development server
npm run start:dev
2. Frontend Setup
Bash
# Navigate to frontend directory
cd frontend-cms

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
Set your .env.local variables:

Code snippet
NEXT_PUBLIC_API_URL=http://localhost:5000
Start Next.js dev server:

Bash
npm run dev
🌐 Application Access Points
Admin / Partner CMS: http://localhost:3000/dashboard/products

Clothing Storefront: http://localhost:3000/store/clothing

Sports Storefront: http://localhost:3000/store/sports

Electronics Storefront: http://localhost:3000/store/electronics

Boutique Storefront: http://localhost:3000/store/boutique


🔒 Security & Performance Highlights

Optimized Payloads: Increased NestJS body limits (50MB) to accommodate high-res compressed uploads.

Tenant Isolation: Direct database scoping preventing cross-store data leakage.

Defensive Pricing Fallbacks: Multi-tier price resolution (variant.price -> product.price -> product.basePrice) preventing missing zero-value renders.