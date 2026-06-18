import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconLoader } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type MediaHeaderProps = {
  person: {
    name: string;
    biography: string;
    birthday?: string | null;
    deathday?: string | null;
    place_of_birth?: string | null;
    gender?: number | null;
    profile_path?: string;
    known_for_department?: string | null;
  };
  hasMultipleBackdrops: boolean;
};

export default function MediaHeader({ person }: MediaHeaderProps) {
  return (
    <section>
      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
        <div className="flex flex-row md:flex-col gap-4 items-end md:items-stretch shrink-0 md:w-52 lg:w-64">
          <div className="relative w-28 sm:w-36 md:w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-border bg-zinc-900">
            {person.profile_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
                alt={person.name || "Profile"}
                fill
                priority
                sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 256px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
                No Profile Image
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1 min-w-0 pt-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            {person.name}
          </h1>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
              {person.birthday
                ? new Date(person.birthday).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-base mb-2">Biography</h2>
            <p className="text-sm leading-relaxed text-justify text-muted-foreground">
              {person.biography || "No biography available."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
