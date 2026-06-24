import { ReactNode } from "react";

type SectionHeadingProps = {
  icon: ReactNode;
  title: string;
  description?: string;
};

export default function SectionHeading({
  icon,
  title,
  description
}: SectionHeadingProps) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#28344A]/10 text-[#28344A]">
        {icon}
      </div>
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-[#23262B]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-[#23262B]/65">{description}</p>
        )}
      </div>
    </div>
  );
}
