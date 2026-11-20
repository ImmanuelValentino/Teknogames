"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, EyeOff, Eye } from "lucide-react";
import GoogleAdSlot from "./GoogleAdSlot";

export default function AdBottomAnchor() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none transition-transform duration-200 md:hidden ${
        isCollapsed ? "translate-y-[calc(100%-44px)]" : "translate-y-0"
      }`}
      aria-label="Iklan Bawah Layar"
    >
      <div className="pointer-events-auto flex items-center justify-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Tampilkan Iklan" : "Sembunyikan Iklan"}
          className="min-h-11 rounded-t-xl bg-[#5e1824] px-3 text-[10px] font-medium text-slate-200 border-t border-x border-white/10 shadow-md flex items-center gap-1.5 cursor-pointer transition-colors hover:bg-[#752432]"
        >
          {isCollapsed ? (
            <>
              <Eye className="w-3 h-3 text-[#ff8c9f]" />
              <span>Tampilkan Iklan</span>
              <ChevronUp className="w-3 h-3 text-slate-400" />
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3 text-rose-300" />
              <span>Sembunyikan Iklan</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </>
          )}
        </button>
      </div>

      <div
        style={{ minHeight: "60px" }}
        className="pointer-events-auto w-full max-w-sm mx-auto bg-[#47141d] border-t border-x border-white/10 shadow-xl rounded-t-xl overflow-hidden px-3 py-2 flex items-center justify-center"
      >
        <GoogleAdSlot
          slotType="mobile-anchor-320x50"
          adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ANCHOR || ""}
        />
      </div>
    </aside>
  );
}
