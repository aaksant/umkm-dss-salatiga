import { kelurahanData, ProcessedKelurahanData } from "@/data/kelurahan";
import {
  mean,
  shuffle,
  silhouette,
  standardDeviation
} from "simple-statistics";

interface ProcessedKelurahanPct extends ProcessedKelurahanData {
  kuliner_pct: number;
  fashion_pct: number;
  agrobisnis_pct: number;
  perdagangan_pct: number;
  nib_pct: number;
  total_norm: number;
  // normalized values
  [key: string]: number | string;
}

type FeatureCol = (typeof featureCols)[number];

const featureCols = [
  "kuliner_pct",
  "fashion_pct",
  "agrobisnis_pct",
  "perdagangan_pct",
  "nib_pct",
  "total_units",
  "populasi",
  "pasar"
];

function convertRawToPct(
  data: ProcessedKelurahanData[]
): ProcessedKelurahanPct[] {
  return data.map((kelurahan) => ({
    ...kelurahan,
    kuliner_pct: (kelurahan.kuliner / kelurahan.totalUsaha) * 100,
    fashion_pct: (kelurahan.fashion / kelurahan.totalUsaha) * 100,
    agrobisnis_pct: (kelurahan.agribisnis / kelurahan.totalUsaha) * 100,
    perdagangan_pct: (kelurahan.perdagangan / kelurahan.totalUsaha) * 100,
    nib_pct: (kelurahan.berNib / kelurahan.totalUsaha) * 100,
    total_norm: kelurahan.totalUsaha
  }));
}

function zScore(
  kelurahanPcts: ProcessedKelurahanPct[],
  features: FeatureCol[]
) {
  //  means = { kuliner_pct: x, nib_pct: y, ... }
  // stds  = { kuliner_pct: x,  nib_pct: y, ... }
  const means: Record<string, number> = {};
  const stds: Record<string, number> = {};

  // Looping features (kuliner_pct, fashion_pct, dst.)
  features.forEach((col) => {
    // Assign setiap persentase per kelurahan dengan looping kelurahanPcts
    // Dalam kelurahanPcts terdapat juga properti sesuai yang ada pada
    // features, map mengambil properti yang ada pada features
    const pcts = kelurahanPcts.map((pct) => pct[col] as number);
    const pctMean = mean(pcts);
    const std = standardDeviation(pcts);
    means[col] = pctMean;
    // Safety untuk pct yang bernilai 0
    stds[col] = std || 1;
  });

  // Menambahkan nilai pct yang sudah ternormalisasi ke objek kelurahanPct
  const normalized = kelurahanPcts.map((pct) => ({
    // Spread pct biasa dulu
    ...pct,
    ...Object.fromEntries(
      features.map((col) => [
        // Contoh: kuliner_pct_std
        `${col}_std`,
        ((pct[col] as number) - means[col]) / stds[col]
      ])
    )
  }));

  return { normalized, means, stds };
}

function euclideanWithHypot(a: number[], b: number[]): number {
  return Math.hypot(...a.map((val, i) => val - b[i]));
}

function calculateSilhouette(
  data: ProcessedKelurahanPct[],
  dataPointAssignments: number[],
  features: FeatureCol[]
): number {
  // Jumlah kelurahan
  const n = data.length;
  if (n <= 1) return 0;

  // K adalah total cluster
  // Didapat dari mencari nilai terbesar dataPointAssignments + 1
  // karena id dimulai dari 0
  const K = Math.max(...dataPointAssignments) + 1;
  if (K <= 1) return 0;

  // Array yang berisi vektor untuk setiap kelurahan
  //   vectors = [
  //   [1.2, -0.3, 0.8, ...]  kelurahan 0
  //   [1.1, 2.4, -1.2, ...]  kelurahan 1
  // ]
  const vectors = data.map((vector) =>
    features.map((feature) => vector[`${feature}_std`] as number)
  );
  const silhouettes: number[] = [];

  // Looping s(i) untuk setiap i
  // i = kelurahan yang sedang dievaluasi
  // j = kelurahan lain yang sedang dicek untuk diukur jaraknya dari i
  // k = id dari cluster yang dicek sebagai tetangga terdekat
  for (let i = 0; i < n; i++) {
    // Cek kelurahan yang dievaluasi masuk cluster id berapa
    const initialCluster = dataPointAssignments[i];
    // Di cluster ini ada berapa kelurahan
    const numOfClusterMembers = dataPointAssignments.filter(
      (dataPoint) => dataPoint === initialCluster
    ).length;

    // Jika kelurahan sendiri, tidak ada tetangga sesama cluster
    // Silhouette-nya 0 dan lanjut ke kelurahan selanjutnya
    if (numOfClusterMembers <= 1) {
      silhouettes.push(0);
      continue;
    }

    // a = Σ d(i, j)
    let a = 0;
    // count = |Ci| - 1
    let count = 0;
    // Nested loop yang sama untuk mendapatkan Σ d(i, j)
    for (let j = 0; j < n; j++) {
      // |Ci| - 1, -1 dari kondisi i !== j
      // -1 karena |Ci| - 1 berarti otal seluruh anggota kelompok, dikurangi 1
      // atau dirinya sendiri
      if (i !== j && dataPointAssignments[j] === initialCluster) {
        // Penjumlahan jarak antar data point
        a += euclideanWithHypot(vectors[i], vectors[j]);

        count++;
      }
    }
    // Bentuk terakhir a(i) setelah loop selesai
    // Σ d(i, j) / |Ci| - 1 atau a / count
    a = count > 0 ? a / count : 0;

    // Set nilai tertinggi sementara
    // Angka berapapun yang masuk pada putaran pertama pasti akan langsung menjadi nilai b yang baru
    let b = Infinity;
    // Cek sebanyak K
    // k adalah cluster tetangga
    for (let k = 0; k < K; k++) {
      // Skip cluster sendiri
      if (k === initialCluster) continue;
      // Wadah untuk ∑ d(i, l)
      let sumOfDistance = 0;
      // Wadah untuk |Ck|
      let neighbourDataPointCount = 0;
      // Cek seluruh tetangga
      for (let j = 0; j < n; j++) {
        // Cek apakah data point j anggota cluster k
        if (dataPointAssignments[j] === k) {
          // Hitung jarak dan jumlahkan
          sumOfDistance += euclideanWithHypot(vectors[i], vectors[j]);
          // Tambahkan tetangga
          neighbourDataPointCount++;
        }
      }

      // min(Σ d(i, l) / |Ck|)
      if (neighbourDataPointCount > 0) {
        b = Math.min(b, sumOfDistance / neighbourDataPointCount);
      }
    }

    // Masukkan setiap silhouette ke array
    silhouettes.push((b - a) / Math.max(a, b));
  }

  // Hitung rata-rata array silhouette
  return mean(silhouettes);
}

