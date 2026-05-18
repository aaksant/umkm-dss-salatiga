import DataSourceRows from "@/components/dashboard/about/data-source";
import Definition from "@/components/dashboard/about/definition";
import Faqs from "@/components/dashboard/about/faqs";
import FooterNote from "@/components/dashboard/about/footer-note";
import LimitationRows from "@/components/dashboard/about/limitation";
import PipelineSteps from "@/components/dashboard/about/pipeline";
import SectionHeading from "@/components/dashboard/about/section-heading";
import TopsisCriteriaRows from "@/components/dashboard/about/topsis-criteria";
import {
  BookOpen,
  Database,
  GitMerge,
  Info,
  ListTodo,
  ShieldAlert
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="p-4 pb-16 max-w-4xl mx-auto space-y-10">
      {/* Hero */}
      <div className="space-y-2">
        <h1 className="font-bold tracking-tight text-3xl">Tentang Sistem</h1>
        <p className="text-muted-foreground leading-relaxed text-sm">
          Panduan lengkap cara kerja, sumber data, dan batasan sistem
          rekomendasi ini. Baca halaman ini sebelum menginterpretasikan hasil
          rekomendasi.
        </p>
      </div>
      <div>
        <SectionHeading
          icon={<Info className="h-4 w-4" />}
          title="Apa Itu Sistem Ini?"
        />
        <Definition />
      </div>
      <div>
        <SectionHeading
          icon={<GitMerge className="h-4 w-4" />}
          title="Cara Kerja"
          description="Sistem menjalankan tiga metode secara berurutan untuk menghasilkan rekomendasi."
        />
        <PipelineSteps />
      </div>
      <div>
        <SectionHeading
          icon={<ListTodo className="h-4 w-4" />}
          title="Kriteria evaluasi TOPSIS"
          description="Empat kriteria berikut digunakan untuk menilai setiap kelurahan."
        />
        <TopsisCriteriaRows />
      </div>
      <section>
        <SectionHeading
          icon={<Database className="h-4 w-4" />}
          title="Sumber Data"
        />
        <DataSourceRows />
      </section>
      <section>
        <SectionHeading
          icon={<ShieldAlert className="h-4 w-4" />}
          title="Batasan sistem"
          description="Pahami keterbatasan berikut sebelum mengambil keputusan berdasarkan rekomendasi ini."
        />
        <LimitationRows />
      </section>
      <section>
        <SectionHeading
          icon={<BookOpen className="h-4 w-4" />}
          title="Pertanyaan umum"
        />
        <Faqs />
      </section>
      <FooterNote />
    </div>
  );
}
