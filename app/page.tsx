import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen grid place-items-center">
      <Link href="/dashboard/statistics">To Dashboard</Link>
    </div>
  );
}
