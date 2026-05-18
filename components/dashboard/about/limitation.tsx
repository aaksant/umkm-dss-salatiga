import { AlertTriangle, Brain, Calendar, MapPin, Scale } from "lucide-react";
import { ReactNode } from "react";

export type Limitation = {
  icon: ReactNode;
  title: string;
  description: string;
};

const limitations: Limitation[] = [
  {
    icon: <Calendar className="w-4 h-4" />,
    title: "Data bersifat statis per September 2025",
    description:
      "Dataset yang digunakan tidak diperbarui secara real-time. Kondisi pasar, jumlah UMKM, dan persaingan di lapangan dapat berubah sewaktu-waktu. Selalu validasi temuan sistem dengan observasi langsung di lapangan."
  },
  {
    icon: <MapPin className="w-4 h-4" />,
    title: "Cakupan terbatas 23 kelurahan di Salatiga",
    description:
      "Potensi distribusi ke wilayah sekitar, seperti Kabupaten Semarang atau Boyolali tidak diperhitungkan."
  },
  {
    icon: <Brain className="w-4 h-4" />,
    title: "Bobot AHP bergantung pada penilaian pakar",
    description:
      "Bobot kriteria ditetapkan berdasarkan wawancara dengan pakar tertentu. Penilaian pakar bersifat subjektif dan dapat berbeda antar individu. Bobot ini merepresentasikan perspektif pakar yang diwawancara, bukan ketetapan yang berlaku secara universal."
  },
  {
    icon: <AlertTriangle className="w-4 h-4" />,
    title: "K-Means bersifat non-deterministik",
    description:
      "Hasil pengelompokan kelurahan dapat sedikit berbeda setiap kali aplikasi dimuat ulang karena K-Means dimulai dari titik awal yang dipilih secara acak. Sistem menjalankan beberapa iterasi dan memilih hasil terbaik, namun variasi kecil tetap mungkin terjadi."
  },
  {
    icon: <Scale className="w-4 h-4" />,
    title: "Kriteria distribusi belum mencakup semua variabel",
    description:
      "Faktor penting lain seperti kondisi infrastruktur jalan, daya beli masyarakat, atau tren konsumsi terkini belum masuk ke dalam model karena keterbatasan data yang tersedia."
  }
];

export default function LimitationRows() {
  return (
    <div className="space-y-3">
      {limitations.map((limitation) => (
        <LimitationRow key={limitation.title} {...limitation} />
      ))}
    </div>
  );
}

function LimitationRow({ icon, title, description }: Limitation) {
  return (
    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
      <div className="mt-0.5  text-amber-600 dark:text-amber-400">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          {title}
        </p>
        <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
