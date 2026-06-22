CREATE TYPE "public"."kecamatanEnum" AS ENUM('Argomulyo', 'Sidomukti', 'Sidorejo', 'Tingkir');--> statement-breakpoint
CREATE TYPE "public"."sektorEnum" AS ENUM('kuliner', 'fashion', 'perdagangan', 'agrobisnis');--> statement-breakpoint
CREATE TYPE "public"."skalaEnum" AS ENUM('mikro', 'kecil', 'menengah');--> statement-breakpoint
CREATE TABLE "recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama_usaha" text NOT NULL,
	"skala" "skalaEnum" NOT NULL,
	"sektor" "sektorEnum" NOT NULL,
	"kecamatan" "kecamatanEnum",
	"deskripsi_produk" varchar(256) NOT NULL
);
