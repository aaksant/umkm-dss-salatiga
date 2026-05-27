import { kelurahanData } from "@/data/kelurahan";
import {
  ProcessedKelurahanData,
  ProcessedKelurahanPct,
  Sektor
} from "@/data/types/kelurahan.types";
import {
  ClusterInfo,
  ClusterResult,
  ScoredCluster
} from "@/data/types/kmeans.types";
import { mean, shuffle, standardDeviation } from "simple-statistics";
import {
  KMEANS_DEFAULT_RUNS,
  KMEANS_K_MAX,
  KMEANS_K_MIN,
  KMEANS_MAX_ITERATION
} from "./constants";

/**
 * Fitur apa saja yang dilihat K-Means untuk menilai kemiripan antar kelurahan
 */
const features = [
  "kuliner_pct",
  "fashion_pct",
  "agrobisnis_pct",
  "perdagangan_pct",
  "nib_pct",
  "total_units",
  "populasi",
  "pasar"
];

// Convert to rgb?
const clusterColors = [
  "hsl(217, 91%, 60%)", // blue
  "hsl(258, 90%, 66%)", // violet
  "hsl(45, 93%, 47%)", // amber
  "hsl(188, 95%, 43%)", // cyan
  "hsl(0, 84%, 60%)", // red
  "hsl(142, 71%, 45%)" // green
];
const clusterBgColors = [
  "hsl(217, 91%, 95%)",
  "hsl(258, 90%, 95%)",
  "hsl(45, 93%, 95%)",
  "hsl(188, 95%, 95%)",
  "hsl(0, 84%, 95%)",
  "hsl(142, 71%, 95%)"
];

type Feature = (typeof features)[number];

export function getClusterColor(index: number): string {
  return clusterColors[index % clusterColors.length];
}

export function getClusterBgColor(index: number): string {
  return clusterBgColors[index % clusterBgColors.length];
}

/**
 * Akan berdampak ke jarak Euclidean. Contoh:
 *
 * Kelurahan A: 50 usaha kuliner (dari 100 total) → 50% dan
 * Kelurahan B: 500 usaha kuliner (dari 1000 total) → 50%
 *
 * Jika dihitung langsung maka jarak Euclidean-nya =
 * √((500 - 50)²) = √(202.500) = 450
 *
 * Jarak 450 itu besar. K-Means akan menganggap keduanya berbeda jauh, dan kemungkinan besar memasukkan mereka ke cluster yang berbeda
 *
 * Namun, jika menggunakan pct, jarak Euclidean = √((50% - 50%)²) = 0
 *
 * Nilai kecil akan memperkecil jarak cluster dan akan dianggap identik
 * @param {ProcessedKelurahanData[]} data - Array kelurahan dengan bentuk objek sesuai `ProcessedKelurahanData`
 * @returns Array yang berisi persentase tiap sektor terhadap total UMKM yang ada pada kelurahan
 */
export function convertRawToPct(
  data: ProcessedKelurahanData[]
): ProcessedKelurahanPct[] {
  return data.map((kelurahan) => ({
    ...kelurahan,
    kuliner_pct: (kelurahan.kuliner / kelurahan.totalUsaha) * 100,
    fashion_pct: (kelurahan.fashion / kelurahan.totalUsaha) * 100,
    agrobisnis_pct: (kelurahan.agribisnis / kelurahan.totalUsaha) * 100,
    perdagangan_pct: (kelurahan.perdagangan / kelurahan.totalUsaha) * 100,
    nib_pct: (kelurahan.berNib / kelurahan.totalUsaha) * 100,
    total_units: kelurahan.totalUsaha,
    populasi: kelurahan.populasi
  }));
}

/**
 *
 * @param {ProcessedKelurahanPct[]} kelurahanPcts
 * @param {Feature[]} features
 * @returns
 */
