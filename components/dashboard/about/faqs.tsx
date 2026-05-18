import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    id: "q1",
    question: "Apakah hasil rekomendasi selalu akurat?",
    answer:
      "Tidak ada sistem rekomendasi yang menjamin akurasi 100%. Sistem ini mengoptimalkan berdasarkan data yang tersedia dan model matematika yang telah divalidasi. Gunakan hasil ini sebagai salah satu pertimbangan, bukan satu-satunya acuan keputusan."
  },
  {
    id: "q2",
    question: "Mengapa skor TOPSIS bisa bernilai negatif atau sangat kecil?",
    answer:
      "Skor TOPSIS berada pada rentang 0 hingga 1 dan tidak pernah negatif. Skor mendekati 1 berarti kelurahan sangat dekat dengan kondisi ideal, skor mendekati 0 berarti sangat jauh. Nilai yang terlihat 'kecil' (misalnya 0.3) tetap valid, itu bukan nilai buruk secara absolut, tetapi posisi relatif di antara kelurahan lain dalam cluster yang sama."
  },
  {
    id: "q3",
    question: "Mengapa ada nilai negatif pada data statistik?",
    answer:
      "Nilai negatif pada data internal sistem (ditandai akhiran _std) adalah hasil dari z-score standardisasi — teknik normalisasi statistik. Nilai negatif berarti kelurahan tersebut berada di bawah rata-rata untuk fitur tertentu. Ini bukan anomali atau kesalahan, melainkan bagian dari proses preprocessing sebelum K-Means dijalankan."
  },
  {
    id: "q4",
    question:
      "Bagaimana soal keamanan data? Apakah data saya disimpan dalam server?",
    answer:
      "Tidak. Seluruh pemrosesan data — termasuk K-Means, AHP, dan TOPSIS berjalan sepenuhnya di perangkat Anda (client-side). Tidak ada data profil usaha yang dikirim ke server manapun. Data yang Anda masukkan hanya disimpan sementara di browser Anda."
  },
  {
    id: "q5",
    question: "Siapa yang membuat sistem ini?",
    answer:
      "Sistem ini dikembangkan oleh Arnesto Aksan Tyopradhipta (NIM 682022114) sebagai bagian dari tugas akhir di Fakultas Teknologi Informasi, Universitas Kristen Satya Wacana."
  }
];

export default function Faqs() {
  return (
    <Accordion type="multiple" className="space-y-2 border-none py-2">
      {faqItems.map((faqItem) => (
        <FaqRow key={faqItem.id} {...faqItem} />
      ))}
    </Accordion>
  );
}

function FaqRow({ id, question, answer }: FaqItem) {
  return (
    <AccordionItem value={id} className="border rounded-md px-2 shadow-none">
      <AccordionTrigger className="text-sm cursor-pointer font-medium py-4 hover:no-underline">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}
