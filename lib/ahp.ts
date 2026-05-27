import { AHPCriteria, AHPResult } from "@/playgrounds/ahp.playground";
import { mean } from "simple-statistics";
import { AHP_CR_THRESHOLD } from "./constants";

/**
 * Pairwise comparison matrix
 *
 * Nilai matriks ini bersifat konstan dan ditetapkan berdasarkan hasil kuesioner/wawancara
 * offline dengan pakar. Sistem menggunakan matriks ini secara
 * pre-computed untuk menghasilkan bobot prioritas kriteria yang akan digunakan oleh TOPSIS.
 *
 * Aturan matematis matriks AHP yang berlaku:
 * 1. Skala penilaian menggunakan angka 1 hingga 9 (dan genap untuk nilai tengah).
 * 2. Diagonal utama selalu bernilai 1 (karena kriteria dibandingkan dengan dirinya sendiri).
 * 3. Segitiga bawah mematuhi aturan resiprokal/kebalikan dari segitiga atas (aji = 1 / aij).
 *
 * Catatan: Sementara, nanti diganti habis wawancara
 */
export const defaultComparisonMatrix: number[][] = [
  [1, 2, 3, 4], // C1 vs all
  [1 / 2, 1, 2, 3], // C2 vs all
  [1 / 3, 1 / 2, 1, 2], // C3 vs all
  [1 / 4, 1 / 3, 1 / 2, 1] // C4 vs all
];

/**
 * AHP menggunakan objek ini untuk melabeli hasil bobot,
 * sementara TOPSIS menggunakan atribut `type` pada objek ini untuk menentukan
 * arah optimasi (solusi ideal positif/negatif) dari masing-masing kriteria
 *
 * - type: "benefit" -> Nilai yang lebih tinggi lebih baik (TOPSIS akan memaksimalkan nilai ini).
 * - type: "cost"    -> Nilai yang lebih rendah lebih baik (TOPSIS akan meminimalkan nilai ini).
 *
 */
export const ahpCriteria: AHPCriteria[] = [
  { id: "C1", name: "Kepadatan penduduk per kelurahan", type: "benefit" },
  { id: "C2", name: "Tingkat kompetisi produk sejenis", type: "cost" },
  { id: "C3", name: "Total UMKM per kelurahan", type: "benefit" },
  { id: "C4", name: "Pusat perdagangan per kelurahan", type: "benefit" }
];

/**
 * Menghitung bobot prioritas kriteria dan menguji tingkat konsistensi
 * menggunakan metode Analytic Hierarchy Process (AHP)
 * https://informatika.stei.itb.ac.id/~rinaldi.munir/AljabarGeometri/2017-2018/AHPTutorial.pdf
 * @param {number[][]} comparisonMatrix - Matriks persegi (n x n) yang berisi nilai perbandingan berpasangan (Skala Saaty 1-9).
 * @returns {AHPResult} Objek berisi bobot kriteria yang sudah diproses, rasio konsistensi, indeks konsistensi, principal eigenvalue, status konsistensi, dan matriks argumen yang ternormalisasi
 */
export function calculateAhpWeights(comparisonMatrix: number[][]): AHPResult {
  // n adalah jumlah kriteria yang sedang dibandingkan untuk ukuran matriks n x n.
  const n = comparisonMatrix.length;

  // Tabel Random Index (RI) standar dari Thomas Saaty
  // Indeks array dimulai dari 0. Tiga angka 0 di depan ditambahkan agar indeks
  // array (n) langsung sejajar/merujuk ke jumlah kriteria yang benar.
  // Contoh: randomIndexTable[4] akan menghasilkan 0.90.
  const randomIndexTable = [
    0, 0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49
  ];

  /*
   * 1. Penjumlahan Kolom
   * Halaman 5 di referensi
   */
  // Membuat array kosong berisi angka 0 sebanyak n
  // Ini adalah jumlah yang dibuat baris
  const reciprocalColSums = Array(n).fill(0);

  // Loop setiap baris dan kolom matriks argumen
  // Nilai pada setiap kolom j dijumlahkan
  // Rumus: Sj = Σ aij
  comparisonMatrix.forEach((row) =>
    row.forEach((val, j) => (reciprocalColSums[j] += val))
  );

  /*
   * 2. Normalisasi Matriks
   * Halaman 5 di referensi
   */
  // Membagi setiap elemen matriks awal dengan total kolomnya masing-masing.
  // Ini mengubah skala nilai menjadi tidak terlalu besar dan kecil (total setiap kolom = 1).
  // Rumus: xij = aij / Sj
  const normalized = comparisonMatrix.map((row) =>
    row.map((val, j) => val / reciprocalColSums[j])
  );

  /*
   * 3. Menghitung Priority Vector
   * Halaman 5 di referensi
   */
  // Menjumlahkan nilai matriks ternormalisasi secara horizontal (ke samping)
  // lalu membaginya dengan n untuk mencari nilai rata-rata tiap baris.
  // Rata-rata ini adalah bobot kriteria akhir
  const weightArray = normalized.map((row) => mean(row));

  /*
   * 4. Cek Konsistensi
   * Halaman 6-14 di referensi
   */
  // Menghitung Lambda Max (principal eigenvalue) menggunakan metode aproksimasi cepat
  // Mengalikan setiap bobot kriteria dengan jumlah kolom matriks awal pasangannya, lalu menjumlahkannya
  // Rumus: λmax = Σ (Wi * Si)
  const lambdaMax = weightArray.reduce(
    (sum, weight, i) => sum + weight * reciprocalColSums[i],
    0
  );

  // Menghitung Consistency Index (CI)
  // Rumus: CI = (λmax - n) / (n - 1)
  const consistencyIndex = (lambdaMax - n) / (n - 1);

  // Mengambil nilai Random Index (RI) berdasarkan jumlah kriteria (n).
  const randomConsistencyIndex = randomIndexTable[n];

  // 4d. Menghitung Consistency Ratio (CR) untuk mengetahui status konsistensi
  // Rumus: CI / RI
  const consistencyRatio = consistencyIndex / randomConsistencyIndex;

  /*
   * 5. Pemetaan Hasil
   */
  // Memetakan array bobot yang hanya berupa angka menjadi objek
  // di mana kuncinya adalah id Kriteria dan nilainya adalah bobot
  const weights: Record<string, number> = {};
  ahpCriteria.forEach((criteria, i) => {
    // Memasukkan bobot. Menggunakan ?? 0 untuk mencegah error jika terjadi undefined.
    weights[criteria.id] = weightArray[i] ?? 0;
  });

  return {
    weights,
    weightArray,
    consistencyRatio,
    consistencyIndex,
    lambdaMax,
    consistent: consistencyRatio < AHP_CR_THRESHOLD, // Boolean: True jika CR < 10%
    normalizedMatrix: normalized
  };
}

export const COMPUTED_AHP_RESULT = calculateAhpWeights(defaultComparisonMatrix);
