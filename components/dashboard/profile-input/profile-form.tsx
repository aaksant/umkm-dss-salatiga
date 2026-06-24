"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  kecamatanOptions,
  sektorOptions,
  skalaUsahaOptions
} from "@/data/kelurahan";
import { Kecamatan, Sektor, Skala } from "@/data/types/kelurahan.types";
import { COMPUTED_AHP_RESULT } from "@/lib/ahp";
import { runMultipleKMeans } from "@/lib/kmeans";
import { getTopsisRecommendationByCluster } from "@/lib/topsis";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type FormInput = {
  namaUsaha: string;
  sektor: Sektor | "";
  skala: Skala;
  kecamatan: Kecamatan | "";
  deskripsiProduk: string;
};

const fieldClass =
  "h-12 rounded-xl border border-[#28344A]/15 bg-white !text-base shadow-none focus-visible:border-[#28344A] focus-visible:ring-2 focus-visible:ring-[#28344A]/25";

export default function ProfileForm() {
  const router = useRouter();
  const {
    control,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    reset
  } = useForm<FormInput>({
    defaultValues: {
      namaUsaha: "",
      sektor: "",
      skala: "mikro",
      kecamatan: "",
      deskripsiProduk: ""
    }
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const clusterResult = runMultipleKMeans(3);
    const topsisRecommendation = getTopsisRecommendationByCluster(
      data.sektor as Sektor,
      clusterResult,
      COMPUTED_AHP_RESULT.weights
    );

    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        k: clusterResult.k,
        silhouette: clusterResult.silhouette,
        targetCluster: topsisRecommendation.targetCluster,
        topKelurahan: topsisRecommendation.detail.results
          .slice(0, 3)
          .map((r) => ({
            rank: r.rank,
            kelurahan: r.kelurahan,
            kecamatan: r.kecamatan,
            score: r.score
          })),
        consistencyRatio: COMPUTED_AHP_RESULT.consistencyRatio,
        weights: COMPUTED_AHP_RESULT.weights
      })
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Gagal menyimpan rekomendasi:", errorMessage);
    } else {
      const { data: inserted } = await response.json();

      const payload = {
        profile: { ...data },
        clusterResult,
        topsisRecommendation,
        ahpResult: COMPUTED_AHP_RESULT,
        id: inserted?.id ?? null,
        createdAt: inserted?.createdAt ?? null
      };

      localStorage.setItem("dss-result", JSON.stringify(payload));
    }

    router.push("/dashboard/result");
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      id="businessForm"
      className="space-y-7 rounded-2xl border border-[#28344A]/10 bg-white p-6 shadow-[0_1px_3px_rgba(40,52,74,0.06)] sm:p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8862E]">
          Data Usaha
        </p>
        <h2 className="font-display text-xl font-bold tracking-tight text-[#23262B]">
          Ceritakan tentang usaha Anda
        </h2>
        <p className="text-sm text-[#23262B]/60">
          Isi formulir berikut. Kolom bertanda{" "}
          <span className="font-bold text-[#C8862E]">*</span> wajib diisi.
        </p>
      </div>

      <Controller
        name="namaUsaha"
        control={control}
        rules={{ required: "Nama usaha wajib diisi" }}
        render={({ field }) => (
          <div className="space-y-2">
            <Label className="text-[#23262B]">
              Nama Usaha
              <span className="font-bold text-[#C8862E]">*</span>
            </Label>
            <Input
              type="text"
              disabled={isSubmitting}
              placeholder="contoh: Warung Bu Tini"
              className={fieldClass}
              {...field}
            />
            {errors.namaUsaha && (
              <p className="text-xs font-medium text-[#B8453D]">
                {errors.namaUsaha.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="sektor"
        control={control}
        rules={{ required: "Sektor wajib dipilih" }}
        render={({ field }) => (
          <div className="space-y-2">
            <Label className="text-[#23262B]">
              Sektor
              <span className="font-bold text-[#C8862E]">*</span>
            </Label>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={`w-full cursor-pointer ${fieldClass} [&>svg]:text-[#28344A]/60`}
              >
                <SelectValue placeholder="Pilih sektor usaha" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#28344A]/10">
                <SelectGroup>
                  {sektorOptions.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="cursor-pointer"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.sektor && (
              <p className="text-xs font-medium text-[#B8453D]">
                {errors.sektor.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="skala"
        control={control}
        rules={{ required: "Skala usaha wajib dipilih" }}
        render={({ field }) => (
          <div className="space-y-2">
            <Label className="text-[#23262B]">
              Skala
              <span className="font-bold text-[#C8862E]">*</span>
            </Label>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-3 gap-2"
            >
              {skalaUsahaOptions.map(({ value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <RadioGroupItem value={value} className="cursor-pointer" />
                  <Label>{label}</Label>
                </div>
              ))}
            </RadioGroup>
            {errors.skala && (
              <p className="text-xs font-medium text-[#B8453D]">
                {errors.skala.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="kecamatan"
        control={control}
        rules={{ required: "Kecamatan wajib diisi" }}
        render={({ field }) => (
          <div className="space-y-2">
            <Label className="text-[#23262B]">
              Kecamatan Asal
              <span className="font-bold text-[#C8862E]">*</span>
            </Label>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={`w-full cursor-pointer ${fieldClass} [&>svg]:text-[#28344A]/60`}
              >
                <SelectValue placeholder="Pilih kecamatan" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#28344A]/10">
                <SelectGroup>
                  {kecamatanOptions.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="cursor-pointer"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.kecamatan && (
              <p className="text-xs font-medium text-[#B8453D]">
                {errors.kecamatan.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="deskripsiProduk"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label className="text-[#23262B]">Deskripsi Produk</Label>
            <Textarea
              placeholder="Apa yang Anda jual? (opsional)"
              className="min-h-24 rounded-xl border border-[#28344A]/15 bg-white text-base shadow-none focus-visible:border-[#28344A] focus-visible:ring-2 focus-visible:ring-[#28344A]/25"
              {...field}
            />
          </div>
        )}
      />

      <Button
        type="submit"
        className="h-12 w-full cursor-pointer rounded-xl bg-[#28344A] text-base font-semibold text-white hover:bg-[#28344A]/90 focus-visible:ring-2 focus-visible:ring-[#28344A]/40 focus-visible:ring-offset-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            Menganalisis...
            <LoaderCircle className="h-4 w-4 motion-safe:animate-spin" />
          </>
        ) : (
          <>
            Dapatkan rekomendasi Anda <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
