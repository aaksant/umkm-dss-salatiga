import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen grid place-items-center bg-muted/40 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-slate-100">
            <MapPin className="text-slate-600" />
          </div>
          <h1 className="font-bold tracking-tight text-3xl">
            Rekomendasi Lokasi Distribusi UMKM
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sistem pendukung keputusan berbasis K-Means, AHP, dan TOPSIS untuk
            membantu pelaku UMKM di Kota Salatiga menentukan kelurahan paling
            prospektif untuk distribusi produk.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="h-12 rounded-md">
            <Link href="/dashboard/profile-input">
              Mulai dapatkan rekomendasi <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-md"
          >
            <Link href="/dashboard/statistics">
              <BarChart3 className="h-4 w-4" /> Lihat statistik
            </Link>
          </Button>
        </div>

        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Sparkles className="h-3 w-3" />
          Pelajari cara kerja sistem ini
        </Link>
      </div>
    </div>
  );
}
