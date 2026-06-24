"use client";

import AhpDetailsDropdown from "@/components/result/ahp-detail-dropdown";
import RecommendationTable from "@/components/result/recommendation-table";
import ResultHeader from "@/components/result/result-header";
import TopResultDropdown from "@/components/result/top-result-dropdown";
import TopsisDetailDropdown from "@/components/result/topsis-detail-dropdown";
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
    <div className="grid min-h-[80vh] place-items-center overflow-y-hidden px-4">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B8453D]/10">
          <TriangleAlert className="h-6 w-6 text-[#B8453D]" />
        </div>
        <div className="space-y-1">
          <h1 className="font-display text-xl font-bold tracking-tight text-[#23262B]">
            Harap isi profil bisnis Anda
          </h1>
          <p className="font-sans text-sm text-[#23262B]/70">
            Sistem membutuhkan profil usaha Anda untuk membuat rekomendasi
            distribusi.
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="mt-2 bg-[#28344A] font-sans font-medium text-[#EEF0E8] hover:bg-[#28344A]/90"
        >
          <Link href="/dashboard/profile-input">
            Input profil <ArrowUpRight className="ml-1 h-4 w-4" />
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

  useEffect(() => {
    loadDssResult();
  }, []);

  if (!dssResult) return <NoInputInfo />;

  const topResult = dssResult.topsisRecommendation.detail.results[0];

  return (
    <div className="mx-auto max-w-4xl p-4 font-sans md:p-6">
      <ResultHeader dssResult={dssResult} />
      <div className="space-y-6">
        <TopResultDropdown
          dssResult={dssResult}
          topResult={topResult}
          isTopResultOpen={isTopResultOpen}
          onOpenChange={() => setIsTopResultOpen(!isTopResultOpen)}
        />

        <MapView dssResult={dssResult} />

        <RecommendationTable dssResult={dssResult} />

        <AhpDetailsDropdown
          dssResult={dssResult}
          isAhpDetailOpen={isAhpDetailOpen}
          onOpenChange={() => setIsAhpDetailOpen(!isAhpDetailOpen)}
        />

        <TopsisDetailDropdown
          dssResult={dssResult}
          isTopsisDetailOpen={isTopsisDetailOpen}
          onOpenChange={() => setIsTopsisDetailOpen(!isTopsisDetailOpen)}
        />
      </div>
    </div>
  );
}
