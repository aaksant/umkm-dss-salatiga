import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

type KMeansClusterSliderProps = {
  K: number;
  silhouette: number;
  onKChange: (value: number) => void;
};

export default function KMeansClusterSlider({
  K,
  silhouette,
  onKChange
}: KMeansClusterSliderProps) {
  return (
    <Card className="rounded-xl border-[#28344A]/10 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 md:gap-8">
          <div className="grid w-full grid-cols-2 gap-4 sm:contents">
            <div className="shrink-0 text-center sm:order-1 sm:w-auto">
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#23262B]/50 sm:text-[11px]">
                Jumlah Cluster
              </p>
              <p className="text-2xl font-display font-bold font-mono leading-none text-[#28344A] sm:text-3xl md:text-4xl">
                {K}
              </p>
            </div>

            <div className="shrink-0 text-center sm:order-3 sm:w-auto">
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#23262B]/50 sm:text-[11px]">
                Skor Silhouette
              </p>
              <p className="text-2xl font-mono font-bold leading-none tabular-nums text-[#28344A] sm:text-3xl md:text-4xl">
                {silhouette.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="w-full flex-1 px-1 sm:order-2 sm:px-2 md:px-0">
            <Slider
              value={[K]}
              onValueChange={(values) => onKChange(values[0])}
              min={2}
              max={6}
              step={1}
              className="w-full cursor-grab active:cursor-grabbing"
            />
            <div className="mt-2 flex justify-between text-[10px] font-medium text-[#23262B]/40 sm:text-xs">
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
