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
      <Card className="rounded-lg">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <CardHeader className="cursor-pointer">
              <CardTitle className="font-semibold tracking-tight flex items-center gap-x-2">
                <Calculator className="w-5 h-5 text-blue-600" /> Detail
                Perhitungan TOPSIS
                <ChevronDown
                  className={cn(
                    "ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isTopsisDetailOpen && "rotate-180"
                  )}
                />
              </CardTitle>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <p className="text-muted-foreground text-sm text-muted-foreground">
              Matriks Keputusan
            </p>
            <Table className="mb-6">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-bold">Kelurahan</TableHead>
                  <TableHead className="text-xs font-bold">
                    <span className="inline-flex items-center gap-x-1">
                      C1
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Kepadatan penduduk</TooltipContent>
                      </Tooltip>
                    </span>
                  </TableHead>
                  <TableHead className="text-xs font-bold">
                    <span className="inline-flex items-center gap-x-1">
                      C2
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Tingkat kompetisi produk sejenis
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </TableHead>
                  <TableHead className="text-xs font-bold">
                    <span className="inline-flex items-center gap-x-1">
                      C3
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Total UMKM</TooltipContent>
                      </Tooltip>
                    </span>
                  </TableHead>
                  <TableHead className="text-xs font-bold">
                    <span className="inline-flex items-center gap-x-1">
                      C4
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Pusat perdagangan/pasar</TooltipContent>
                      </Tooltip>
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dssResult.topsisRecommendation.detail.results.map((res, i) => (
                  <TableRow key={i}>
                    <TableCell>{res.kelurahan}</TableCell>
                    <TableCell>{res.C1}</TableCell>
                    <TableCell>{res.C2}</TableCell>
                    <TableCell>{res.C3}</TableCell>
                    <TableCell>{res.C4}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-muted-foreground text-sm text-muted-foreground">
              Jarak ke Solusi Ideal dan Skor Preferensi
            </p>
            <Table className="mb-6">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-bold">Kelurahan</TableHead>
                  <TableHead className="text-xs font-bold text-center">
                    D+
                  </TableHead>
                  <TableHead className="text-xs font-bold text-center">
                    D-
                  </TableHead>
                  <TableHead className="text-xs font-bold text-center">
                    Skor Preferensi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dssResult.topsisRecommendation.detail.results.map((res) => (
                  <TableRow key={res.rank}>
                    <TableCell className="w-md">{res.kelurahan}</TableCell>
                    <TableCell className="text-center">
                      {res.distancePositives.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-center">
                      {res.distanceNegatives.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-center">
                      {res.score.toFixed(3)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm text-muted-foreground">
                  Solusi Ideal Positif
                </p>
                <div className="flex items-center gap-x-2">
                  {ahpCriteria.map((criteria, i) => (
                    <Badge key={criteria.id} variant="outline">
                      {criteria.id}:{" "}
                      {dssResult.topsisRecommendation.detail.idealPositives[
                        i
                      ].toFixed(3)}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm text-muted-foreground">
                  Solusi Ideal Positif
                </p>
                <div className="flex items-center gap-x-2">
                  {ahpCriteria.map((criteria, i) => (
                    <Badge key={criteria.id} variant="outline">
                      {criteria.id}:{" "}
                      {dssResult.topsisRecommendation.detail.idealNegatives[
                        i
                      ].toFixed(3)}
                    </Badge>
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
