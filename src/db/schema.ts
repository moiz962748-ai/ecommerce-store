import { pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb, pgEnum, primaryKey, decimal } from 'drizzle-orm/pg-core';

// --------------------------------------------------------
// ENUMS
// --------------------------------------------------------
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'PARTNER', 'CUSTOMER']);
export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']);

// --------------------------------------------------------
// TABLES
// --------------------------------------------------------

// 1. Users Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email').notNull().unique(),
  password: varchar('password').notNull(),
  role: userRoleEnum('role').notNull(),
  fullName: varchar('full_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Templates Table
export const templates = pgTable('templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
  fieldSchema: jsonb('field_schema').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Stores Table
export const stores = pgTable('stores', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  subDomain: varchar('sub_domain').notNull().unique(),
  logoUrl: varchar('logo_url'),
  templateId: uuid('template_id').references(() => templates.id).notNull(),
  templateConfig: jsonb('template_config').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Store Partner Table
export const storePartner = pgTable('store_partner', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
});

// 5. Section Type Table
export const sectionType = pgTable('section_type', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  key: varchar('key').notNull().unique(),
  fieldSchema: jsonb('field_schema').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// 6. Store Section Table
export const storeSection = pgTable('store_section', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  sectionTypeId: uuid('section_type_id').references(() => sectionType.id).notNull(),
  config: jsonb('config').notNull(),
  position: integer('position').notNull(),
  isVisible: boolean('is_visible').default(true).notNull(),
});

// 7. Nav Link Table
export const navLink = pgTable('nav_link', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  name: varchar('name').notNull(),
  link: varchar('link').notNull(),
  position: integer('position').notNull(),
});

// 8. Category Table
export const category = pgTable('category', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
});

// 9. Products Table
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  categoryId: uuid('category_id').references(() => category.id).notNull(),
  name: varchar('name').notNull(),
  description: text('description').notNull(),
  basePrice: integer('base_price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 10. Product Variant Table
export const productVariant = pgTable('product_variant', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  name: varchar('name').notNull(),
  price: integer('price').notNull(),
  sku: varchar('sku').notNull().unique(),
  stock: integer('stock').default(0).notNull(),
});

// 11. Tags Table
export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  type: varchar('type').notNull(),
});

// 12. Product Tag Table (Many-to-Many Join)
export const productTag = pgTable('product_tag', {
  productId: uuid('product_id').references(() => products.id).notNull(),
  tagId: uuid('tag_id').references(() => tags.id).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.productId, table.tagId] }),
}));

// 13. Audit Log Table
export const auditLog = pgTable('audit_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  storeId: uuid('store_id').references(() => stores.id),
  action: varchar('action').notNull(),
  details: jsonb('details').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 14. Orders Table
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  storeId: uuid('store_id').references(() => stores.id).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  orderStatus: orderStatusEnum('order_status').default('PENDING').notNull(),
  address: text('address').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 15. Order Item Table
export const orderItem = pgTable('order_item', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  productVariantId: uuid('product_variant_id').references(() => productVariant.id).notNull(),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: integer('price_at_purchase').notNull(),
});

// 16. Cart Table
export const cart = pgTable('cart', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  productVariantId: uuid('product_variant_id').references(() => productVariant.id).notNull(),
  quantity: integer('quantity').default(1).notNull(),
});

// 17. Favourite Wishlist Table
export const favouriteWishlist = pgTable('favourite_wishlist', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  productVariantId: uuid('product_variant_id').references(() => productVariant.id).notNull(),
});