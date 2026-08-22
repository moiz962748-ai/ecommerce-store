'use client';

import { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';

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
    name: 'Maham Tariq',
    rating: 5,
    date: '2 days ago',
    comment: 'Exceptional pure fabric quality and exact fit. The hand embroidery exceeded my expectations!',
    verified: true,
  },
  {
    id: '2',
    name: 'Ayesha Malik',
    rating: 5,
    date: '1 week ago',
    comment: 'Authentic raw silk ensemble. Packaging in the luxury garment bag was very neat and secure.',
    verified: true,
  },
  {
    id: '3',
    name: 'Bilal Ahmed',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Great craftsmanship and prompt delivery across Islamabad. Perfect drape and stitching.',
    verified: true,
  },
];

export function StoreReviews({ storeName }: { storeName?: string }) {
  const [reviews] = useState<Review[]>(DEFAULT_REVIEWS);

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section className="mt-12 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            Customer Reviews
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Verified ratings & feedback from {storeName || 'our'} patrons
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center text-foreground gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-foreground text-foreground" />
            ))}
          </div>
          <span className="text-2xl font-black text-foreground">{averageRating}</span>
          <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-accent/30 p-5 transition-all duration-300 hover:border-foreground/20 hover:shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex text-foreground gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-foreground text-foreground" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-border" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90 italic">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
              <span className="font-bold text-sm text-foreground">{review.name}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <CheckCircle size={12} className="text-foreground" />
                  Verified Patron
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}