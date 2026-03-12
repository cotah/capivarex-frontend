'use client';

import Image from 'next/image';
import Link from 'next/link';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 sm:px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Image
              src="/logo-horizontal.png"
              alt="CAPIVAREX"
              width={120}
              height={30}
              className="h-8 w-auto object-contain mb-3"
            />
            <p className="text-sm text-text-muted leading-relaxed max-w-[200px]">
              Your AI-powered life assistant. One conversation, every service.
            </p>
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-text uppercase tracking-wider mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-sm text-text-muted/50">
            &copy; 2026 CAPIVAREX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
