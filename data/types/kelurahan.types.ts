import {
  kecamatanOptions,
  sektorOptions,
  skalaUsahaOptions
} from "../kelurahan";

export interface RawKelurahanData {
  kelurahan: string;
  kecamatan: string;
  kuliner: number;
  fashion: number;
  pendidikan: number;
  otomotif: number;
  agribisnis: number;
  teknologi: number;
  perdagangan: number;
  totalUsaha: number;
  berNib: number;
  populasi: number;
  pasar: number;
}

/**
 * Dengan asumsi produk otomotif, pendidikan, dan teknologi
 * tidak dapat didistribusikan
 */
export type ProcessedKelurahanData = Omit<
  RawKelurahanData,
  "otomotif" | "pendidikan" | "teknologi"
>;

export interface ProcessedKelurahanPct extends ProcessedKelurahanData {
  kuliner_pct: number;
  fashion_pct: number;
  agrobisnis_pct: number;
  perdagangan_pct: number;
  nib_pct: number;
  total_units: number;
  // normalized values
  [key: string]: number | string;
}

export type Sektor = (typeof sektorOptions)[number]["value"];
export type Skala = (typeof skalaUsahaOptions)[number]["value"];
export type Kecamatan = (typeof kecamatanOptions)[number]["value"];
