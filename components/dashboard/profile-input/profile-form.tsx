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

    const payload = {
      profile: { ...data },
      clusterResult,
      topsisRecommendation,
      ahpResult: COMPUTED_AHP_RESULT
    };

    localStorage.setItem("dss-result", JSON.stringify(payload));

    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload.profile,
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
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="text-center">
        <h2 className="text-lg font-semibold tracking-tight">Data Usaha</h2>
        <p className="text-xs text-muted-foreground">
          Isi formulir di bawah ini. Kolom bertanda * wajib diisi.
        </p>
      </div>

      <Controller
        name="namaUsaha"
        control={control}
        rules={{ required: "Nama usaha wajib diisi" }}
        render={({ field }) => (
          <div className="space-y-2">
            <Label>
              Nama Usaha
              <span className="font-extrabold text-red-400">*</span>
            </Label>
            <Input
              type="text"
              disabled={isSubmitting}
              className="rounded-md"
              {...field}
            />
            {errors.namaUsaha && (
              <p className="text-xs text-destructive">
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
          <div className="space-y-1">
            <Label>
              Sektor <span className="font-extrabold text-red-400">*</span>
            </Label>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full cursor-pointer rounded-md">
                <SelectValue placeholder="Pilih sektor usaha" />
              </SelectTrigger>
              <SelectContent>
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
              <p className="text-xs text-destructive">
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
          <div className="space-y-1">
            <Label>
              Skala <span className="font-extrabold text-red-400">*</span>
            </Label>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex w-full"
            >
              {skalaUsahaOptions.map(({ value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <RadioGroupItem value={value} className="cursor-pointer" />
                  <Label>{label}</Label>
                </div>
              ))}
            </RadioGroup>
            {errors.skala && (
              <p className="text-xs text-destructive">{errors.skala.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="kecamatan"
        control={control}
        rules={{ required: "Kecamatan wajib diisi" }}
        render={({ field }) => (
          <div className="space-y-1">
            <Label>
              Kecamatan Asal
              <span className="font-extrabold text-red-400">*</span>
            </Label>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full cursor-pointer rounded-md">
                <SelectValue placeholder="Pilih kecamatan" />
              </SelectTrigger>
              <SelectContent>
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
              <p className="text-xs text-destructive">
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
          <div className="space-y-1">
            <Label>Deskripsi Produk</Label>
            <Textarea className="rounded-md" {...field} />
          </div>
        )}
      />

      <Button
        type="submit"
        className="w-full h-12 rounded-md cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            Menganalisis...
            <LoaderCircle className="h-4 w-4 animate-spin" />
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
