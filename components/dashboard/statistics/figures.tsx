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
    <Card className="rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Grafik Elbow</CardTitle>
        <CardDescription>
          Grafik ini menunjukkan perubahan kualitas saat jumlah kelompok
          ditambah: di awal meningkat banyak, tetapi lama-kelamaan
          peningkatannya kecil. Titik yang membentuk “siku” pada grafik itulah
          yang dipilih sebagai jumlah cluster terbaik.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={elbowData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="k"
              label={{
                value: "K",
                position: "insideBottom",
                offset: -2,
                fontSize: 11
              }}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              label={{
                value: "WCSS",
                fontSize: 11,
                position: "insideLeft",
                offset: -2
              }}
              tick={{ fontSize: 10 }}
            />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Line
              type="natural"
              dataKey="wcss"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Semua Kelurahan dan Cluster
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-bold">Kelurahan</TableHead>
              <TableHead className="text-xs font-bold">Kecamatan</TableHead>
              <TableHead className="text-xs font-bold">Jumlah UMKM</TableHead>
              <TableHead className="text-xs font-bold">
                Jumlah Ber-NIB
              </TableHead>
              <TableHead className="text-xs font-bold">Populasi</TableHead>
              <TableHead className="text-xs font-bold">Cluster</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Index aman karena jumlah kelurahan tetap */}
            {tableData.map((data, i) => (
              <TableRow key={i}>
                <TableCell>{data.kelurahan}</TableCell>
                <TableCell>{data.kecacmatan}</TableCell>
                <TableCell>{data.totalUsaha}</TableCell>
                <TableCell>{data.berNib}</TableCell>
                <TableCell>{data.populasi}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-neutral-100">
                    {data.cluster}
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
