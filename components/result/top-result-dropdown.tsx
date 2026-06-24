import { ChevronDown, FileUser, Store, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "../ui/collapsible";
import { cn } from "@/lib/utils";
import { TopsisResult } from "@/data/types/topsis.types";
import { DSSResult } from "@/data/types/dss.types";

type TopResultDropdownProps = {
  dssResult: DSSResult;
  topResult: TopsisResult;
  isTopResultOpen: boolean;
  onOpenChange: (value: boolean) => void;
};

export default function TopResultDropdown({
  dssResult,
  isTopResultOpen,
  topResult,
  onOpenChange
}: TopResultDropdownProps) {
  return (
    <Collapsible open={isTopResultOpen} onOpenChange={onOpenChange}>
      <Card className="relative overflow-hidden rounded-xl border border-[#28344A]/15 bg-white py-6 shadow-sm transition-colors motion-reduce:transition-none hover:border-[#28344A]/30">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28344A]/40 focus-visible:ring-offset-2">
            <CardHeader className="flex cursor-pointer flex-col justify-between gap-4 px-5 pb-4 pt-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#C8862E]/15">
                  <h2 className="font-mono text-2xl font-bold text-[#C8862E]">
                    #1
                  </h2>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#C8862E]">
                    Rekomendasi Teratas
                  </p>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-[#23262B]">
                    Kelurahan {topResult.kelurahan}
                  </h3>
                  <p className="font-sans text-sm font-medium text-[#23262B]/60">
                    Kecamatan {topResult.kecamatan}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end md:gap-4">
                <div className="text-left md:text-right">
                  <p className="mb-0.5 text-[11px] font-bold uppercase tracking-widest text-[#23262B]/50">
                    Skor TOPSIS
                  </p>
                  <h2 className="font-mono text-3xl font-bold text-[#3F7D55]">
                    {topResult.score.toFixed(4)}
                  </h2>
                </div>
              </div>
            </CardHeader>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="px-5 pb-2 pt-0">
            <div className="rounded-xl border border-[#28344A]/10 bg-[#EEF0E8]/50 p-5 pt-6">
              <h4 className="mb-5 text-center text-[11px] font-bold uppercase tracking-widest text-[#23262B]/50 md:text-left">
                Karakteristik Wilayah
              </h4>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center rounded-xl border border-[#28344A]/10 bg-white p-4 shadow-sm transition-all motion-reduce:transition-none hover:shadow-md">
                  <div className="mb-3 rounded-full bg-[#C8862E]/10 p-2.5 text-[#C8862E]">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="font-mono text-xl font-bold text-[#23262B]">
                      {new Intl.NumberFormat("id-ID").format(topResult.C1)}
                    </p>
                    <p className="font-sans text-xs font-medium text-[#23262B]/70">
                      Populasi Penduduk
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-[#C8862E]/20 bg-white p-4 shadow-sm transition-all motion-reduce:transition-none hover:shadow-md">
                  <div className="mb-3 rounded-full bg-[#C8862E]/10 p-2.5 text-[#C8862E]">
                    <Store className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="font-mono text-xl font-bold text-[#23262B]">
                      {((topResult.C2 / topResult.total) * 100).toFixed(2)}%
                    </p>
                    <p className="font-sans text-xs font-medium text-[#23262B]/70">
                      UMKM Sektor {dssResult.profile.sektor}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-[#28344A]/10 bg-white p-4 shadow-sm transition-all motion-reduce:transition-none hover:shadow-md">
                  <div className="mb-3 rounded-full bg-[#C8862E]/10 p-2.5 text-[#C8862E]">
                    <FileUser className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="font-mono text-xl font-bold text-[#23262B]">
                      {new Intl.NumberFormat("id-ID").format(topResult.C3)}
                    </p>
                    <p className="font-sans text-xs font-medium text-[#23262B]/70">
                      Total UMKM Ber-NIB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
        <CollapsibleTrigger asChild>
          <button className="absolute bottom-0 left-0 flex h-10 w-full items-center justify-center">
            <ChevronDown
              className={cn(
                "h-4 w-4 text-[#28344A]/40 transition-transform duration-300 motion-reduce:transition-none",
                isTopResultOpen && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>
      </Card>
    </Collapsible>
  );
}
