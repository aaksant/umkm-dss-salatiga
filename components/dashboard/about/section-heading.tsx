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
    <div className="flex items-start gap-3 mb-4">
      <div className="flex w-8 h-8 items-center justify-center rounded-lg bg-blue-50 text-primary">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
