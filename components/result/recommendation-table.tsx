import { TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { Badge } from "../ui/badge";
import { DSSResult } from "@/data/types/dss.types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type RecommendationTableProps = {
  dssResult: DSSResult;
};

export default function RecommendationTable({
  dssResult
}: RecommendationTableProps) {
  const results = dssResult.topsisRecommendation.detail.results;

  return (
    <Card className="rounded-xl border-[#28344A]/10">
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-x-2 font-display font-bold tracking-tight text-[#23262B]">
          <TrendingUp className="h-5 w-5 text-[#28344A]" /> Peringkat
          Rekomendasi
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="overflow-x-auto">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow className="bg-[#EEF0E8] hover:bg-[#EEF0E8]">
                <TableHead className="text-xs font-bold text-[#23262B]">
                  Peringkat
                </TableHead>
                <TableHead className="text-xs font-bold text-[#23262B]">
                  Kelurahan
                </TableHead>
                <TableHead className="text-xs font-bold text-[#23262B]">
                  Kecamatan
                </TableHead>
                <TableHead className="text-xs font-bold capitalize text-[#23262B]">
                  {dssResult.profile.sektor} (%)
                </TableHead>
                <TableHead className="text-right text-xs font-bold text-[#23262B]">
                  Total UMKM
                </TableHead>
                <TableHead className="text-xs font-bold text-[#23262B]">
                  Skor TOPSIS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, i) => {
                const isTop = result.rank === 1;
                return (
                  <TableRow
                    key={i}
                    className="even:bg-[#28344A]/[0.03] hover:bg-[#28344A]/[0.06]"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          isTop
                            ? "border-[#C8862E]/30 bg-[#C8862E]/15 font-mono text-[#C8862E] font-bold"
                            : "border-[#28344A]/15 bg-white font-mono text-[#23262B]/70"
                        }
                      >
                        #{result.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-[#23262B]">
                      {result.kelurahan}
                    </TableCell>
                    <TableCell className="text-[#23262B] font-medium">
                      {result.kecamatan}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="border-[#C8862E]/20 bg-[#C8862E]/10 font-mono tabular-nums text-[#C8862E]"
                      >
                        {((result.C2 / result.total) * 100).toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-[#23262B]">
                      {result.total}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold tabular-nums text-[#23262B] text-center">
                      {result.score.toFixed(3)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
