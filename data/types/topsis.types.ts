export interface TopsisAlternative {
  kelurahan: string;
  kecamatan: string;
  total: number;
  berNib: number;
  C1: number; // Kepadatan penduduk per kelurahan
  C2: number; // Tingkat kompetisi produk sejenis
  C3: number; // Total UMKM per kelurahan
  C4: number; // Pusat perdagangan per kelurahan
  [key: string]: string | number;
}

export interface TopsisResult extends TopsisAlternative {
  distancePositives: number;
  distanceNegatives: number;
  score: number;
  rank: number;
}

export interface TopsisDetail {
  decisionMatrix: number[][];
  normalizedMatrix: number[][];
  weightedMatrix: number[][];
  idealPositives: number[];
  idealNegatives: number[];
  distancePositives: number[];
  distanceNegatives: number[];
  preferenceScores: number[];
  results: TopsisResult[];
}

export interface TopsisRecommendationByCluster {
  targetCluster: number;
  allClusterScores: {
    cluster: number;
    avgSector: number;
  }[];
  detail: TopsisDetail;
}
