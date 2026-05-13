import Sidebar from "@/components/dashboard/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <Sidebar />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-8">{children}</div>
    </div>
  );
}
