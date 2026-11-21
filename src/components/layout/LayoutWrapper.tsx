import React from "react";
import AdSkyscraper from "../ads/AdSkyscraper";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="relative pb-4 md:pb-0">
      {/* Floating Side Ads di luar margin layar lebar (>= 1680px), aman tanpa bentrok konten */}
      <AdSkyscraper position="left" />

      {/* Konten Utama Terpusat dan Bersih */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <AdSkyscraper position="right" />
    </div>
  );
}
