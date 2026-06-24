import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type PipelineStep = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badgeContent: string;
};

const pipelineSteps: PipelineStep[] = [
  {
    id: "1",
    title: "Pengelompokan Wilayah",
    subtitle: "K-Means Clustering. Dijalankan saat aplikasi dimuat",
    badgeContent: "Otomatis",
    description:
      "23 kelurahan di Kota Salatiga dikelompokkan berdasarkan kemiripan profil pasarnya menggunakan algoritma K-Means. Pengelompokan ini memastikan bahwa TOPSIS hanya membandingkan kelurahan yang karakteristiknya serupa sehingga hasil ranking memiliki cakupan yang sama. Jumlah cluster dipilih berdasarkan Silhouette Score tertinggi."
  },
  {
    id: "2",
    title: "Pembobotan Kriteria",
    subtitle:
      "Analytic Hierarchy Process (AHP). Dihitung dari hasil wawancara pakar",
    badgeContent: "Pre-computed",
    description:
      "Setiap kriteria evaluasi (kepadatan penduduk, kompetisi, total UMKM, pusat perdagangan) diberi bobot menggunakan AHP. Bobot ini ditetapkan berdasarkan hasil wawancara dengan pakar dan bersifat tetap. Konsistensi penilaian pakar diuji dengan Consistency Ratio (CR). Nilai CR < 0.1 dianggap konsisten."
  },
  {
    id: "3",
    title: "Pemeringkatan Rekomendasi",
    subtitle:
      "Technique for Order Preference by Similarity to Ideal Solution (TOPSIS). Dijalankan saat pengguna menekan tombol rekomendasi",
    badgeContent: "Langsung",
    description:
      "Setelah cluster terpilih, TOPSIS meranking seluruh kelurahan di dalamnya. Cluster dipilih menggunakan pendekatan blue ocean. Cluster dengan rasio potensi pasar tertinggi terhadap tingkat kompetisi sektor target. TOPSIS kemudian menilai tiap kelurahan berdasarkan jaraknya ke solusi ideal positif (terbaik) dan negatif (terburuk), dengan bobot dari AHP. Kelurahan dengan skor tertinggi adalah rekomendasi utama."
  }
];

export default function PipelineSteps() {
  return (
    <Card className="rounded-xl border-[#28344A]/10 shadow-none">
      <CardContent>
        {pipelineSteps.map((step, i) => (
          <PipelineRow
            key={step.id}
            {...step}
            isLast={i === pipelineSteps.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function PipelineRow({
  id,
  title,
  subtitle,
  description,
  badgeContent,
  isLast
}: PipelineStep & { isLast: boolean }) {
  return (
    <div className="rounded-xl border-[#28344A]/10 shadow-none">
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#28344A]/30 bg-[#28344A]/10 text-sm font-bold text-[#28344A]">
            {id}
          </div>
          {!isLast && (
            <div
              className="mt-1 w-px flex-1 bg-[#28344A]/15"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="pb-8">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#23262B]">{title}</span>
            <Badge
              variant="outline"
              className="border-[#28344A]/15 bg-white text-xs text-[#23262B]/70"
            >
              {badgeContent}
            </Badge>
          </div>
          <p className="mb-2 text-xs text-[#23262B]/70">{subtitle}</p>
          <p className="text-sm leading-relaxed text-[#23262B]/70">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
