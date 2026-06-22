ALTER TABLE "recommendations" ALTER COLUMN "deskripsi_produk" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendations" ADD COLUMN "k" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendations" ADD COLUMN "silhouette" real NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendations" ADD COLUMN "target_cluster" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendations" ADD COLUMN "top_kelurahan" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendations" ADD COLUMN "consistency_ratio" real NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendations" ADD COLUMN "ahp_weights" jsonb NOT NULL;