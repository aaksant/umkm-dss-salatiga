"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import { Layer, PathOptions } from "leaflet";
import L from "leaflet";
import { Feature, FeatureCollection, Geometry } from "geojson";
import { TopsisResult } from "@/data/types/topsis.types";
import { gadmToKelurahan } from "@/data/kelurahan";
import { DSSResult } from "@/data/types/dss.types";
import { renderToStaticMarkup } from "react-dom/server";

type MapViewProps = {
  dssResult: DSSResult;
  height?: number;
};

type Badge = {
  label: string;
  bg: string;
  color: string;
};

const mapColors = {
  neutral: "#e5e7eb",
  score: {
    high: "#16a34a",
    medium: "#65a30d",
    low: "#ca8a04",
    veryLow: "#f97316",
    lowest: "#dc2626"
  },
  border: "#1e293b",
  text: {
    primary: "#0f172a",
    secondary: "#64748b",
    muted: "#94a3b8",
    body: "#374151"
  },
  badge: {
    market: {
      bg: "#dbeafe",
      text: "#1d4ed8"
    },
    nib: {
      bg: "#dcfce7",
      text: "#15803d"
    },
    competition: {
      bg: "#fef9c3",
      text: "#a16207"
    }
  }
};

const scoreDistribution = [
  { max: 0.2, color: mapColors.score.high, label: "20% Terbaik" },
  { max: 0.4, color: mapColors.score.medium, label: "Peringkat 20–40%" },
  { max: 0.6, color: mapColors.score.low, label: "Peringkat 40–60%" },
  { max: 0.8, color: mapColors.score.veryLow, label: "Peringkat 60–80%" },
  { max: 1, color: mapColors.score.lowest, label: "20% Terendah" }
];

export default function MapView({ dssResult, height = 480 }: MapViewProps) {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);

  const results = dssResult.topsisRecommendation.detail.results;
  const resultMap = createResultMap(results);
  const scoreColorMap = createScoreColorMap(results);

  // Load GeoJSON
  useEffect(() => {
    fetch("/data/salatiga-gadm-updated.json")
      .then((res) => res.json())
      .then((data: FeatureCollection) => setGeojson(data))
      .catch((e) => console.error("Gagal load GeoJSON:", e));
  }, []);

  // Style per feature, dipanggil react-leaflet saat render layer
  const featureStyle = (feature?: Feature<Geometry, unknown>): PathOptions => {
    if (!feature) {
      return { fillColor: mapColors.neutral, fillOpacity: 0.7 };
    }
    const kelurahan = getKelurahanFromFeature(feature as Feature);
    const fillColor = kelurahan
      ? (scoreColorMap.get(kelurahan) ?? mapColors.neutral)
      : mapColors.neutral;

    return {
      fillColor,
      fillOpacity: 0.75,
      color: mapColors.border,
      weight: 0.5
    };
  };

  // Interaksi feature
  const onEachFeature = (feature: Feature, layer: Layer) => {
    const kelurahan = getKelurahanFromFeature(feature);
    const result = kelurahan ? resultMap.get(kelurahan) : undefined;
    const gadmName = (feature.properties as Record<string, string>)?.["NAME_4"];
    const displayName = kelurahan ?? gadmName ?? "—";
    const color = kelurahan
      ? (scoreColorMap.get(kelurahan) ?? mapColors.neutral)
      : mapColors.neutral;

    // Leaflet tidak bisa render Tailwind
    const popupHtml = renderToStaticMarkup(
      result ? (
        <PopupContent result={result} color={color} />
      ) : (
        <EmptyPopupContent name={displayName} />
      )
    );

    layer.bindPopup(popupHtml, { maxWidth: 280 });
    layer.on({
      mouseover: (e) => {
        const path = e.target as L.Path;
        path.setStyle({ fillOpacity: 0.95, weight: 2 });
      },
      mouseout: (e) => {
        (e.target as L.Path).setStyle(featureStyle(feature));
      }
    });
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-1000 px-4 py-2 bg-white/90 backdrop-blur-sm border-b border-slate-200 flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Peta Rekomendasi Distribusi
        </span>
        <span className="text-xs text-slate-400">
          {results.length} kelurahan dievaluasi
        </span>
      </div>
      {/* Map */}
      <MapContainer
        center={[-7.331, 110.508]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height, paddingTop: 36, width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <ZoomControl position="bottomleft" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geojson && (
          <>
            <GeoJSON
              key={JSON.stringify(results.map((r) => r.score))}
              data={geojson}
              style={featureStyle}
              onEachFeature={onEachFeature}
            />
          </>
        )}
      </MapContainer>
      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="absolute bottom-4 right-4 z-1000 bg-white rounded-lg shadow-md px-3 py-2 text-xs">
      <div className="font-semibold text-slate-700 mb-1">Ranking TOPSIS</div>
      {scoreDistribution.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2 leading-6">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: color }}
          />
          <span className="text-slate-600">{label}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 leading-6">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ background: mapColors.neutral }}
        />
        <span className="text-slate-600">Tidak dievaluasi</span>
      </div>
    </div>
  );
}

