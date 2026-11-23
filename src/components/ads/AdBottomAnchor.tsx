"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import GoogleAdSlot from "./GoogleAdSlot";

export default function AdBottomAnchor() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none md:hidden"
      aria-label="Iklan Bawah Layar"
    >
      <div
        style={{ minHeight: "60px" }}
        className="pointer-events-auto relative mx-auto flex h-[60px] w-full max-w-[384px] items-center gap-1 overflow-hidden rounded-t-xl border-x border-t border-white/10 bg-[#47141d] px-1 py-1 shadow-xl"
      >
        <div className="min-w-0 flex-1">
          <GoogleAdSlot
            slotType="mobile-anchor-320x50"
            adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ANCHOR || ""}
          />
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Tutup Iklan"
          title="Tutup Iklan"
          className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#202127] text-white shadow-md transition-colors hover:bg-[#303139] cursor-pointer"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </aside>
  );
}
