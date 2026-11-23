"use client";

import React, { useEffect, useRef } from "react";

interface GoogleAdSlotProps {
  slotType:
    | "leaderboard-1080x90"
    | "leaderboard-728x90"
    | "rectangle-300x250"
    | "skyscraper-160x600"
    | "mobile-anchor-320x50"
    | "native-grid"
    | "billboard-970x250";
  adSlot?: string;
  adClient?: string;
  className?: string;
}

export default function GoogleAdSlot({
  slotType,
  adSlot,
  adClient,
  className = "",
}: GoogleAdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const client = adClient || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
  const slot = adSlot || "";

  useEffect(() => {
    // Jalankan adsbygoogle push hanya jika client id & slot id sudah dimasukkan
    if (client && slot && typeof window !== "undefined") {
      try {
        const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
        adsbygoogle.push({});
      } catch {
        // Adsense sudah terinisialisasi
      }
    }
  }, [client, slot]);

  // Dimensi terkunci ketat anti-CLS sesuai standar IAB / Google Display Network
  switch (slotType) {
    case "leaderboard-1080x90":
      return (
        <div className={`w-full flex flex-col items-center my-6 ${className}`}>
          <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1 select-none font-medium">
            Iklan
          </span>
          <div
            style={{ minHeight: "90px", width: "100%", maxWidth: "1080px" }}
            className="w-full max-w-[1080px] h-[90px] min-h-[90px] rounded-xl border border-dashed border-white/20 bg-white/[0.03] flex flex-col items-center justify-center p-2 text-center overflow-hidden relative"
          >
            {client && slot ? (
              <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "inline-block", width: "100%", maxWidth: "1080px", height: "90px" }}
                data-ad-client={client}
                data-ad-slot={slot}
              />
            ) : (
              <div className="space-y-0.5 select-none">
                <span className="text-xs font-semibold text-white/80 block">
                  Slot Google AdSense (1080 × 90)
                </span>
                <span className="text-[10px] text-white/40 block">
                  Tinggal masukkan data-ad-client &amp; data-ad-slot untuk menampilkan iklan
                </span>
              </div>
            )}
          </div>
        </div>
      );

    case "leaderboard-728x90":
      return (
        <div className={`w-full flex flex-col items-center my-6 ${className}`}>
          <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1 select-none font-medium">
            Iklan
          </span>
          <div
            style={{ minHeight: "90px", width: "100%", maxWidth: "1080px" }}
            className="w-full max-w-[1080px] h-[90px] min-h-[90px] rounded-xl border border-dashed border-white/20 bg-white/[0.03] flex flex-col items-center justify-center p-2 text-center overflow-hidden relative"
          >
            {client && slot ? (
              <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "inline-block", width: "100%", maxWidth: "1080px", height: "90px" }}
                data-ad-client={client}
                data-ad-slot={slot}
              />
            ) : (
              <div className="space-y-0.5 select-none">
                <span className="text-xs font-semibold text-white/80 block">
                  Slot Google AdSense (1080 × 90)
                </span>
                <span className="text-[10px] text-white/40 block">
                  Tinggal masukkan data-ad-client &amp; data-ad-slot untuk menampilkan iklan
                </span>
              </div>
            )}
          </div>
        </div>
      );

    case "rectangle-300x250":
      return (
        <div className={`flex flex-col items-center ${className}`}>
          <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1 select-none font-medium">
            Iklan
          </span>
          <div
            style={{ width: "300px", height: "250px", minHeight: "250px" }}
            className="w-[300px] h-[250px] min-h-[250px] rounded-2xl border border-dashed border-white/20 bg-white/[0.03] flex flex-col items-center justify-center p-4 text-center overflow-hidden relative shadow-sm"
          >
            {client && slot ? (
              <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "inline-block", width: "300px", height: "250px" }}
                data-ad-client={client}
                data-ad-slot={slot}
              />
            ) : (
              <div className="space-y-1 select-none">
                <span className="text-xs font-semibold text-white/80 block">
                  Slot Google AdSense (300 × 250)
                </span>
                <span className="text-[10px] text-white/40 block max-w-[220px] mx-auto leading-relaxed">
                  Medium Rectangle Ad • Siap menghubungkan kode unit iklan Google
                </span>
              </div>
            )}
          </div>
        </div>
      );

    case "skyscraper-160x600":
      return (
        <div className={`flex flex-col items-center ${className}`}>
          <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1 select-none font-medium">
            Iklan
          </span>
          <div
            style={{ width: "160px", height: "600px", minHeight: "600px" }}
            className="w-[160px] h-[600px] min-h-[600px] rounded-2xl border border-dashed border-white/20 bg-white/[0.03] flex flex-col items-center justify-center p-3 text-center overflow-hidden relative shadow-sm"
          >
            {client && slot ? (
              <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "inline-block", width: "160px", height: "600px" }}
                data-ad-client={client}
                data-ad-slot={slot}
              />
            ) : (
              <div className="space-y-1.5 select-none">
                <span className="text-xs font-semibold text-white/80 block">
                  Slot AdSense
                </span>
                <span className="text-[11px] font-medium text-white/60 block">
                  160 × 600
                </span>
                <span className="text-[9px] text-white/40 block leading-tight mt-2">
                  Skyscraper Banner Siap Pasang
                </span>
              </div>
            )}
          </div>
        </div>
      );

    case "mobile-anchor-320x50":
      return (
        <div className={`w-full flex flex-col items-center ${className}`}>
          <div
            style={{ width: "100%", maxWidth: "320px", height: "50px", minHeight: "50px" }}
            className="h-[50px] min-h-[50px] w-full max-w-[320px] rounded-lg border border-dashed border-white/20 bg-white/[0.04] flex items-center justify-center px-2 text-center overflow-hidden relative"
          >
            {client && slot ? (
              <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "inline-block", width: "100%", maxWidth: "320px", height: "50px" }}
                data-ad-client={client}
                data-ad-slot={slot}
              />
            ) : (
              <div className="select-none flex items-center gap-2">
                <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white/50 uppercase font-semibold">
                  Iklan
                </span>
                <span className="text-xs font-medium text-white/70">
                  Google AdSense Anchor (320 × 50)
                </span>
              </div>
            )}
          </div>
        </div>
      );

    case "native-grid":
    default:
      return (
        <div className={`group relative rounded-2xl overflow-hidden border border-dashed border-white/20 bg-white/[0.03] flex flex-col justify-between aspect-square p-4 transition-all ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
              Iklan
            </span>
          </div>

          <div className="my-auto text-center space-y-1 select-none">
            {client && slot ? (
              <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-format="fluid"
                data-ad-layout-key="-fb+5w+4e-db+86"
                data-ad-client={client}
                data-ad-slot={slot}
              />
            ) : (
              <>
                <span className="text-xs font-semibold text-white/80 block">
                  In-Feed Native Ad
                </span>
                <p className="text-[11px] text-white/40 leading-relaxed max-w-[180px] mx-auto">
                  Slot Iklan AdSense Grid • Siap konfigurasi data-ad-slot
                </p>
              </>
            )}
          </div>

          <div className="text-center">
            <span className="text-[10px] text-white/30 block">
              Google Ad Unit
            </span>
          </div>
        </div>
      );
  }
}
