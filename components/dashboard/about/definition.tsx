import { Card, CardContent } from "@/components/ui/card";

export default function Definition() {
  return (
    <Card className="rounded-md border shadow-none">
      <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>
          Sistem ini adalah{" "}
          <strong className="text-foreground">
            Decision Support System (DSS)
          </strong>{" "}
          atau alat bantu pengambilan keputusan berbasis data yang dirancang
          untuk membantu pelaku UMKM di Kota Salatiga menentukan kelurahan mana
          yang paling prospektif sebagai target distribusi produk.
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
  );
}
