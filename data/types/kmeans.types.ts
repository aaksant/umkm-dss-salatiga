import { ProcessedKelurahanPct } from "./kelurahan.types";

export interface ClusterResult {
  dataPointAssignments: number[];
  centroids: number[][];
  silhouette: number;
  k: number;
  processedData: ProcessedKelurahanPct[];
  wcss: number;
}

export interface ClusterInfo {
  id: number;
  label: string;
  description: string;
  color: string;
  kelurahanList: ProcessedKelurahanPct[];
  avgStats: Record<string, number>;
}

export interface ScoredCluster extends ClusterInfo {
  score: number;
  avgSector: number;
  avgTotal: number;
  avgNib: number;
}