export function zScore(
  kelurahanPcts: ProcessedKelurahanPct[],
  features: Feature[]
) {
  // means = { kuliner_pct: x, nib_pct: y, ... }
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

/**
 * Menghitung jarak Euclidean antara dua array
 * @param {number[]} a - Titik pertama sebagai array angka
 * @param {number[]} b - Titik kedua sebagai array angka
 * @returns {number} Jarak lurus antara titik a dan titik b.
 */
function euclidean(a: number[], b: number[]): number {
  return Math.hypot(...a.map((val, i) => val - b[i]));
}

/**
 * Menghitung nilai WCSS (Within-Cluster Sum of Squares) untuk mengevaluasi kualitas clustering.
 * WCSS menghitung total kuadrat jarak antara setiap titik data dengan centroid cluster-nya masing-masing.
 * @param {ProcessedKelurahanPct[]} data - Array berisi data kelurahan yang sudah memiliki nilai persentase dan sudah ternormalisasi
 * @param {number[]} dataPointAssignments - Array berisi indeks cluster yang ditetapkan untuk setiap titik data (misal: [0, 1, 0, 2] berarti data pertama di cluster 0, data kedua di cluster 1)
 * @param {number[][]} centroids - Matriks 2d berisi koordinat titik pusat untuk setiap cluster
 * @param {Feature[]} features - Array berisi nama-nama kolom fitur yang digunakan sebagai acuan jarak (contoh: ["kuliner_pct", "fashion_pct"])
 * @returns {number} Nilai total WCSS. Semakin kecil nilainya, semakin baik cluster yang terbentuk
 */
function calculateWcss(
  data: ProcessedKelurahanPct[],
  dataPointAssignments: number[],
  centroids: number[][],
  features: Feature[]
): number {
  let wcss = 0;
  data.forEach((point, i) => {
    // vector menggambarkan profil kelurahan tertentu
    // Misal Tegalrejo memiliki vector [1.5,  0.8, -0.2, 2.1, 1.0, 1.8]
    // Vector ini adalah terjemahan dari:
    // kuliner_pct_std = 1.5 (sangat banyak UMKM kuliner di atas rata-rata)
    // fashion_pct_std = 0.8 (cukup banyak UMKM fashion)
    // agrobisnis_pct_std = -0.2 (agrobisnis sedikit di bawah rata-rata)
    // perdagangan_pct_std = 2.1 (sangat tinggi aktivitas perdagangan)
    // nib_pct_std = 1.0 (banyak yang punya NIB)
    // total_units = 1.8 (total usahanya sangat banyak)
    const vector = features.map((feature) => point[`${feature}_std`] as number);
    const centroid = centroids[dataPointAssignments[i]];
    wcss += vector.reduce((sum, val, j) => sum + (val - centroid[j]) ** 2, 0);
  });

  return wcss;
}

/**
 * Menghitung rata-rata Silhouette Score untuk mengevaluasi kualitas dan pemisahan antar cluster.
 * Nilai yang dihasilkan berkisar dari -1 hingga 1, di mana nilai yang mendekati 1 menunjukkan pengelompokan yang sangat baik.
 *
 * s(i) = (b(i) - a(i)) / max(a(i), b(i))
 * - s(i): nilai Silhouette untuk satu data point
 * - a(i): rata-rata cohesion
 * - b(i): rata-rata separation
 *
 * Dengan:
 * - a(i) = Σ d(i, j) / |Ci| - 1
 * - b(i) = min(Σ d(i, l) / |Ck|)
 * @param {ProcessedKelurahanPct[]} data - Array data kelurahan yang mengandung nilai fitur yang telah dinormalisasi
 * @param {number[]} dataPointAssignments - Array yang menunjukkan id cluster untuk masing-masing data (contoh: [0, 1, 0, 2])
 * @param {Feature[]} features - Kolom fitur (z-score) yang digunakan untuk merepresentasikan titik data dalam ruang dimensi
 * @returns {number} Nilai rata-rata Silhouette Score dari seluruh titik data. Mengembalikan 0 jika data atau cluster kurang dari atau sama dengan 1
 */
function calculateSilhouette(
  data: ProcessedKelurahanPct[],
  dataPointAssignments: number[],
  features: Feature[]
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
        a += euclidean(vectors[i], vectors[j]);

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
          sumOfDistance += euclidean(vectors[i], vectors[j]);
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

function runSingleKMeans(
  data: ProcessedKelurahanPct[],
  K: number,
  features: Feature[],
  maxIteration = KMEANS_MAX_ITERATION
) {
  const normalizedFeatures = features.map((feature) => `${feature}_std`);
  // Membuat array index [0, 1, 2, ...] dan mengacak urutannya sebagai index centroid
  const randomCentroidIndices = shuffle(Array.from(data.keys()));
  const centroids = randomCentroidIndices
    // Slice karena hanya membutuhkan titik awal (centroid) sebanyak jumlah kelompok (K)
    // yang ingin kita buat, bukan sebanyak jumlah seluruh kelurahan
    .slice(0, K)
    .map((i) => normalizedFeatures.map((f) => data[i][f] as number));
  // Menyiapkan wadah untuk mencatat setiap kelurahan masuk ke cluster mana.
  // Awalnya diisi 0 semua.
  let dataPointAssignments = new Array(data.length).fill(0);

  // Limit percobaan sampai maxIteration
  for (let i = 0; i < maxIteration; i++) {
    const newDataPointAssignments = data.map((dataPoint) => {
      const vector = normalizedFeatures.map(
        (feature) => dataPoint[feature] as number
      );
      // Set nilai tertinggi sementara
      // Angka berapapun yang masuk pada putaran pertama pasti akan langsung menjadi nilai b yang baru
      let bestCluster = 0;
      let bestDistance = Infinity;

      centroids.forEach((c, ci) => {
        const distance = euclidean(vector, c);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestCluster = ci;
        }
      });
      return bestCluster;
    });

    if (
      newDataPointAssignments.every((a, i) => a === dataPointAssignments[i])
    ) {
      break;
    }
    dataPointAssignments = newDataPointAssignments;

    for (let k = 0; k < K; k++) {
      const clusterPoints = data.filter(
        (_, i) => dataPointAssignments[i] === k
      );
      if (clusterPoints.length === 0) continue;
      centroids[k] = normalizedFeatures.map(
        (f) =>
          clusterPoints.reduce((sum, p) => sum + (p[f] as number), 0) /
          clusterPoints.length
      );
    }
  }

  const wcss = calculateWcss(data, dataPointAssignments, centroids, features);
  const silhouette = calculateSilhouette(data, dataPointAssignments, features);
  return { dataPointAssignments, centroids, silhouette, wcss };
}

// Run K-Means multiple times and pick best silhouette
export function runMultipleKMeans(
  K: number,
  runs = KMEANS_DEFAULT_RUNS
): ClusterResult {
  const processed = convertRawToPct(kelurahanData);
  const { normalized } = zScore(processed, features);

  let bestResult: ReturnType<typeof runSingleKMeans> | null = null;

  for (let r = 0; r < runs; r++) {
    const result = runSingleKMeans(normalized, K, [...features]);
    if (!bestResult || result.silhouette > bestResult.silhouette) {
      bestResult = result;
    }
  }

  return {
    dataPointAssignments: bestResult!.dataPointAssignments,
    centroids: bestResult!.centroids,
    silhouette: bestResult!.silhouette,
    k: K,
    processedData: normalized,
    wcss: bestResult!.wcss
  };
}

export function calculateElbowData(): {
  k: number;
  wcss: number;
  silhouette: number;
}[] {
  const results: { k: number; wcss: number; silhouette: number }[] = [];
  for (let k = KMEANS_K_MIN; k <= KMEANS_K_MAX; k++) {
    const r = runMultipleKMeans(k, 8);
    results.push({ k, wcss: r.wcss, silhouette: r.silhouette });
  }
  return results;
}

// Generate cluster info with dynamic labels
export function generateClusterInfo(result: ClusterResult): ClusterInfo[] {
  const clusters: ClusterInfo[] = [];

  for (let i = 0; i <= Math.max(...result.dataPointAssignments); i++) {
    const members = result.processedData.filter(
      (_, dataPointIndex) => result.dataPointAssignments[dataPointIndex] === i
    );
    if (members.length === 0) continue;

    const avgTotal =
      members.reduce((s, m) => s + m.totalUsaha, 0) / members.length;
    const avgNib = members.reduce((s, m) => s + m.nib_pct, 0) / members.length;
    const avgKuliner =
      members.reduce((s, m) => s + m.kuliner_pct, 0) / members.length;
    const avgPerdagangan =
      members.reduce((s, m) => s + m.perdagangan_pct, 0) / members.length;

    const avgStats: Record<string, number> = {
      total: avgTotal,
      nib_pct: avgNib,
      kuliner_pct: avgKuliner,
      fashion_pct:
        members.reduce((s, m) => s + m.fashion_pct, 0) / members.length,
      agrobisnis_pct:
        members.reduce((s, m) => s + m.agrobisnis_pct, 0) / members.length,
      perdagangan_pct: avgPerdagangan,
      count: members.length
    };

    const allAvgTotal =
      result.processedData.reduce((s, m) => s + m.totalUsaha, 0) /
      result.processedData.length;
    const allAvgNib =
      result.processedData.reduce((s, m) => s + m.nib_pct, 0) /
      result.processedData.length;

    let label: string;
    let description: string;

    if (avgTotal > allAvgTotal * 1.2 && avgNib > allAvgNib) {
      label = "Pasar Utama";
      description =
        "Wilayah dengan aktivitas UMKM tinggi dan tingkat formalitas baik. Cocok untuk produk dengan volume distribusi besar.";
    } else if (avgTotal > allAvgTotal * 0.9) {
      label = "Pasar Berkembang";
      description =
        "Wilayah dengan potensi pasar yang sedang tumbuh. Peluang ekspansi masih terbuka lebar.";
    } else if (avgNib > allAvgNib * 1.1) {
      label = "Pasar Potensial";
      description =
        "Wilayah dengan tingkat formalitas UMKM yang tinggi, menandakan kematangan pasar dan daya beli lebih stabil.";
    } else {
      label = "Pasar Tersier";
      description =
        "Wilayah dengan aktivitas UMKM lebih rendah namun persaingan juga minim. Cocok untuk niche market.";
    }

    clusters.push({
      id: i,
      label,
      description,
      color: getClusterColor(i),
      kelurahanList: members,
      avgStats
    });
  }

  return clusters;
}

export function getRecommendation(
  sektor: Sektor,
  clusterResult: ClusterResult
): ScoredCluster[] {
  const sectorKey = sektor + "_pct";
  const clusterInfos = generateClusterInfo(clusterResult);
  const maxTotal = Math.max(
    ...clusterResult.processedData.map((p) => p.totalUsaha)
  );

  return clusterInfos
    .map((info) => {
      const avgSector =
        info.kelurahanList.reduce(
          (s, p) => s + ((p[sectorKey] as number) || 0),
          0
        ) / info.kelurahanList.length;
      const avgTotal = info.avgStats.total;
      const avgNib = info.avgStats.nib_pct;
      const score =
        avgSector * 0.5 + (avgTotal / maxTotal) * 100 * 0.3 + avgNib * 0.2;

      return { ...info, score, avgSector, avgTotal, avgNib };
    })
    .sort((a, b) => b.score - a.score);
}
