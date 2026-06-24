import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

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
      "Perhitungan K-Means, AHP, dan TOPSIS berjalan sepenuhnya di perangkat Anda (client-side) saat Anda menekan tombol rekomendasi. Namun, profil usaha dan hasil rekomendasi yang dihasilkan disimpan ke basis data sistem untuk keperluan pencatatan dan evaluasi penelitian. Data ini tidak dibagikan ke pihak ketiga di luar keperluan akademik tugas akhir ini."
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
    <Accordion type="multiple" className="space-y-3 border-none py-2">
      {faqItems.map((faqItem) => (
        <FaqRow key={faqItem.id} {...faqItem} />
      ))}
    </Accordion>
  );
}

function FaqRow({ id, question, answer }: FaqItem) {
  return (
    <AccordionItem
      value={id}
      className={cn(
        "rounded-xl border border-[#D6DAD0] px-3 shadow-sm transition-all duration-300",
        "bg-white data-[state=open]:bg-white data-[state=closed]:bg-white",
        "hover:border-[#28344A]/30 data-[state=open]:border-[#28344A]/30"
      )}
    >
      <AccordionTrigger className="cursor-pointer py-5 text-left font-sans text-sm font-semibold text-[#28344A] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28344A]/40 [&>svg]:text-[#28344A]/50">
        {question}
      </AccordionTrigger>
      <AccordionContent className="max-w-3xl pb-6 font-sans text-sm leading-relaxed text-[#23262B]/80">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}
