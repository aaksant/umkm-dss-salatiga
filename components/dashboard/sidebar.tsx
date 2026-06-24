import Link from "next/link";
import SidebarLinks from "./sidebar-links";

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:border-r md:border-[#28344A]/10 md:bg-white/60 md:px-4">
      <Link
        href="/"
        className="mb-8 flex flex-col gap-1 px-2 py-2 transition-opacity hover:opacity-80"
      >
        <p className="font-display text-lg font-bold tracking-tight text-[#23262B]">
          DSS Distribusi UMKM
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C8862E]">
          Kota Salatiga
        </p>
      </Link>

      <div className="flex flex-row justify-between gap-1 md:flex-col md:justify-start md:gap-2">
        <SidebarLinks />
      </div>
    </div>
  );
}
