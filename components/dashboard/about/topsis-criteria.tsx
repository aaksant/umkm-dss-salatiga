import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type TopsisCriteria = {
  id: string;
  name: string;
  type: "benefit" | "cost";
  description: string;
  weight: string;
};

const rows: TopsisCriteria[] = [
  {
    id: "C1",
    name: "Kepadatan Penduduk",
    type: "benefit",
    description:
      "Jumlah penduduk per kelurahan. Nilai lebih tinggi berarti potensi pasar lebih besar.",
    weight: "~46%"
  },
  {
    id: "C2",
    name: "Tingkat Kompetisi",
    type: "cost",
    description:
      "Jumlah UMKM pada sektor yang sama di kelurahan tersebut. Nilai lebih rendah berarti persaingan lebih sedikit.",
    weight: "~28%"
  },
  {
    id: "C3",
    name: "Total UMKM",
    type: "benefit",
    description:
      "Total seluruh UMKM di kelurahan. Nilai tinggi berarti ekosistem UMKM sehat karena terdapat banyak UMKM.",
    weight: "~16%"
  },
  {
    id: "C4",
    name: "Pusat Perdagangan",
    type: "benefit",
    description:
      "Jumlah pasar tradisional dan pusat perdagangan. Nilai lebih tinggi berarti aksesibilitas distribusi lebih baik.",
    weight: "~10%"
  }
];

export default function TopsisCriteriaRows() {
  return (
    <>
      <Card className="rounded-md border shadow-none">
        <CardContent className="pt-4 pb-2">
          {rows.map((row) => (
            <TopsisCriteriaRow key={row.id} {...row} />
          ))}
        </CardContent>
      </Card>
      <p className="mt-2 text-xs text-muted-foreground px-1">
        * Bobot bersifat aproksimasi. Bobot final dihitung dari matriks
        perbandingan berpasangan AHP. Tipe <strong>benefit</strong> → nilai
        lebih tinggi lebih baik. Tipe <strong>cost</strong> → nilai lebih rendah
        lebih baik.
      </p>
    </>
  );
}

function TopsisCriteriaRow({
  id,
  name,
  type,
  description,
  weight
}: TopsisCriteria) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
      <div className="flex h-7 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-mono font-semibold">
        {id}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="text-sm font-medium">{name}</span>
          <Badge
            variant={type === "benefit" ? "outline" : "destructive"}
            className={type === "benefit" ? "bg-green-100 text-green-800" : ""}
          >
            {type === "benefit" ? "↑ benefit" : "↓ cost"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-primary">{weight}</p>
        <p className="text-[10px] text-muted-foreground">Bobot</p>
      </div>
    </div>
  );
}
