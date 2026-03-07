'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { fetchGroceryProducts } from '@/lib/insights';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import type { GroceryProduct } from '@/lib/types';

const DEFAULT_VISIBLE = 10;

export default function ProductsTable() {
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGroceryProducts();
        setProducts(data);
      } catch {
        // toast already shown
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (products.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="No products yet"
        description="Scan a receipt to start tracking your purchases."
      />
    );
  }

  const sorted = [...products].sort((a, b) => b.total - a.total);
  const visible = expanded ? sorted : sorted.slice(0, DEFAULT_VISIBLE);
  const hasMore = sorted.length > DEFAULT_VISIBLE;

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-base font-semibold text-text mb-4">
        Products Purchased
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-accent/15">
              <th className="text-left font-semibold text-accent py-2 pr-4">
                Product
              </th>
              <th className="text-right font-semibold text-accent py-2 px-3">
                Qty
              </th>
              <th className="text-right font-semibold text-accent py-2 px-3">
                Avg Price
              </th>
              <th className="text-right font-semibold text-accent py-2 pl-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => (
              <tr
                key={product.name}
                className="border-b border-white/5 last:border-none"
              >
                <td className="py-2.5 pr-4 text-text font-medium">
                  {product.name}
                </td>
                <td className="py-2.5 px-3 text-right text-text-muted">
                  {product.quantity}
                </td>
                <td className="py-2.5 px-3 text-right text-text-muted">
                  &euro;{product.avgPrice.toFixed(2)}
                </td>
                <td className="py-2.5 pl-3 text-right text-text font-medium">
                  &euro;{product.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors mx-auto"
        >
          {expanded ? (
            <>
              Show less
              <ChevronUp size={14} />
            </>
          ) : (
            <>
              Show more ({sorted.length - DEFAULT_VISIBLE} more)
              <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
