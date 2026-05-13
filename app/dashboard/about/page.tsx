"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  AlertTriangle,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  Database,
  GitMerge,
  Info,
  ListTodo,
  MapPin,
  Scale,
  ShieldAlert
} from "lucide-react";

// ─── Tipe ─────────────────────────────────────────────────────────────────────

type PipelineStepProps = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeVariant?: "default" | "secondary" | "outline";
};

type CriteriaRowProps = {
  id: string;
  name: string;
  type: "benefit" | "cost";
  description: string;
  weight: string;
};

type DataFieldProps = {
  label: string;
  description: string;
};

type LimitationProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function SectionHeading({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

function PipelineStep({
  number,
  title,
  subtitle,
  description,
  badge
}: PipelineStepProps) {
  return (
    <div className="flex gap-4">
      {/* Nomor + garis vertikal */}
      <div className="flex flex-col items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-blue-400 bg-blue-50 text-sm font-bold text-primary">
          {number}
        </div>
        {/* <div className="mt-1 w-px flex-1 bg-border" /> */}
      </div>

      {/* Konten */}
      <div className="pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {/* <div className="text-primary">{icon}</div> */}
          <span className="font-semibold">{title}</span>
          <Badge variant="outline" className="text-xs">
            {badge}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function CriteriaRow({
  id,
  name,
  type,
  description,
  weight
}: CriteriaRowProps) {
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

function DataField({ label, description }: DataFieldProps) {
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

function LimitationCard({ icon, title, description }: LimitationProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
      <div className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400">
        {icon}
      </div>
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

      {/* Pengertian */}
      <div>
        <SectionHeading
          icon={<Info className="h-4 w-4" />}
          title="Apa Itu Sistem Ini?"
        />
        <Card className="rounded-md border shadow-none">
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Sistem ini adalah{" "}
              <strong className="text-foreground">
                Decision Support System (DSS)
              </strong>{" "}
              atau alat bantu pengambilan keputusan berbasis data yang dirancang
              untuk membantu pelaku UMKM di Kota Salatiga menentukan kelurahan
              mana yang paling prospektif sebagai target distribusi produk.
            </p>
            <p>
              Sistem ini{" "}
              <strong className="text-foreground">tidak menggantikan</strong>{" "}
              penilaian dan pengalaman pengguna. Rekomendasi yang dihasilkan
              bersifat kuantitatif dan harus dikombinasikan dengan pengamatan
              lapangan secara langsung.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cara kerja  */}
      <div>
        <SectionHeading
          icon={<GitMerge className="h-4 w-4" />}
          title="Cara Kerja"
          description="Sistem menjalankan tiga metode secara berurutan untuk menghasilkan rekomendasi."
        />

        <div>
          <PipelineStep
            number="1"
            title="Pengelompokan Wilayah"
            subtitle="K-Means Clustering. Dijalankan saat aplikasi dimuat"
            badge="Otomatis"
            description="23 kelurahan di Kota Salatiga dikelompokkan berdasarkan kemiripan profil pasarnya menggunakan algoritma K-Means. Pengelompokan ini memastikan bahwa TOPSIS hanya membandingkan kelurahan yang karakteristiknya serupa sehingga hasil ranking memiliki cakupan yang sam. Jumlah cluster dipilih berdasarkan Silhouette Score tertinggi."
          />
          <PipelineStep
            number="2"
            title="Pembobotan Kriteria"
            subtitle="Analytic Hierarchy Process (AHP). Dihitung dari hasil wawancara pakar"
            badge="Pre-computed"
            badgeVariant="outline"
            description="Setiap kriteria evaluasi (kepadatan penduduk, kompetisi, total UMKM, pusat perdagangan) diberi bobot menggunakan AHP. Bobot ini ditetapkan berdasarkan hasil wawancara dengan pakar dan bersifat tetap. Konsistensi penilaian pakar diuji dengan Consistency Ratio (CR). Nilai CR < 0.1 dianggap konsisten."
          />
          <PipelineStep
            number="3"
            title="Pemeringkatan Rekomendasi"
            subtitle="Technique for Order Preference by Similarity to Ideal Solution (TOPSIS). Dijalankan saat pengguna menekan tombol rekomendasi"
            badge="Real-time"
            description="Setelah cluster terpilih, TOPSIS meranking seluruh kelurahan di dalamnya. Cluster dipilih menggunakan pendekatan blue ocean. Cluster dengan rasio potensi pasar tertinggi terhadap tingkat kompetisi sektor target. TOPSIS kemudian menilai tiap kelurahan berdasarkan jaraknya ke solusi ideal positif (terbaik) dan negatif (terburuk), dengan bobot dari AHP. Kelurahan dengan skor tertinggi adalah rekomendasi utama."
          />
        </div>
      </div>

      {/* Kriteria AHP */}
      <div>
        <SectionHeading
          icon={<ListTodo className="h-4 w-4" />}
          title="Kriteria evaluasi TOPSIS"
          description="Empat kriteria berikut digunakan untuk menilai setiap kelurahan."
        />
        <Card className="rounded-md border shadow-none">
          <CardContent className="pt-4 pb-2">
            <CriteriaRow
              id="C1"
              name="Kepadatan Penduduk"
              type="benefit"
              description="Jumlah penduduk per kelurahan. Nilai lebih tinggi berarti potensi pasar lebih besar."
              weight="~46%"
            />
            <CriteriaRow
              id="C2"
              name="Tingkat Kompetisi"
              type="cost"
              description="Jumlah UMKM pada sektor yang sama di kelurahan tersebut. Nilai lebih rendah berarti persaingan lebih sedikit."
              weight="~28%"
            />
            <CriteriaRow
              id="C3"
              name="Total UMKM"
              type="benefit"
              description="Total seluruh UMKM di kelurahan. Nilai tinggi berarti ekosistem UMKM sehat karena terdapat banyak UMKM."
              weight="~16%"
            />
            <CriteriaRow
              id="C4"
              name="Pusat Perdagangan"
              type="benefit"
              description="Jumlah pasar tradisional dan pusat perdagangan. Nilai lebih tinggi berarti aksesibilitas distribusi lebih baik."
              weight="~10%"
            />
          </CardContent>
        </Card>
        <p className="mt-2 text-xs text-muted-foreground px-1">
          * Bobot bersifat aproksimasi. Bobot final dihitung dari matriks
          perbandingan berpasangan AHP. Tipe <strong>benefit</strong> → nilai
          lebih tinggi lebih baik. Tipe <strong>cost</strong> → nilai lebih
          rendah lebih baik.
        </p>
      </div>

      {/* ── 4. Sumber data ── */}
      <section>
        <SectionHeading
          icon={<Database className="h-4 w-4" />}
          title="Sumber Data"
        />
        <Card className="rounded-md border shadow-none">
          <CardHeader>
            <CardTitle className="text-sm">
              Dataset UMKM Kota Salatiga
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-xs">
              <CalendarDays className="h-3 w-3" />
              Dinas Koperasi dan UKM Kota Salatiga per September 2025.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              Dataset mencakup{" "}
              <strong className="text-foreground">23 kelurahan</strong> di 4
              kecamatan Kota Salatiga. Setiap kelurahan memiliki data berikut:
            </p>
            <div className="divide-y">
              <DataField
                label="kuliner, fashion, agribisnis, perdagangan"
                description="Jumlah UMKM per sektor usaha di kelurahan tersebut."
              />
              <DataField
                label="totalUsaha"
                description="Total UMKM aktif (tidak termasuk sektor otomotif, pendidikan, dan teknologi yang dianggap tidak dapat didistribusikan)."
              />
              <DataField
                label="berNib"
                description="Jumlah UMKM yang sudah memiliki Nomor Induk Berusaha — indikator formalitas dan kematangan ekosistem usaha."
              />
              <DataField
                label="populasi"
                description="Jumlah penduduk kelurahan. Bersumber dari data BPS Kota Salatiga."
              />
              <DataField
                label="pasar"
                description="Jumlah pasar tradisional dan pusat perdagangan yang beroperasi di kelurahan."
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── 5. Limitasi ── */}
      <section>
        <SectionHeading
          icon={<ShieldAlert className="h-4 w-4" />}
          title="Batasan sistem"
          description="Pahami keterbatasan berikut sebelum mengambil keputusan berdasarkan rekomendasi ini."
        />
        <div className="space-y-3">
          <LimitationCard
            icon={<CalendarDays className="h-4 w-4" />}
            title="Data statis per Januari 2025"
            description="Dataset yang digunakan tidak diperbarui secara real-time. Kondisi pasar, jumlah UMKM, dan persaingan di lapangan dapat berubah sewaktu-waktu. Selalu validasi temuan sistem dengan observasi langsung di lapangan."
          />
          <LimitationCard
            icon={<MapPin className="h-4 w-4" />}
            title="Cakupan terbatas 23 kelurahan"
            description="Sistem hanya mencakup kelurahan di dalam batas administratif Kota Salatiga. Potensi distribusi ke wilayah sekitar (Kabupaten Semarang, Boyolali) tidak diperhitungkan."
          />
          <LimitationCard
            icon={<BrainCircuit className="h-4 w-4" />}
            title="Bobot AHP bergantung pada penilaian pakar"
            description="Bobot kriteria ditetapkan berdasarkan wawancara dengan pakar tertentu. Penilaian pakar bersifat subjektif dan dapat berbeda antar individu. Bobot ini merepresentasikan perspektif pakar yang diwawancara, bukan konsensus universal."
          />
          <LimitationCard
            icon={<AlertTriangle className="h-4 w-4" />}
            title="K-Means bersifat non-deterministik"
            description="Hasil pengelompokan kelurahan dapat sedikit berbeda setiap kali aplikasi dimuat ulang karena K-Means dimulai dari titik awal yang dipilih secara acak. Sistem menjalankan beberapa iterasi dan memilih hasil terbaik, namun variasi kecil tetap mungkin terjadi."
          />
          <LimitationCard
            icon={<Scale className="h-4 w-4" />}
            title="Kriteria distribusi belum mencakup semua variabel"
            description="Faktor penting lain seperti kondisi infrastruktur jalan, daya beli masyarakat, atau tren konsumsi terkini belum masuk ke dalam model karena keterbatasan data yang tersedia."
          />
        </div>
      </section>

      {/* ── 6. FAQ ── */}
      <section>
        <SectionHeading
          icon={<BookOpen className="h-4 w-4" />}
          title="Pertanyaan umum"
        />
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem
            value="q1"
            className="border rounded-md px-4 shadow-none"
          >
            <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
              Apakah hasil rekomendasi selalu akurat?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              Tidak ada sistem rekomendasi yang menjamin akurasi 100%. Sistem
              ini mengoptimalkan berdasarkan data yang tersedia dan model
              matematika yang telah divalidasi. Gunakan hasil ini sebagai salah
              satu pertimbangan, bukan satu-satunya acuan keputusan.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="q2"
            className="border rounded-md px-4 shadow-none"
          >
            <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
              Mengapa skor TOPSIS bisa bernilai negatif atau sangat kecil?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              Skor TOPSIS berada pada rentang 0 hingga 1 dan tidak pernah
              negatif. Skor mendekati 1 berarti kelurahan sangat dekat dengan
              kondisi ideal, skor mendekati 0 berarti sangat jauh. Nilai yang
              terlihat "kecil" (misalnya 0.3) tetap valid — itu bukan nilai
              buruk secara absolut, melainkan posisi relatif di antara kelurahan
              lain dalam cluster yang sama.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="q3"
            className="border rounded-md px-4 shadow-none"
          >
            <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
              Mengapa ada nilai negatif pada data statistik?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              Nilai negatif pada data internal sistem (ditandai akhiran{" "}
              <code className="text-xs bg-muted px-1 rounded">_std</code>)
              adalah hasil dari z-score standardisasi — teknik normalisasi
              statistik. Nilai negatif berarti kelurahan tersebut berada di
              bawah rata-rata untuk fitur tertentu. Ini bukan anomali atau
              kesalahan, melainkan bagian dari proses preprocessing sebelum
              K-Means dijalankan.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="q4"
            className="border rounded-md px-4 shadow-none"
          >
            <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
              Apakah data saya disimpan di server?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              Tidak. Seluruh pemrosesan data — termasuk K-Means, AHP, dan TOPSIS
              — berjalan sepenuhnya di perangkat Anda (client-side). Tidak ada
              data profil usaha yang dikirim ke server manapun. Data yang Anda
              masukkan hanya disimpan sementara di browser Anda selama sesi ini.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="q5"
            className="border rounded-md px-4 shadow-none"
          >
            <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
              Siapa yang membuat sistem ini?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              Sistem ini dikembangkan oleh{" "}
              <strong className="text-foreground">
                Arnesto Aksan Tyopradhipta
              </strong>{" "}
              (NIM 682022114) sebagai bagian dari penelitian skripsi di
              Universitas Kristen Satya Wacana (UKSW), Salatiga. Data bersumber
              dari Dinas Koperasi dan UKM Kota Salatiga.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer note */}
      <div className="rounded-md border bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Disclaimer:</strong> Sistem ini
        merupakan prototipe penelitian akademik. Rekomendasi yang dihasilkan
        adalah hasil analisis kuantitatif berbasis data sekunder dan tidak
        menggantikan survei pasar, konsultasi bisnis, atau penilaian profesional
        lainnya. Penggunaan rekomendasi ini sepenuhnya menjadi tanggung jawab
        pengguna.
      </div>
    </div>
  );
}
