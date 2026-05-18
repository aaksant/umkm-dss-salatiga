import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Calendar, ChevronRight } from "lucide-react";

type DataSource = {
  label: string;
  description: string;
};

const dataSources: DataSource[] = [
  {
    label: "kuliner, fashion, agribisnis, perdagangan",
    description: "Jumlah UMKM per sektor usaha di kelurahan tersebut."
  },
  {
    label: "totalUsaha",
    description: "Total UMKM aktif."
  },
  {
    label: "berNib",
    description:
      "Jumlah UMKM yang sudah memiliki Nomor Induk Berusaha, indikator formalitas dan kematangan ekosistem usaha."
  },
  {
    label: "populasi",
    description:
      "Jumlah penduduk kelurahan. Bersumber dari data BPS Kota Salatiga."
  },
  {
    label: "pasar",
    description:
      "Jumlah pasar tradisional dan pusat perdagangan yang beroperasi di kelurahan."
  }
];

export default function DataSourceRows() {
  return (
    <Card className="rounded-md border shadow-none">
      <CardHeader>
        <CardTitle className="text-sm">Dataset UMKM Kota Salatiga</CardTitle>
        <CardDescription className="flex items-center gap-x-2 text-xs">
          <Calendar className="w-3 h-3" />
          Dinas Koperasi dan UMKM Kota Salatiga per September 2025.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {dataSources.map((dataSource) => (
            <DataSourceRow key={dataSource.label} {...dataSource} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DataSourceRow({ label, description }: DataSource) {
  return (
    <div className="flex items-start gap-2 py-2 border-b last:border-b-0">
      <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
      <div>
        <span className="text-sm font-medium font-mono">{label}</span>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}
