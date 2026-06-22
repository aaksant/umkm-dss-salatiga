import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

export const skalaEnum = pgEnum("skalaEnum", ["mikro", "kecil", "menengah"]);
export const sektorEnum = pgEnum("sektorEnum", [
  "kuliner",
  "fashion",
  "perdagangan",
  "agrobisnis"
]);
export const kecamatanEnum = pgEnum("kecamatanEnum", [
  "Argomulyo",
  "Sidomukti",
  "Sidorejo",
  "Tingkir"
]);

export const recommendations = pgTable("recommendations", {
  id: uuid("id").primaryKey().defaultRandom(),
  namaUsaha: text("nama_usaha").notNull(),
  skala: skalaEnum("skala").notNull(),
  sektor: sektorEnum("sektor").notNull(),
  kecamatan: kecamatanEnum("kecamatan"),
  deskripsiProduk: varchar("deskripsi_produk", { length: 256 }),
  k: integer("k").notNull().default(0),
  silhouette: real("silhouette").notNull().default(0),
  targetCluster: integer("target_cluster").notNull().default(0),
  topKelurahan: jsonb("top_kelurahan").notNull(),
  consistencyRatio: real("consistency_ratio").notNull(),
  weights: jsonb("ahp_weights").notNull()
});

export const InsertRecommendation = typeof recommendations.$inferInsert;
