import { Badge } from "@/components/ui/badge";

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
      "23 kelurahan di Kota Salatiga dikelompokkan berdasarkan kemiripan profil pasarnya menggunakan algoritma K-Means. Pengelompokan ini memastikan bahwa TOPSIS hanya membandingkan kelurahan yang karakteristiknya serupa sehingga hasil ranking memiliki cakupan yang sam. Jumlah cluster dipilih berdasarkan Silhouette Score tertinggi."
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
    <div>
      {pipelineSteps.map((step) => (
        <PipelineRow key={step.id} {...step} />
      ))}
    </div>
  );
}

function PipelineRow({
  id,
  title,
  subtitle,
  description,
  badgeContent
}: PipelineStep) {
  return (
    <div>
      <div className="flex gap-4">
        {/* nomor + garis vertikal */}
        <div className="flex flex-col items-center">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-blue-400 bg-blue-50 text-sm font-bold text-primary">
            {id}
          </div>
        </div>

        {/* Konten */}
        <div className="pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold">{title}</span>
            <Badge variant="outline" className="text-xs">
              {badgeContent}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