function PopupContent({
  result,
  color
}: {
  result: TopsisResult;
  color: string;
}) {
  const badges = createBadges(result);

  return (
    <div style={{ fontFamily: "system-ui,sans-serif", minWidth: 200 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: 2
        }}
      >
        {result.kelurahan}
      </div>
      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>
        Kec. {result.kecamatan} · Peringkat #{result.rank}
      </div>
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            background: color,
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 999
          }}
        >
          Skor {result.score.toFixed(3)}
        </span>
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#374151",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 4,
          marginBottom: badges.length > 0 ? 8 : 0
        }}
      >
        <div>
          Total UMKM: <strong>{result.total}</strong>
        </div>
        <div>
          Ber-NIB: <strong>{result.berNib}</strong>
        </div>
      </div>
      {badges.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {badges.map((b) => (
            <span
              key={b.label}
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 7px",
                borderRadius: 999,
                background: b.bg,
                color: b.color
              }}
            >
              {b.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyPopupContent({ name }: { name: string }) {
  return (
    <div style={{ fontFamily: "system-ui,sans-serif" }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: 4
        }}
      >
        {name}
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8" }}>
        Tidak dievaluasi pada sesi ini
      </div>
    </div>
  );
}

function createScoreColorMap(results: TopsisResult[]): Map<string, string> {
  const sorted = [...results].sort((a, b) => b.score - a.score);
  const n = sorted.length;

  return new Map(
    sorted.map((result, i) => {
      const quantile = i / (n - 1);
      const bucket =
        scoreDistribution.find((b) => quantile <= b.max) ??
        scoreDistribution[scoreDistribution.length - 1];

      return [result.kelurahan.toUpperCase(), bucket.color];
    })
  );
}

function createResultMap(results: TopsisResult[]): Map<string, TopsisResult> {
  return new Map(
    results.map((result) => [result.kelurahan.toUpperCase(), result])
  );
}

function getKelurahanFromFeature(feature: Feature): string | undefined {
  const props = feature.properties as Record<string, string> | null;
  const gadmName = props?.["NAME_4"];

  return gadmName ? gadmToKelurahan[gadmName] : undefined;
}

function createBadges(r: TopsisResult): Badge[] {
  const badges: Badge[] = [];

  if (r.total >= 1500) {
    badges.push({
      label: "Pasar Besar",
      bg: mapColors.badge.market.bg,
      color: mapColors.badge.market.text
    });
  }

  if (r.C2 <= 0.25) {
    badges.push({
      label: "Kompetisi Rendah",
      bg: mapColors.badge.competition.bg,
      color: mapColors.badge.competition.text
    });
  }

  return badges;
}
