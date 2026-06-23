"use client";

import AhpDetailsDropdown from "@/components/result/ahp-detail-dropdown";
import RecommendationTable from "@/components/result/recommendation-table";
import TopResultDropdown from "@/components/result/top-result-dropdown";
import TopsisDetailDropdown from "@/components/result/topsis-detail-dropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DSSResult } from "@/data/types/dss.types";
import { ArrowUpRight, TriangleAlert } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";

const MapView = dynamic(() => import("@/components/result/map-view"), {
  ssr: false
});

function NoInputInfo() {
  return (
    <div className="grid min-h-screen place-items-center overflow-y-hidden">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100">
          <TriangleAlert className="text-slate-600" />
        </div>
        <div className="text-center space-y-1">
          <h1 className="font-semibold text-xl tracking-tight">
            Harap isi profil bisnis Anda
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistem membutuhkan profil usaha Anda untuk membuat rekomendasi
          </p>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link href="/dashboard/profile-input">
            Input profil <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const [dssResult, setDssResult] = useState<DSSResult | null>();
  const [isTopResultOpen, setIsTopResultOpen] = useState(false);
  const [isAhpDetailOpen, setIsAhpDetailOpen] = useState(false);
  const [isTopsisDetailOpen, setIsTopsisDetailOpen] = useState(false);

  const loadDssResult = useEffectEvent(() => {
    const stored = localStorage.getItem("dss-result");
    if (stored) {
      setDssResult(JSON.parse(stored));
    }
  });

  // Ambil data localStorage
  useEffect(() => {
    loadDssResult();
  }, []);

  // Kalau dari localStorage null tampilkan fallback
  if (!dssResult) return <NoInputInfo />;

  const topResult = dssResult.topsisRecommendation.detail.results[0];

  return (
    <div className="p-4">
      <div className="space-y-1 mb-6">
        <h1 className="font-bold tracking-tight text-3xl">Hasil Rekomendasi</h1>
        {/* Breadcrumbs */}
        <div className="flex items-center gap-x-2">
          <Badge variant="outline" className="capitalize p-3">
            {dssResult.profile.sektor}
          </Badge>
          <Badge variant="outline" className="capitalize p-3">
            {dssResult.profile.skala}
          </Badge>
          <Badge variant="outline" className="capitalize p-3">
            {dssResult.profile.kecamatan}
          </Badge>
          <Badge variant="outline" className="capitalize p-3">
            {dssResult.profile.namaUsaha}
          </Badge>
        </div>
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Dropdown ranking pertama */}
        <TopResultDropdown
          dssResult={dssResult}
          topResult={topResult}
          isTopResultOpen={isTopResultOpen}
          onOpenChange={() => setIsTopResultOpen(!isTopResultOpen)}
        />
        {/* Leaflet map */}
        <MapView dssResult={dssResult} />
        {/* Full ranking TOPSIS */}
        <RecommendationTable dssResult={dssResult} />
        {/* Detail kriteria AHP */}
        <AhpDetailsDropdown
          dssResult={dssResult}
          isAhpDetailOpen={isAhpDetailOpen}
          onOpenChange={() => setIsAhpDetailOpen(!isAhpDetailOpen)}
        />
        {/* Detail perhitungan TOPSIS */}
        <TopsisDetailDropdown
          dssResult={dssResult}
          isTopsisDetailOpen={isTopsisDetailOpen}
          onOpenChange={() => setIsTopsisDetailOpen(!isTopsisDetailOpen)}
        />
      </div>
    </div>
  );
}
