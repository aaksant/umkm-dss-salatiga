"use client";

import ProfileForm from "@/components/dashboard/profile-input/profile-form";
import { MapPin } from "lucide-react";

export default function ProfileInputPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-muted/40 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-slate-100">
            <MapPin className="text-slate-600" />
          </div>
          <h1 className="font-semibold text-xl tracking-tight">
            Lengkapi profil usaha Anda
          </h1>
        </div>
        <div className="rounded-2xl border p-6 shadow-none">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
