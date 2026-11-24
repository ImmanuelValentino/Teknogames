"use client";

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LayoutWrapper from "./LayoutWrapper";

const AdBottomAnchor = dynamic(() => import("../ads/AdBottomAnchor"), {
  ssr: false,
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[#ce2541]/30 selection:text-white">
      {/* Navbar Resmi */}
      <Navbar />

      {/* Main Content dengan Floating Side Ads Terkunci */}
      <LayoutWrapper>{children}</LayoutWrapper>

      {/* Mobile Anchor Ad */}
      <AdBottomAnchor />

      {/* Footer Resmi */}
      <Footer />
    </div>
  );
}
