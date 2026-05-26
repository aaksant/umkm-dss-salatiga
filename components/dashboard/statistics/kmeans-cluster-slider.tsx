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
    <Card className="rounded-xl">
      <CardContent>
        <div className="flex items-center gap-x-6">
          <div className="shrink-0">
            <p className="text-xs text-muted-foreground mb-2">Jumlah Cluster</p>
            <p className="text-3xl text-primary font-bold">{K}</p>
          </div>
          <div className="flex-1">
            <Slider
              value={[K]}
              onValueChange={(values) => onKChange(values[0])}
              min={2}
              max={6}
              step={1}
              className="w-full cursor-grab active:cursor-grabbing"
            />
          </div>
          <div className="text-right">
            <p className="mb-2 text-xs text-muted-foreground">
              Score Silhouette
            </p>
            <p className="text-3xl text-primary font-bold">
              {silhouette.toFixed(3)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
