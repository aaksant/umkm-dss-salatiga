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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold tracking-tight inline-flex items-center gap-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Peringkat Rekomendasi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-bold">Peringkat</TableHead>
              <TableHead className="text-xs font-bold">Kelurahan</TableHead>
              <TableHead className="text-xs font-bold">Kecamatan</TableHead>
              <TableHead className="text-xs font-bold capitalize">
                {dssResult.profile.sektor} (%)
              </TableHead>
              <TableHead className="text-xs font-bold">Total UMKM</TableHead>
              <TableHead className="text-xs font-bold">Skor TOPSIS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dssResult.topsisRecommendation.detail.results.map((result, i) => (
              <TableRow key={i}>
                <TableCell>{result.rank}</TableCell>
                <TableCell>{result.kelurahan}</TableCell>
                <TableCell>{result.kecamatan}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50">
                    {((result.C2 / result.total) * 100).toFixed(2)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50">
                    {result.total}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50">
                    {result.score.toFixed(3)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
