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
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.href}
          className={cn(
            "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-slate-100 hover:text-slate-600 md:flex-none md:justify-start md:p-2 md:px-3",
            {
              "bg-sky-100 text-blue-600": pathname === link.href
            }
          )}
        >
          <link.icon className="w-6" />
          <p className="hidden md:block">{link.name}</p>
        </Link>
      ))}
    </>
  );
}
