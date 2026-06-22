import { AHPCriteria } from "@/data/types/ahp.types";
import { ProcessedKelurahanPct, Sektor } from "@/data/types/kelurahan.types";
import { ClusterResult } from "@/data/types/kmeans.types";
import { ahpCriteria } from "./ahp";
import {
  TopsisAlternative,
  TopsisDetail,
  TopsisRecommendationByCluster,
  TopsisResult
} from "@/data/types/topsis.types";

export function createAlternatives(
  processedKelurahan: ProcessedKelurahanPct[],
  targetSektor: Sektor
): TopsisAlternative[] {
  // Hasil return kira-kira seperti ini:
  // [
  //   { kelurahan: "Tingkir Tengah", C1: 15000, C2: 45, C3: 350, C4: 1, ... },
  //   { kelurahan: "Sidorejo Lor", C1: 18500, C2: 60, C3: 420, C4: 0, ... },
  //   { kelurahan: "Ledok", C1: 10969, C2: 21, C3: 1710, C4: 0, ... }
  // ];
  return processedKelurahan.map((kelurahan) => {
    const sektorCount = (kelurahan[targetSektor] as number) || 0;
    return {
      kelurahan: kelurahan.kelurahan,
      kecamatan: kelurahan.kecamatan,
      total: kelurahan.totalUsaha,
      berNib: kelurahan.berNib,
      C1: kelurahan.populasi as number,
      C2: sektorCount,
      C3: kelurahan.totalUsaha,
      C4: kelurahan.pasar
    };
  });
}

export function topsis(
  alternatives: TopsisAlternative[],
  criterias: AHPCriteria[],
  weights: Record<string, number>
): TopsisDetail {
  /*
   * Pembuatan decision matrix
   * Dari alternatives yang bentuknya array isi object, diubah jadi seperti ini:
   * [
   *  [5281, 187, 717, 0], C1 = 5281, C2 = 187, C3 = 717, C4 = 0
   *  ... untuk setiap kelurahan
   * ]
   */
  const decisionMatrix = alternatives.map((alt) =>
    criterias.map((criteria) => alt[criteria.id] as number)
  );
  /*
   * Normalisasi decisionMatrix
   * decisionMatrix per nilai per baris dikuadrat, sum, terus diakar
   * Contoh untuk baris pertama:
   * sum = 5281^2 + 187^2 + 717^2 + 0^2
   * n = sqrt(num)
   * [46193.44065990322, 1518.9618165049442, 5978.545977075028, 6]
   */
  const normalizedCols = criterias.map((_, j) =>
    Math.sqrt(decisionMatrix.reduce((sum, row) => sum + row[j] ** 2, 0))
  );
  /*
   * decisionMatrix per nilai per baris dibagi
   * [5281/46193, 187/1518, ...]
   */
  const normalizedMatrix = decisionMatrix.map((row) =>
    row.map((val, j) => val / (normalizedCols[j] || 1))
  );
  /*
   * Weighted normalized matrix
   * yij = wij * rij
   * wij = bobot dari kriteria ke-i (dari AHP)
   * rij = elemen dari normalizedMatrix
   * ================================================
   * Contoh:
   * [0.114323, 0.12311, 0.119928, 0] -> C1, C2, C3, C4 dari normalizedMatrix
   * weights = { C1: 0.465, C2: 0.277, C3: 0.161, C4: 0.095 }
   * Dikalikan per kriteria sehingga:
   * y11 = w11 * r11 = 0.114323 * 0.465 = 0.53160195
   * Dilakukan untuk setiap keluar sehingga nanti akhirnya:
   * [
   *  [0.05232541, ...] Kelurahan 1
   *  ... untuk setiap kelurahan
   * ]
   */
  const weightedMatrix = normalizedMatrix.map((row) =>
    row.map((val, j) => val * weights[criterias[j].id])
  );
  /*
   * Ideal positif (A+) dan negatif (A-)
   * a hypothetical, optimal solution that maximizes benefit criteria and minimizes cost criteria
   */
  const idealPositives = criterias.map((criteria, j) => {
    const values = weightedMatrix.map((row) => row[j]);
    return criteria.type === "benefit"
      ? Math.max(...values)
      : Math.min(...values);
  });
  const idealNegatives = criterias.map((c, j) => {
    const values = weightedMatrix.map((row) => row[j]);
    return c.type === "benefit" ? Math.min(...values) : Math.max(...values);
  });
  /*
   * Jarak antara Nilai Terbobot Setiap Alternatif terhadap solusi ideal positif
   * Contoh:
   * weightedMatrix[0] = [0.05, 0.03, 0.01, 0] <- berlaku untuk semua index
   * idealPositives = [0.17, 0.004, 0.06, 0.06]
   *
   * 1. Selisih antara matrix dan idealPositives
   * [-0.12, 0.026, -0,05, -0.06]
   *
   * 2. Dikuadrat
   * [0.0144, 0.000676, 0.0025, 0.0036]
   *
   * 3. Sum
   * 0.021175999999999997
   *
   * 4. Akar
   * 0.14551975810864998
   */
  const distancePositives = weightedMatrix.map((row) =>
    Math.sqrt(
      row.reduce((sum, val, j) => sum + (val - idealPositives[j]) ** 2, 0)
    )
  );
  const distanceNegatives = weightedMatrix.map((row) =>
    Math.sqrt(
      row.reduce((sum, val, j) => sum + (val - idealNegatives[j]) ** 2, 0)
    )
  );
  /*
   * Nilai preferensi
   * Vi = distanceNegatives[i] / distanceNegatives[i] + distancePositives[i]
   */
  const preferenceScores = alternatives.map(
    (_, i) =>
      distanceNegatives[i] / (distancePositives[i] + distanceNegatives[i] || 1)
  );
  /*
   * Pemeringkatan
   */
  const results: TopsisResult[] = alternatives.map((alt, i) => ({
    ...alt,
    distancePositives: distancePositives[i],
    distanceNegatives: distanceNegatives[i],
    score: preferenceScores[i],
    rank: 0
  }));

  results.sort((a, b) => b.score - a.score);
  results.forEach((result, i) => (result.rank = i + 1));

  return {
    decisionMatrix,
    normalizedMatrix,
    weightedMatrix,
    idealPositives,
    idealNegatives,
    distancePositives,
    distanceNegatives,
    preferenceScores,
    results
  };
}

