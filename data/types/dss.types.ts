import { AHPResult } from "./ahp.types";
import { Kecamatan, Sektor, Skala } from "./kelurahan.types";
import { ClusterResult } from "./kmeans.types";
import { TopsisRecommendationByCluster } from "./topsis.types";

export interface DSSResult {
  profile: {
    namaUsaha: string;
    sektor: Sektor;
    skala: Skala;
    kecamatan: Kecamatan;
    deskripsiProduk: string;
  };
  clusterResult: ClusterResult;
  topsisRecommendation: TopsisRecommendationByCluster;
  ahpResult: AHPResult;
}