function calculateSilhouetteV2(
  data: ProcessedKelurahanPct[],
  dataPointAssignments: number[],
  features: string[]
): number {
  const n = data.length;
  if (n <= 1) return 0;
  const K = Math.max(...dataPointAssignments) + 1;
  if (K <= 1) return 0;

  const points = data.map((point) =>
    features.map((f) => point[`${f}_std`] as number)
  );
  return mean(silhouette(points, dataPointAssignments));
}

function initializeCentroids(
  data: ProcessedKelurahanPct[],
  normalizedFeatures: string[],
  K: number
): number[][] {
  const randomCentroidIndices = shuffle(Array.from(data.keys()));
  return randomCentroidIndices
    .slice(0, K)
    .map((i) =>
      normalizedFeatures.map((feature) => data[i][feature] as number)
    );
}

function assignDataPointToClosestCluster(
  data: ProcessedKelurahanPct[],
  centroids: number[][],
  normalizedFeatures: string[]
): number[] {
  return data.map((dataPoint) => {
    const vector = normalizedFeatures.map(
      (feature) => dataPoint[feature] as number
    );
    let bestCluster = 0;
    let bestDistance = Infinity;

    centroids.forEach((centroid, i) => {
      const currentDistance = euclideanWithHypot(vector, centroid);
      if (currentDistance < bestDistance) {
        bestDistance = currentDistance;
        bestCluster = i;
      }
    });

    return bestCluster;
  });
}

function updateCentroids(
  data: ProcessedKelurahanPct[],
  dataPointAssignments: number[],
  normalizedFeatures: string[],
  K: number
): number[][] {
  const newCentroids: number[][] = [];

  for (let k = 0; k < K; k++) {
    const clusterDataPoints = data.filter(
      (_, i) => dataPointAssignments[i] === k
    );

    if (clusterDataPoints.length === 0) {
      // Fallback jika ada cluster yang kosong
      // agar panjang array centroid tetap sesuai K
      newCentroids.push(new Array(normalizedFeatures.length).fill(0));
      continue;
    }

    const newCentroid = normalizedFeatures.map(
      (feature) =>
        clusterDataPoints.reduce((sum, p) => sum + (p[feature] as number), 0) /
        clusterDataPoints.length
    );
    newCentroids.push(newCentroid);
  }

  return newCentroids;
}

function test_kMeansRun(
  data: ProcessedKelurahanPct[],
  features: FeatureCol[],
  K: number,
  maxIteration = 100
) {
  const normalizedFeatures = features.map((f) => f + "_std");
  let centroids = initializeCentroids(data, normalizedFeatures, K);
  let dataPointAssignments = new Array(data.length).fill(0);

  for (let i = 0; i < maxIteration; i++) {
    const newAssignments = assignDataPointToClosestCluster(
      data,
      centroids,
      normalizedFeatures
    );
    const isConverged = newAssignments.every(
      (a, idx) => a === dataPointAssignments[idx]
    );

    if (isConverged) break;

    dataPointAssignments = newAssignments;
    centroids = updateCentroids(
      data,
      dataPointAssignments,
      normalizedFeatures,
      K
    );
  }

  // const wcss = calculateWcss(data, dataPointAssignments, centroids, features);
  // const silhouette = calculateSilhouette(data, dataPointAssignments, features);

  return { dataPointAssignments, centroids };
}

