import Link from "next/link";
import SidebarLinks from "./sidebar-links";

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        href="/"
        className="text-2xl font-bold tracking-tighter mb-8 px-4 py-2"
      >
        DSS
      </Link>
      <div className="flex flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <SidebarLinks />
      </div>
    </div>
  );
}
