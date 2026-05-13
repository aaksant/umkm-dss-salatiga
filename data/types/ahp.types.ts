export interface AHPCriteria {
  id: string;
  name: string;
  type: "benefit" | "cost";
}

export interface AHPResult {
  weights: Record<string, number>;
  weightArray: number[];
  consistencyRatio: number;
  consistencyIndex: number;
  lambdaMax: number;
  consistent: boolean;
  normalizedMatrix: number[][];
}
