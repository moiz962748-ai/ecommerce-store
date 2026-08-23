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
    comment: 'Exceptional quality and exact fit. The craftsmanship exceeded my expectations!',
    verified: true,
  },
  {
    id: '2',
    name: 'Ayesha Malik',
    rating: 5,
    date: '1 week ago',
    comment: 'Authentic items and fast delivery. Packaging was very neat and secure.',
    verified: true,
  },
  {
    id: '3',
    name: 'Bilal Ahmed',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Great build quality and prompt delivery across Islamabad. Highly recommended.',
    verified: true,
  },
];

export function StoreReviews({
  storeName,
  subdomain,
}: {
  storeName?: string;
  subdomain?: string;
}) {
  const [reviews] = useState<Review[]>(DEFAULT_REVIEWS);

  const lowerSub = (subdomain || '').toLowerCase();
  const isBoutique = lowerSub.includes('boutique') || lowerSub.includes('luxury');
  const isSports = lowerSub.includes('sport');
  const isClothing = lowerSub.includes('cloth');

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section
      className={`mt-12 rounded-3xl border p-6 md:p-8 shadow-xs ${
        isBoutique
          ? 'border-border bg-card'
          : isSports
          ? 'border-emerald-200/80 bg-white'
          : isClothing
          ? 'border-purple-200/80 bg-white'
          : 'border-slate-200/80 bg-white'
      }`}
    >
      <div
        className={`flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between ${
          isBoutique ? 'border-border' : 'border-slate-200'
        }`}
      >
        <div>
          <h2 className={`text-2xl font-black tracking-tight ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
            Customer Reviews
          </h2>
          <p className={`mt-1 text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
            Verified ratings & feedback from {storeName || 'our'} patrons
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-0.5 ${
              isBoutique
                ? 'text-foreground'
                : isSports
                ? 'text-emerald-600'
                : isClothing
                ? 'text-purple-600'
                : 'text-sky-600'
            }`}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-current text-current" />
            ))}
          </div>
          <span className={`text-2xl font-black ${isBoutique ? 'text-foreground' : 'text-slate-950'}`}>
            {averageRating}
          </span>
          <span className={`text-sm ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
            ({reviews.length} reviews)
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 shadow-xs hover:-translate-y-1 ${
              isBoutique
                ? 'border-border bg-accent/30 hover:border-foreground/20 hover:shadow-xs'
                : isSports
                ? 'border-emerald-100 bg-[#f4fbf7] hover:border-emerald-300'
                : isClothing
                ? 'border-purple-100 bg-[#faf7fc] hover:border-purple-300'
                : 'border-slate-100 bg-[#f8fafc] hover:border-sky-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div
                  className={`flex gap-0.5 ${
                    isBoutique
                      ? 'text-foreground'
                      : isSports
                      ? 'text-emerald-600'
                      : isClothing
                      ? 'text-purple-600'
                      : 'text-sky-600'
                  }`}
                >
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current text-current" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <Star key={i} size={14} className={isBoutique ? 'text-border' : 'text-slate-200'} />
                  ))}
                </div>
                <span className={`text-xs ${isBoutique ? 'text-muted-foreground' : 'text-slate-400'}`}>
                  {review.date}
                </span>
              </div>
              <p className={`mt-3 text-sm leading-relaxed italic ${isBoutique ? 'text-foreground/90' : 'text-slate-700'}`}>
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            <div
              className={`mt-5 flex items-center justify-between border-t pt-3 ${
                isBoutique ? 'border-border' : 'border-slate-200/70'
              }`}
            >
              <span className={`font-bold text-sm ${isBoutique ? 'text-foreground' : 'text-slate-900'}`}>
                {review.name}
              </span>
              {review.verified && (
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${isBoutique ? 'text-muted-foreground' : 'text-slate-500'}`}>
                  <CheckCircle
                    size={12}
                    className={
                      isBoutique
                        ? 'text-foreground'
                        : isSports
                        ? 'text-emerald-600'
                        : isClothing
                        ? 'text-purple-600'
                        : 'text-sky-600'
                    }
                  />
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