export function getTopsisRecommendationByCluster(
  sektor: Sektor,
  clusterResult: ClusterResult,
  ahpWeights: Record<string, number>
): TopsisRecommendationByCluster {
  const sectorKey = sektor + "_pct";
  // Group by cluster
  const clusterGroups: Record<number, ProcessedKelurahanPct[]> = {};

  clusterResult.dataPointAssignments.forEach((cluster, i) => {
    if (!clusterGroups[cluster]) {
      clusterGroups[cluster] = [];
    }
    clusterGroups[cluster].push(clusterResult.processedData[i]);
  });

  // Score each cluster menggunakan perbandingan terhadap kompetisi
  const clusterScores = Object.entries(clusterGroups).map(
    ([cluster, points]) => {
      const avgSector =
        points.reduce(
          (sum, point) => sum + ((point[sectorKey] as number) || 0),
          0
        ) / points.length;
      const avgTotalUnits =
        points.reduce(
          (sum, point) => sum + ((point["total_units"] as number) || 0),
          0
        ) / points.length;
      const score = avgTotalUnits / (avgSector + 1);

      return {
        cluster: parseInt(cluster),
        avgSector,
        avgTotalUnits,
        score,
        points
      };
    }
  );
  clusterScores.sort((a, b) => b.score - a.score);

  const target = clusterScores[0];
  // Build decision matrix from target cluster's kelurahan
  const alternatives = createAlternatives(target.points, sektor);
  // Run TOPSIS
  const topsisDetail = topsis(alternatives, ahpCriteria, ahpWeights);

  return {
    targetCluster: target.cluster,
    allClusterScores: clusterScores.map((clusterScore) => ({
      cluster: clusterScore.cluster,
      avgSector: clusterScore.avgSector,
      avgTotalUnits: clusterScore.avgTotalUnits,
      score: clusterScore.score
    })),
    detail: topsisDetail
  };
}
