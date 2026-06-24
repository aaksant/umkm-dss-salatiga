"use client";

import ProfileForm from "@/components/dashboard/profile-input/profile-form";
import { MapPin } from "lucide-react";

export default function ProfileInputPage() {
  return (
    <div className="flex min-h-screen justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-xl space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#28344A]/10">
            <MapPin className="text-[#28344A]" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-[#23262B]">
            Lengkapi profil usaha Anda
          </h1>
        </div>
        <ProfileForm />
      </div>
    </div>
  );
}
