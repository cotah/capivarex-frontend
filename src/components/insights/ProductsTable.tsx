'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Product {
  name: string;
  quantity: number;
  avgPrice: number;
  total: number;
}

const MOCK_PRODUCTS: Product[] = [
  { name: 'Chicken', quantity: 5, avgPrice: 7.99, total: 39.95 },
  { name: 'Milk 1L', quantity: 8, avgPrice: 1.49, total: 11.92 },
  { name: 'Bread', quantity: 6, avgPrice: 1.79, total: 10.74 },
  { name: 'Eggs 12pk', quantity: 3, avgPrice: 3.49, total: 10.47 },
  { name: 'Bananas', quantity: 7, avgPrice: 1.15, total: 8.05 },
  { name: 'Rice 1kg', quantity: 2, avgPrice: 2.29, total: 4.58 },
  { name: 'Tomatoes', quantity: 4, avgPrice: 0.99, total: 3.96 },
  { name: 'Pasta 500g', quantity: 3, avgPrice: 1.19, total: 3.57 },
  { name: 'Olive Oil', quantity: 1, avgPrice: 5.99, total: 5.99 },
  { name: 'Onions 1kg', quantity: 3, avgPrice: 0.89, total: 2.67 },
  { name: 'Yoghurt', quantity: 6, avgPrice: 0.79, total: 4.74 },
  { name: 'Cheese', quantity: 2, avgPrice: 3.29, total: 6.58 },
  { name: 'Butter', quantity: 2, avgPrice: 2.49, total: 4.98 },
  { name: 'Orange Juice', quantity: 3, avgPrice: 2.19, total: 6.57 },
  { name: 'Potatoes 2kg', quantity: 2, avgPrice: 1.99, total: 3.98 },
];

const DEFAULT_VISIBLE = 10;

export default function ProductsTable() {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...MOCK_PRODUCTS].sort((a, b) => b.total - a.total);
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
                  €{product.avgPrice.toFixed(2)}
                </td>
                <td className="py-2.5 pl-3 text-right text-text font-medium">
                  €{product.total.toFixed(2)}
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
