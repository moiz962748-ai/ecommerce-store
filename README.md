# 🛒 Modern Multi-Tenant E-Commerce Platform

A production-ready, highly extensible multi-tenant e-commerce web platform built with **Next.js (App Router)**, **Tailwind CSS**, and **Lucide React**. The application dynamically serves, brands, and themes distinct multi-category storefronts (Electronics, Sports, Clothing) with real-time theme switching, persistent navigation, and shared cross-store state synchronization.

---

## 🌟 Key Features

### 🏢 Multi-Tenant Store Architecture
- **Dynamic Route Routing:** Single codebase serving multiple distinct brand storefronts via dynamic routing (`/store/[subdomain]`).
- **Storefront Categorization:** Automatic identification and dynamic UI reconfiguration for three core retail verticals:
  - **⚡ Electronics Store:** High-tech Cyan/Blue theme accents with gadget-centric metadata.
  - **🏆 Sports & Fitness Store:** High-energy Emerald/Teal aesthetics with athletic catalog styling.
  - **👗 Clothing & Apparel Store:** Curated Violet/Purple palette with fashion-forward components.

### 🎨 Universal Dual-Mode System (Light & Dark)
- **Dark Mode (Default):** Deep obsidian surfaces (`#020617`, `#020d09`, `#0b0314`), subtle ambient mesh blurs, and glassmorphic card borders.
- **Pure White Light Mode:** Clean `#ffffff` canvas with high-contrast `#0f172a` typography, soft grey card surfaces (`#f8fafc`), and custom category-matched hover states.
- **Unified Hero & Footer:** Hero sections and footer containers maintain their dark contrast across all modes for visual consistency.

### 🧭 Dynamic Header & Navigation
- **Live Sync Counters:** State synchronization for Cart and Wishlist items via `localStorage` and custom dispatch events (`cart-updated`, `wishlist-updated`).
- **Integrated Actions:** Inline quick-search drawer with URL routing, category-aware theme toggle, and authenticated session management (Sign In / Logout).
- **Responsive Drawer:** Full mobile menu with drawer animations.

### 📄 Dedicated Store Pages & Components
- **Home:** Hero section, Bento-style trust pillars, interactive category cards, verified customer testimonials, and stats counters.
- **Products Catalog (`/products`):** Category pill filters, product grid cards, image fallback badges, and empty-state placeholders.
- **Cart (`/cart`):** Line-item breakdown, quantity increment/decrement, dynamic subtotal calculations, shipping estimations, and remove handlers.
- **Wishlist (`/wishlist`):** Saved items gallery, one-click add to cart transfer, and empty-state illustrations.
- **About & Contact (`/about`, `/contact`):** Brand mission, transparency values, interactive FAQ accordions, and inquiry contact forms.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js (App Router)** | Full-stack React framework with server components and client hooks |
| **React** | Component-driven declarative UI architecture |
| **Tailwind CSS** | Utility-first styling with dynamic CSS variables and theming |
| **Lucide React** | Consistent icon set |
| **Custom API Client** | Centralized REST client with token authorization and error handling |

---

## 📁 Project Structure

```text
├── app/
│   ├── globals.css                       # Global styles, variables & light/dark mode engine
│   ├── layout.tsx                        # Root application layout
│   └── store/
│       └── [subdomain]/
│           ├── layout.tsx                # Store wrapper (Header + Footer persistence)
│           ├── page.tsx                  # Store dynamic home page
│           ├── products/
│           │   ├── page.tsx              # Dynamic product catalog & filter pills
│           │   └── [id]/page.tsx         # Product detail view
│           ├── cart/page.tsx             # Shopping cart & order summary
│           ├── wishlist/page.tsx         # Wishlist management
│           ├── about/page.tsx            # Store philosophy & values
│           └── contact/page.tsx          # Direct inquiry form & store info
├── components/
│   ├── store-header.tsx                  # Category-aware navigation bar
│   ├── store-footer.tsx                  # Store footer with newsletter & badges
│   └── store-theme-toggle.tsx            # Sun/Moon mode switcher with custom hovers
├── lib/
│   └── api-client.ts                     # API fetch wrapper
└── README.md

🚀 Getting Started
1. Clone the Repository
Bash
git clone <YOUR_GITHUB_REPO_URL>
cd multi-tenant-ecommerce
2. Install Dependencies
Bash
npm install
3. Setup Environment Variables
Create a .env.local file in the root directory:

Code snippet
NEXT_PUBLIC_API_URL=http://localhost:5000/api
4. Run Development Server
Bash
npm run dev
Visit http://localhost:3000 in your browser.

🔗 Example Store URLs
Electronics Store: http://localhost:3000/store/electronics

Sports & Fitness: http://localhost:3000/store/sports

Clothing & Apparel: http://localhost:3000/store/clothing

📝 License
This project is licensed under the MIT License.