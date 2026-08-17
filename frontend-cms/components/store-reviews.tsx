'use client';

import { useState } from 'react';

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Hamza Khan',
    rating: 5,
    date: '2 days ago',
    comment: 'Exceptional build quality and very fast delivery. Exceeded my expectations!',
    verified: true,
  },
  {
    id: '2',
    name: 'Ayesha Malik',
    rating: 5,
    date: '1 week ago',
    comment: 'Authentic item. Packaging was very neat and secure. Will definitely buy again.',
    verified: true,
  },
  {
    id: '3',
    name: 'Bilal Ahmed',
    rating: 4,
    date: '2 weeks ago',
    comment: 'Value for money product. Works perfectly as advertised.',
    verified: true,
  },
];

export function StoreReviews({ storeName }: { storeName?: string }) {
  const [reviews] = useState<Review[]>(DEFAULT_REVIEWS);

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section className="mt-12 rounded-[28px] border border-store-border bg-store-card p-6 md:p-8">
      <div className="flex flex-col gap-4 border-b border-store-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-store-foreground store-heading">
            Customer Reviews
          </h2>
          <p className="mt-1 text-sm text-store-muted">
            Verified ratings & feedback from {storeName || 'our'} shoppers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center text-amber-400 text-lg">★★★★★</div>
          <span className="text-2xl font-bold text-store-foreground">{averageRating}</span>
          <span className="text-sm text-store-muted">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col justify-between rounded-2xl border border-store-border bg-store-background p-5"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 text-sm">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
                <span className="text-xs text-store-muted">{review.date}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-store-foreground">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-store-border/60 pt-3">
              <span className="font-semibold text-sm text-store-foreground">{review.name}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  ✓ Verified Buyer
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}