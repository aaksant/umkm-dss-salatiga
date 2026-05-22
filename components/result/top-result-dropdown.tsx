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
      <Card className="overflow-hidden border-2 rounded-lg relative py-0">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <CardHeader className="flex flex-row items-center justify-between px-4 py-5 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <h2 className="text-lg font-semibold text-blue-600">#1</h2>
                </div>
                <div className="space-y-1">
                  <p className="uppercase text-sm text-blue-600 font-semibold">
                    Rekomendasi Teratas
                  </p>
                  <h3 className="text-lg font-bold tracking-tight uppercase">
                    Kelurahan {topResult.kelurahan}
                  </h3>
                  <p className="text-muted-foreground font-semibold uppercase">
                    Kecamatan {topResult.kecamatan}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Skor TOPSIS</p>
                  <h2 className="text-lg font-bold tracking-tight">
                    {topResult.score.toFixed(3)}
                  </h2>
                </div>
              </div>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <div className="absolute left-1/2 bottom-4 -translate-x-1/2">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isTopResultOpen && "rotate-180"
            )}
          />
        </div>
        <CollapsibleContent>
          <CardContent className="pb-10 px-6">
            <div className="border-t pt-6">
              <h4 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-center md:text-left">
                Detail Rekomendasi
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 rounded-xl border bg-slate-50/50 transition-colors hover:bg-slate-50 shadow-sm">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-full mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xl font-black text-slate-800 tracking-tight">
                      {topResult.C1}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      Populasi Kelurahan
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl border bg-slate-50/50 transition-colors hover:bg-slate-50 shadow-sm">
                  <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-full mb-3">
                    <Store className="w-5 h-5" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xl font-black text-slate-800 tracking-tight">
                      {((topResult.C2 / topResult.total) * 100).toFixed(2)}%
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      UMKM Sektor{" "}
                      <span className="uppercase text-emerald-600 font-semibold">
                        {dssResult.profile.sektor}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl border bg-slate-50/50 transition-colors hover:bg-slate-50 shadow-sm">
                  <div className="p-2.5 bg-amber-100 text-amber-600 rounded-full mb-3">
                    <FileUser className="w-5 h-5" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xl font-black text-slate-800 tracking-tight">
                      {topResult.C3}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      Total UMKM Terdaftar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
