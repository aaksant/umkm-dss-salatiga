import { DSSResult } from "@/data/types/dss.types";
import { MapPin, Store, Tag } from "lucide-react";

type ResultHeaderProps = {
  dssResult: DSSResult;
};

export default function ResultHeader({ dssResult }: ResultHeaderProps) {
  const { namaUsaha, sektor, skala, kecamatan } = dssResult.profile;

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#28344A]/12 bg-white p-6 shadow-sm sm:p-8">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#28344A]/[0.03] blur-2xl"></div>
      <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[#C8862E]/[0.04] blur-2xl"></div>

      <div className="relative z-10 flex flex-col gap-6">
        <span className="text-right font-mono text-xs font-bold tracking-widest text-[#28344A]">
          Tanggal dibuat:{" "}
          {dssResult.createdAt
            ? new Date(dssResult.createdAt).toLocaleDateString("id-ID")
            : "—"}
        </span>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#23262B] sm:text-4xl">
              Laporan Analisis <br className="hidden sm:block" />
              <span className="text-[#28344A]">Distribusi Produk</span>
            </h1>
            <p className="font-sans text-sm font-medium text-[#23262B]/60">
              Hasil evaluasi prospek kelurahan di Salatiga.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-[#C8862E]/10 p-3 pr-5 sm:justify-end">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C8862E] shadow-sm">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#C8862E]/80">
                Profil Usaha
              </span>
              <span className="font-display text-lg font-bold leading-tight text-[#C8862E]">
                {namaUsaha}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 divide-y divide-[#28344A]/10 rounded-xl border border-[#28344A]/10 bg-[#EEF0E8]/30 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-white p-2 shadow-sm">
              <Tag className="h-4 w-4 text-[#28344A]/60" />
            </div>
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#23262B]/50">
                Sektor Usaha
              </p>
              <p className="font-sans text-sm font-bold capitalize text-[#23262B]">
                {sektor}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-white p-2 shadow-sm">
              <Store className="h-4 w-4 text-[#28344A]/60" />
            </div>
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#23262B]/50">
                Skala Operasional
              </p>
              <p className="font-sans text-sm font-bold capitalize text-[#23262B]">
                {skala}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-white p-2 shadow-sm">
              <MapPin className="h-4 w-4 text-[#28344A]/60" />
            </div>
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#23262B]/50">
                Kecamatan Asal
              </p>
              <p className="font-sans text-sm font-bold capitalize text-[#23262B]">
                {kecamatan}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
