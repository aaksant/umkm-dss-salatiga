import { Check, ChevronDown, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "../ui/collapsible";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { DSSResult } from "@/data/types/dss.types";
import { ahpCriteria } from "@/playgrounds/ahp.playground";
import { cn } from "@/lib/utils";

type AhpDetailDropdownProps = {
  dssResult: DSSResult;
  isAhpDetailOpen: boolean;
  onOpenChange: (value: boolean) => void;
};

export default function AhpDetailsDropdown({
  dssResult,
  isAhpDetailOpen,
  onOpenChange
}: AhpDetailDropdownProps) {
  return (
    <Collapsible open={isAhpDetailOpen} onOpenChange={onOpenChange}>
      <Card className="rounded-lg">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <CardHeader className="cursor-pointer">
              <CardTitle className="font-semibold tracking-tight flex items-center gap-x-2">
                <Scale className="w-5 h-5 text-blue-600" /> Bobot Kriteria
                <ChevronDown
                  className={cn(
                    "ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isAhpDetailOpen && "rotate-180"
                  )}
                />
              </CardTitle>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <p className="text-muted-foreground inline-flex items-center gap-x-2 mb-4">
              Rasio Konsistensi (CR)
              <Badge variant="outline" className="bg-blue-50">
                {dssResult.ahpResult.consistencyRatio.toFixed(2)}
              </Badge>
              {dssResult.ahpResult.consistencyRatio <= 0.1 && (
                <Badge variant="outline" className="bg-blue-50">
                  <Check /> Konsisten
                </Badge>
              )}
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-bold">ID</TableHead>
                  <TableHead className="text-xs font-bold">Kriteria</TableHead>
                  <TableHead className="text-xs font-bold">Tipe</TableHead>
                  <TableHead className="text-xs font-bold">Bobot (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ahpCriteria.map((criteria) => (
                  <TableRow key={criteria.id}>
                    <TableCell>{criteria.id}</TableCell>
                    <TableCell>{criteria.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 uppercase">
                        {criteria.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 uppercase">
                        {(
                          dssResult.ahpResult.weights[criteria.id] * 100
                        ).toFixed(2)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