function runComparison(
  data: ProcessedKelurahanPct[],
  assignments: number[],
  features: string[],
  label: string
) {
  const oldScore = calculateSilhouette(data, assignments, features);
  const newScore = calculateSilhouetteV2(data, assignments, features);
  const diff = Math.abs(oldScore - newScore);

  console.log(`\n=== ${label} ===`);
  console.log(`Old: ${oldScore.toFixed(6)}`);
  console.log(`New: ${newScore.toFixed(6)}`);
  console.log(
    `Diff: ${diff.toFixed(6)} ${diff < 1e-9 ? "✓ identik" : diff < 1e-4 ? "≈ floating point noise" : "⚠ berbeda signifikan"}`
  );
}

function debugPerPoint(
  data: ProcessedKelurahanPct[],
  assignments: number[],
  features: string[]
) {
  const n = data.length;
  const K = Math.max(...assignments) + 1;

  const vectors = data.map((point) =>
    features.map((f) => point[`${f}_std`] as number)
  );

  // Hitung per-point score dari implementasi lama
  const oldScores: number[] = [];
  for (let i = 0; i < n; i++) {
    const myCluster = assignments[i];
    const clusterMembers = data.filter((_, j) => assignments[j] === myCluster);
    if (clusterMembers.length <= 1) {
      oldScores.push(0);
      continue;
    }

    let sumA = 0;
    for (let j = 0; j < n; j++) {
      if (i !== j && assignments[j] === myCluster) {
        sumA += euclideanWithHypot(vectors[i], vectors[j]);
      }
    }
    const a = sumA / (clusterMembers.length - 1);

    let b = Infinity;
    for (let k = 0; k < K; k++) {
      if (k === myCluster) continue;
      let sumD = 0,
        count = 0;
      for (let j = 0; j < n; j++) {
        if (assignments[j] === k) {
          sumD += euclideanWithHypot(vectors[i], vectors[j]);
          count++;
        }
      }
      if (count > 0) b = Math.min(b, sumD / count);
    }

    oldScores.push((b - a) / Math.max(a, b));
  }

  // Hitung per-point score dari simple-statistics
  const newScores = silhouette(vectors, assignments);

  // Bandingkan per kelurahan
  console.log(
    "\nKelurahan              | Cluster | Old      | New      | Diff"
  );
  console.log(
    "───────────────────────|─────────|──────────|──────────|──────────"
  );
  data.forEach((point, i) => {
    const diff = newScores[i] - oldScores[i];
    const flag = Math.abs(diff) > 0.01 ? " ⚠" : "";
    console.log(
      `${point.kelurahan.padEnd(22)} | ${String(assignments[i]).padEnd(7)} | ${oldScores[i].toFixed(4).padEnd(8)} | ${newScores[i].toFixed(4).padEnd(8)} | ${diff.toFixed(4)}${flag}`
    );
  });
}

function debugSinglePoint(
  data: ProcessedKelurahanPct[],
  assignments: number[],
  features: string[],
  targetKelurahan: string
) {
  const i = data.findIndex((d) => d.kelurahan === targetKelurahan);
  const vectors = data.map((p) => features.map((f) => p[`${f}_std`] as number));
  const myCluster = assignments[i];

  const clusterMates = data
    .map((d, j) => ({ d, j }))
    .filter(({ j }) => j !== i && assignments[j] === myCluster);

  console.log(`\n=== ${targetKelurahan} (cluster ${myCluster}) ===`);
  console.log(`Anggota cluster: ${clusterMates.length + 1}`);

  // Hitung a(i) secara manual
  const distances = clusterMates.map(({ d, j }) => {
    const dist = euclideanWithHypot(vectors[i], vectors[j]);
    console.log(`  jarak ke ${d.kelurahan}: ${dist.toFixed(6)}`);
    return dist;
  });

  const sumA = distances.reduce((s, d) => s + d, 0);
  console.log(`sumA = ${sumA.toFixed(6)}`);
  console.log(
    `a(i) = sumA / (n-1) = ${sumA.toFixed(6)} / ${clusterMates.length} = ${(sumA / clusterMates.length).toFixed(6)}`
  );
}

const processedData = convertRawToPct(kelurahanData);
const { normalized } = zScore(processedData, featureCols);

console.log(processedData[0]);

// test_kMeansRun(normalized, featureCols, 3, 2);
// for (const K of [2, 3, 4]) {
//   for (let run = 0; run < 3; run++) {
//     const { dataPointAssignments } = test_kMeansRun(
//       normalized,
//       [...featureCols],
//       K
//     );
//     debugSinglePoint(
//       normalized,
//       dataPointAssignments,
//       featureCols,
//       "MANGUNSARI"
//     );
//     debugPerPoint(normalized, dataPointAssignments, featureCols);
//     runComparison(
//       normalized,
//       dataPointAssignments,
//       featureCols,
//       `K=${K} run=${run + 1}`
//     );
//   }
// }
