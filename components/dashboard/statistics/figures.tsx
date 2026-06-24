import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type ElbowChartProps = {
  elbowData: {
    k: number;
    wcss: number;
    silhouette: number;
  }[];
};

type ClusterResultTableProps = {
  tableData: {
    kelurahan: string;
    kecacmatan: string;
    totalUsaha: number;
    berNib: number;
    populasi: number;
    cluster: number;
  }[];
};

export function ElbowChart({ elbowData }: ElbowChartProps) {
  return (
    <Card className="rounded-xl border-[#28344A]/10">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-xl font-bold tracking-tight text-[#23262B]">
          Grafik Elbow
        </CardTitle>
        <CardDescription className="text-[#23262B]/60">
          Grafik ini menunjukkan perubahan kualitas saat jumlah kelompok
          ditambah: di awal meningkat banyak, tetapi lama-kelamaan
          peningkatannya kecil. Titik yang membentuk “siku” pada grafik itulah
          yang dipilih sebagai jumlah cluster terbaik.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={elbowData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#28344A"
              strokeOpacity={0.1}
            />
            <XAxis
              dataKey="k"
              label={{
                value: "K",
                position: "insideBottom",
                offset: -2,
                fontSize: 11,
                fill: "#23262B",
                fillOpacity: 0.6
              }}
              tick={{ fontSize: 11, fill: "#23262B", fillOpacity: 0.6 }}
              stroke="#28344A"
              strokeOpacity={0.2}
            />
            <YAxis
              label={{
                value: "WCSS",
                fontSize: 11,
                position: "insideLeft",
                offset: -2,
                fill: "#23262B",
                fillOpacity: 0.6
              }}
              tick={{ fontSize: 10, fill: "#23262B", fillOpacity: 0.6 }}
              stroke="#28344A"
              strokeOpacity={0.2}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                borderColor: "rgba(40,52,74,0.15)"
              }}
            />
            <Line
              type="natural"
              dataKey="wcss"
              stroke="#28344A"
              strokeWidth={2}
              dot={{ r: 4, fill: "#C8862E", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#C8862E", strokeWidth: 0 }}
              name="WCSS"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ClusterResultTable({ tableData }: ClusterResultTableProps) {
  return (
    <Card className="rounded-xl border-[#28344A]/10">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-xl font-bold tracking-tight text-[#23262B]">
          Semua Kelurahan dan Cluster
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        {/* overflow-x-auto: 6 kolom tidak akan muat di layar mobile */}
        <div className="overflow-x-auto">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="bg-[#EEF0E8] hover:bg-[#EEF0E8]">
                <TableHead className="text-xs font-bold text-[#23262B]">
                  Kelurahan
                </TableHead>
                <TableHead className="text-xs font-bold text-[#23262B]">
                  Kecamatan
                </TableHead>
                <TableHead className="text-right text-xs font-bold text-[#23262B]">
                  Jumlah UMKM
                </TableHead>
                <TableHead className="text-right text-xs font-bold text-[#23262B]">
                  Jumlah Ber-NIB
                </TableHead>
                <TableHead className="text-right text-xs font-bold text-[#23262B]">
                  Populasi
                </TableHead>
                <TableHead className="text-center text-xs font-bold text-[#23262B]">
                  Cluster
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Index aman karena jumlah kelurahan tetap */}
              {tableData.map((data, i) => (
                <TableRow
                  key={i}
                  className="even:bg-[#28344A]/[0.03] hover:bg-[#28344A]/[0.06]"
                >
                  <TableCell className="font-medium text-[#23262B]">
                    {data.kelurahan}
                  </TableCell>
                  <TableCell className="text-[#23262B]/70">
                    {data.kecacmatan}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-[#23262B]">
                    {data.totalUsaha.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-[#23262B]">
                    {data.berNib.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-[#23262B]">
                    {data.populasi.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="border-[#28344A]/20 bg-[#28344A]/10 font-mono text-[#28344A]"
                    >
                      {data.cluster}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
