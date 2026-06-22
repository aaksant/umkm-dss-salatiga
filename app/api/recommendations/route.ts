import { db } from "@/db";
import {
  kecamatanEnum,
  recommendations,
  sektorEnum,
  skalaEnum
} from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  namaUsaha: z.string(),
  skala: z.enum(skalaEnum.enumValues),
  sektor: z.enum(sektorEnum.enumValues),
  kecamatan: z.enum(kecamatanEnum.enumValues),
  deskripsiProduk: z.string().max(256).optional(),
  k: z
    .number()
    .int("Nilai K harus berupa bilangan bulat")
    .positive("Nilai K harus positif")
    .min(2)
    .max(6),
  silhouette: z.number().min(-1).max(1),
  targetCluster: z.number().int().min(0),
  topKelurahan: z
    .array(
      z.object({
        rank: z.number().int().min(1),
        kelurahan: z.string().min(1),
        kecamatan: z.string().min(1),
        score: z.number().min(0).max(1)
      })
    )
    .min(1)
    .max(3),
  consistencyRatio: z.number().min(0).max(1),
  weights: z.object({
    C1: z.number().min(0).max(1),
    C2: z.number().min(0).max(1),
    C3: z.number().min(0).max(1),
    C4: z.number().min(0).max(1)
  })
});

export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const {
      namaUsaha,
      skala,
      sektor,
      kecamatan,
      deskripsiProduk,
      k,
      silhouette,
      targetCluster,
      topKelurahan,
      consistencyRatio,
      weights
    } = parsed.data;

    await db.insert(recommendations).values({
      namaUsaha,
      skala,
      sektor,
      kecamatan,
      deskripsiProduk: deskripsiProduk ?? null,
      k,
      silhouette,
      targetCluster,
      topKelurahan,
      consistencyRatio,
      weights
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
