import { Calculator, ChevronDown, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "../ui/collapsible";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ahpCriteria } from "@/playgrounds/ahp.playground";
import { Badge } from "../ui/badge";
import { DSSResult } from "@/data/types/dss.types";

type TopsisDetailsDropdownProps = {
  dssResult: DSSResult;
  isTopsisDetailOpen: boolean;
  onOpenChange: (value: boolean) => void;
};

export default function TopsisDetailDropdown({
  dssResult,
  isTopsisDetailOpen,
  onOpenChange
}: TopsisDetailsDropdownProps) {
  return (
    <Collapsible open={isTopsisDetailOpen} onOpenChange={onOpenChange}>
      <Card className="rounded-xl border-[#28344A]/10">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28344A]/40 focus-visible:ring-offset-2">
            <CardHeader className="cursor-pointer">
              <CardTitle className="flex items-center gap-x-2 font-display font-bold tracking-tight text-[#23262B]">
                <Calculator className="h-5 w-5 text-[#28344A]" /> Detail
                Perhitungan TOPSIS
                <ChevronDown
                  className={cn(
                    "ml-auto h-4 w-4 text-[#28344A]/40 transition-transform duration-200 motion-reduce:transition-none",
                    isTopsisDetailOpen && "rotate-180"
                  )}
                />
              </CardTitle>
            </CardHeader>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="bg-[#EEF0E8]/10 px-0 pb-6 sm:px-6">
            <div className="mb-8 mt-4">
              <h4 className="mb-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[#23262B]/50 sm:px-0">
                Matriks Keputusan Awal
              </h4>
              <div className="overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader className="bg-[#EEF0E8]/60">
                    <TableRow className="border-[#D6DAD0]/50 hover:bg-transparent">
                      <TableHead className="text-xs font-bold text-[#23262B]">
                        Kelurahan
                      </TableHead>
                      {ahpCriteria.map((criteria) => (
                        <TableHead
                          key={criteria.id}
                          className="text-right text-xs font-bold text-[#23262B]"
                        >
                          <span className="inline-flex items-center justify-end gap-x-1 w-full">
                            {criteria.id}
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>{criteria.name}</TooltipContent>
                            </Tooltip>
                          </span>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dssResult.topsisRecommendation.detail.results.map(
                      (res, i) => (
                        <TableRow
                          key={i}
                          className="even:bg-[#28344A]/[0.02] border-[#D6DAD0]/30 hover:bg-[#28344A]/[0.05]"
                        >
                          <TableCell className="font-medium text-[#23262B]">
                            {res.kelurahan}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-[#23262B]">
                            {new Intl.NumberFormat("id-ID").format(res.C1)}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-[#23262B]">
                            {res.C2}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-[#23262B]">
                            {res.C3}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-[#23262B]">
                            {res.C4}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="mb-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[#23262B]/50 sm:px-0">
                Jarak ke Solusi Ideal & Skor Preferensi
              </h4>
              <div className="overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader className="bg-[#EEF0E8]/60">
                    <TableRow className="border-[#D6DAD0]/50 hover:bg-transparent">
                      <TableHead className="text-xs font-bold text-[#23262B]">
                        Kelurahan
                      </TableHead>
                      <TableHead className="text-right text-xs font-bold text-[#23262B]">
                        Jarak Ideal [D+]
                      </TableHead>
                      <TableHead className="text-right text-xs font-bold text-[#23262B]">
                        Jarak Negatif [D-]
                      </TableHead>
                      <TableHead className="text-right text-xs font-bold text-[#28344A]">
                        Skor Preferensi (Vi)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dssResult.topsisRecommendation.detail.results.map(
                      (res) => (
                        <TableRow
                          key={res.rank}
                          className="even:bg-[#28344A]/[0.02] border-[#D6DAD0]/30 hover:bg-[#28344A]/[0.05]"
                        >
                          <TableCell className="font-medium text-[#23262B]">
                            {res.kelurahan}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs font-semibold tabular-nums text-[#3F7D55]/80">
                            {res.distancePositives.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs font-semibold tabular-nums text-[#B8453D]/80">
                            {res.distanceNegatives.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className="border-[#28344A]/20 bg-white font-mono font-bold tabular-nums text-[#28344A]"
                            >
                              {res.score.toFixed(4)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-0">
              <div className="rounded-xl border border-[#3F7D55]/20 bg-[#3F7D55]/5 p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#3F7D55]">
                  Solusi Ideal Positif (A+)
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {ahpCriteria.map((criteria, i) => (
                    <div
                      key={criteria.id}
                      className="flex items-center rounded-md border border-[#3F7D55]/15 bg-white px-2 py-1 shadow-sm"
                    >
                      <span className="mr-2 font-sans text-[10px] font-bold text-[#3F7D55]/70">
                        {criteria.id}
                      </span>
                      <span className="font-mono text-xs font-semibold tabular-nums text-[#3F7D55]">
                        {dssResult.topsisRecommendation.detail.idealPositives[
                          i
                        ].toFixed(4)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#B8453D]/20 bg-[#B8453D]/5 p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#B8453D]">
                  Solusi Ideal Negatif (A-)
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {ahpCriteria.map((criteria, i) => (
                    <div
                      key={criteria.id}
                      className="flex items-center rounded-md border border-[#B8453D]/15 bg-white px-2 py-1 shadow-sm"
                    >
                      <span className="mr-2 font-sans text-[10px] font-bold text-[#B8453D]/70">
                        {criteria.id}
                      </span>
                      <span className="font-mono text-xs font-semibold tabular-nums text-[#B8453D]">
                        {dssResult.topsisRecommendation.detail.idealNegatives[
                          i
                        ].toFixed(4)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
