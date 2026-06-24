"use client";

import Link from "next/link";
import {
  ChartColumn,
  FileChartColumn,
  FileInput,
  FlaskConical
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { name: "Statistik", href: "/dashboard/statistics", icon: ChartColumn },
  { name: "Input Profil", href: "/dashboard/profile-input", icon: FileInput },
  {
    name: "Hasil Rekomendasi",
    href: "/dashboard/result",
    icon: FileChartColumn
  },
  {
    name: "Tentang Aplikasi",
    href: "/dashboard/about",
    icon: FlaskConical
  }
];

export default function SidebarLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            href={link.href}
            key={link.href}
            className={cn(
              // Transisi halus dan padding yang lega
              "relative flex h-[48px] grow items-center justify-center gap-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 md:flex-none md:justify-start md:px-4",
              {
                "bg-transparent text-[#23262B]/65 hover:bg-[#28344A]/[0.06] hover:text-[#23262B]":
                  !isActive,
                "bg-[#28344A]/10 font-semibold text-[#28344A]": isActive
              }
            )}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 hidden h-1/2 w-1 -translate-y-1/2 rounded-r-md bg-[#28344A] md:block" />
            )}

            <link.icon
              className={cn("w-5", isActive ? "stroke-[2.5px]" : "stroke-2")}
            />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
