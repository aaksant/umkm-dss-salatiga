"use client";

import {
  ClusterResultTable,
  ElbowChart
} from "@/components/dashboard/statistics/figures";
import KMeansClusterSlider from "@/components/dashboard/statistics/kmeans-cluster-slider";
import { calculateElbowData, runMultipleKMeans } from "@/lib/kmeans";
import { Loader2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

export default function StatisticPage() {
  // Jumlah cluster
  const [K, setK] = useState(3);
  const [clusteringResult, setClusteringResult] = useState(() =>
    runMultipleKMeans(3)
  );
  const [isKPending, startTransition] = useTransition();

  const elbowData = useMemo(() => calculateElbowData(), []);
  const tableData = clusteringResult.processedData
    .map((data, i) => ({
      kelurahan: data.kelurahan,
      kecacmatan: data.kecamatan,
      totalUsaha: data.totalUsaha,
      berNib: data.berNib,
      populasi: data.populasi,
      cluster: clusteringResult.dataPointAssignments[i]
    }))
    .sort((a, b) => b.cluster - a.cluster || b.totalUsaha - a.totalUsaha);

  const handleKChange = (newK: number) => {
    setK(newK);
    startTransition(() => {
      setClusteringResult(runMultipleKMeans(newK));
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <h1 className="mb-2 font-display text-3xl font-bold tracking-tight text-[#23262B]">
        Statistik Analisis
      </h1>
      <p className="mb-8 text-[#23262B]/70">
        Parameter dan hasil segmentasi wilayah menggunakan algoritma K-Means.
      </p>

      <div className="space-y-8">
        <div className="space-y-4 rounded-xl border border-[#28344A]/10 bg-white p-5 shadow-sm">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#23262B]">
              Parameter K-Means
            </h3>
            <p className="mt-1 text-sm text-[#23262B]/70">
              Visualisasi hasil clustering pada 23 kelurahan di Kota Salatiga.
              Geser slider untuk melihat perbedaan jumlah segmen.
            </p>
          </div>
          <KMeansClusterSlider
            K={K}
            silhouette={clusteringResult.silhouette}
            onKChange={handleKChange}
          />
        </div>

        {isKPending && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-8 w-8 motion-safe:animate-spin text-[#28344A]" />
          </div>
        )}

        {/* Presentasi Data */}
        <div
          className={
            isKPending ? "opacity-50 transition-opacity" : "transition-opacity"
          }
        >
          <ElbowChart elbowData={elbowData} />
          <div className="mt-8">
            <ClusterResultTable tableData={tableData} />
          </div>
        </div>
      </div>
    </div>
  );
}
