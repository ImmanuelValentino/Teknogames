"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LayoutWrapper from "./LayoutWrapper";
import AdBottomAnchor from "../ads/AdBottomAnchor";
import SearchModal from "../game/SearchModal";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#255dce]/30 selection:text-white">
      {/* Navbar Resmi */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      {/* Main Content dengan Floating Side Ads Terkunci */}
      <LayoutWrapper>{children}</LayoutWrapper>

      {/* Mobile Anchor Ad */}
      <AdBottomAnchor />

      {/* Search Modal Saja (Papan Skor & Favorit sudah mandiri di halaman beranda) */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Footer Resmi */}
      <Footer />
    </div>
  );
}
