import { kelurahanData, ProcessedKelurahanPct, Sektor } from "@/data/kelurahan";
import { convertRawToPct, zScore } from "@/lib/kmeans";
import { TopsisAlternative, TopsisResult } from "@/lib/topsis";
import { COMPUTED_AHP_RESULT } from "@/lib/ahp";
import { ahpCriteria } from "./ahp.playground";

const features = [
  "kuliner_pct",
  "fashion_pct",
  "agrobisnis_pct",
  "perdagangan_pct",
  "nib_pct",
  "total_units",
  "population"
];
const processed = convertRawToPct(kelurahanData);
const { normalized } = zScore(processed, features);

function test_createAlternatives(
  keluruhanList: ProcessedKelurahanPct[],
  targetSektor: Sektor
): TopsisAlternative[] {
  return keluruhanList.map((kelurahan) => {
    const sektorCount = (kelurahan[targetSektor] as number) || 0;

    return {
      kelurahan: kelurahan.kelurahan,
      kecamatan: kelurahan.kecamatan,
      total: kelurahan.totalUsaha,
      berNib: kelurahan.berNib,
      // C1: Kepadatan penduduk per kelurahan (Benefit)
      C1: kelurahan.populasi,
      // C2: Tingkat kompetisi produk sejenis (Cost)
      // Semakin banyak penjual di sektor yang sama, saingan semakin berat.
      C2: sektorCount,
      // C3: Total UMKM per kelurahan (Benefit)
      // Mengukur seberapa hidup perputaran ekonomi di wilayah tersebut.
      C3: kelurahan.totalUsaha,
      // C4: Pusat perdagangan per kelurahan (Benefit)
      // BUG FIX: Menggunakan kolom 'perdagangan' asli dari dataset kelurahan_2.ts
      C4: kelurahan.pasar
    };
  });
}

const alternatives = test_createAlternatives(normalized, "kuliner");
const decisionMatrix = alternatives.map((alt) =>
  ahpCriteria.map((criteria) => alt[criteria.id] as number)
);
const normalizedCols = ahpCriteria.map((_, j) =>
  Math.sqrt(decisionMatrix.reduce((sum, row) => sum + row[j] ** 2, 0))
);
const normalizedMatrix = decisionMatrix.map((row) =>
  row.map((val, j) => val / (normalizedCols[j] || 1))
);

const weightedMatrix = normalizedMatrix.map((row) =>
  row.map((val, j) => val * COMPUTED_AHP_RESULT.weights[ahpCriteria[j].id])
);

const idealPositives = ahpCriteria.map((criteria, j) => {
  const values = weightedMatrix.map((row) => row[j]);
  return criteria.type === "benefit"
    ? Math.max(...values)
    : Math.min(...values);
});
const idealNegatives = ahpCriteria.map((criteria, j) => {
  const values = weightedMatrix.map((row) => row[j]);
  return criteria.type === "benefit"
    ? Math.min(...values)
    : Math.max(...values);
});

const distancePositives = weightedMatrix.map((row) =>
  Math.sqrt(
    row.reduce((sum, val, j) => sum + (val - idealPositives[j]) ** 2, 0)
  )
);

// console.log("decisionMatrix", decisionMatrix.slice(0, 4));
// console.log("normalizedCols", normalizedCols);
// console.log("normalizedMatrix", normalizedMatrix.slice(0, 4));
// console.log("COMPUTED_AHP_RESULT.weights", COMPUTED_AHP_RESULT.weights);
// console.log("weightedMatrix", weightedMatrix.slice(0, 3));
// console.log("idealPositives", idealPositives);
// console.log("idealNegatives", idealNegatives);
// console.log("distancePositives", distancePositives);
