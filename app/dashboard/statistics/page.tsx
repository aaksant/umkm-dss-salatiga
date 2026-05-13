"use client";

import {
  ClusterResultTable,
  ElbowChart
} from "@/components/dashboard/statistics/figures";
import KMeansClusterSlider from "@/components/dashboard/statistics/kmeans-cluster-slider";
import { calculateElbowData, runMultipleKMeans } from "@/lib/kmeans";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function StatisticPage() {
  // Jumlah cluster
  const [K, setK] = useState(3);
  const [isComputing, setIsComputing] = useState(false);

  const clusteringResult = useMemo(() => {
    setIsComputing(true);
    const result = runMultipleKMeans(K);
    setIsComputing(false);
    return result;
  }, [K]);
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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="font-bold tracking-tight text-3xl mb-6">Statistik</h1>
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-xl">K-Means</h3>
            <p className="text-sm text-muted-foreground">
              Visualisasi hasil clustering K-Means pada 23 kelurahan di Kota
              Salatiga. Geser slider untuk melihat perbedaan.
            </p>
          </div>
          <KMeansClusterSlider
            K={K}
            silhouette={clusteringResult.silhouette}
            onKChange={(newK) => setK(newK)}
          />
        </div>

        {isComputing && (
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {/* Presentasi */}
        <ElbowChart elbowData={elbowData} />
        <ClusterResultTable tableData={tableData} />
      </div>
    </div>
  );
}
