import { Check, ChevronDown, Scale, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "../ui/collapsible";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { DSSResult } from "@/data/types/dss.types";
import { ahpCriteria } from "@/playgrounds/ahp.playground";
import { cn } from "@/lib/utils";

type AhpDetailDropdownProps = {
  dssResult: DSSResult;
  isAhpDetailOpen: boolean;
  onOpenChange: (value: boolean) => void;
};

export default function AhpDetailsDropdown({
  dssResult,
  isAhpDetailOpen,
  onOpenChange
}: AhpDetailDropdownProps) {
  const isConsistent = dssResult.ahpResult.consistencyRatio <= 0.1;

  return (
    <Collapsible open={isAhpDetailOpen} onOpenChange={onOpenChange}>
      <Card className="rounded-xl border-[#28344A]/10">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28344A]/40 focus-visible:ring-offset-2">
            <CardHeader className="cursor-pointer">
              <CardTitle className="flex items-center gap-x-2 font-display font-bold tracking-tight text-[#23262B]">
                <Scale className="h-5 w-5 text-[#28344A]" /> Bobot Kriteria
                <ChevronDown
                  className={cn(
                    "ml-auto h-4 w-4 text-[#28344A]/40 transition-transform duration-200 motion-reduce:transition-none",
                    isAhpDetailOpen && "rotate-180"
                  )}
                />
              </CardTitle>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="px-0 sm:px-6">
            <div className="mb-4 inline-flex flex-wrap items-center gap-x-2 gap-y-2 px-5 text-[#23262B]/70 sm:px-0">
              Rasio Konsistensi (CR)
              <Badge
                variant="outline"
                className="border-[#28344A]/15 bg-white font-mono tabular-nums text-[#23262B]"
              >
                {dssResult.ahpResult.consistencyRatio.toFixed(2)}
              </Badge>
              {isConsistent ? (
                <Badge
                  variant="outline"
                  className="gap-1 border-[#3F7D55]/25 bg-[#3F7D55]/10 text-[#3F7D55]"
                >
                  <Check className="h-3.5 w-3.5" /> Konsisten
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="gap-1 border-[#B8453D]/25 bg-[#B8453D]/10 text-[#B8453D]"
                >
                  <TriangleAlert className="h-3.5 w-3.5" /> Belum Konsisten
                </Badge>
              )}
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-[480px]">
                <TableHeader>
                  <TableRow className="bg-[#EEF0E8] hover:bg-[#EEF0E8]">
                    <TableHead className="text-xs font-bold text-[#23262B]">
                      ID
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#23262B]">
                      Kriteria
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#23262B]">
                      Tipe
                    </TableHead>
                    <TableHead className="text-right text-xs font-bold text-[#23262B]">
                      Bobot (%)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ahpCriteria.map((criteria) => {
                    const isBenefit = criteria.type === "benefit";
                    return (
                      <TableRow
                        key={criteria.id}
                        className="even:bg-[#28344A]/[0.03] hover:bg-[#28344A]/[0.06]"
                      >
                        <TableCell className="font-mono text-[#23262B]/70">
                          {criteria.id}
                        </TableCell>
                        <TableCell className="font-medium text-[#23262B]">
                          {criteria.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "uppercase",
                              isBenefit
                                ? "border-[#3F7D55]/25 bg-[#3F7D55]/10 text-[#3F7D55]"
                                : "border-[#B8453D]/25 bg-[#B8453D]/10 text-[#B8453D]"
                            )}
                          >
                            {criteria.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className="border-[#28344A]/15 bg-white font-mono tabular-nums text-[#23262B]"
                          >
                            {(
                              dssResult.ahpResult.weights[criteria.id] * 100
                            ).toFixed(2)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
