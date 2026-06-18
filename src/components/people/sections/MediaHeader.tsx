import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconLoader } from "@tabler/icons-react";

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
  socialLinks: Array<{
    id: string | null | undefined;
    label: string;
    url: string;
    icon: React.ReactNode;
  }>;
  hasMultipleBackdrops: boolean;
};

export default function MediaHeader({ person, socialLinks }: MediaHeaderProps) {
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
          <div className="flex flex-col gap-3 flex-1 md:flex-none">
            {socialLinks.filter((l) => l.id).length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {socialLinks
                  .filter((link) => link.id)
                  .map((link) => (
                    <Button
                      key={link.label}
                      size="icon"
                      variant="outline"
                      asChild
                      title={link.label}
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.icon}
                        <span className="sr-only">{link.label}</span>
                      </a>
                    </Button>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1 min-w-0 pt-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            {person.name}
          </h1>

          <div className="space-y-4">
            <h2 className="font-semibold text-base mb-2">Overview</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm dark:border-muted/20">
              <div>
                <span className="block font-medium text-foreground">
                  Known For
                </span>
                <span className="text-muted-foreground">
                  {person.known_for_department || "N/A"}
                </span>
              </div>

              <div>
                <span className="block font-medium text-foreground">
                  Gender
                </span>
                <span className="text-muted-foreground">
                  {person.gender === 1
                    ? "Female"
                    : person.gender === 2
                      ? "Male"
                      : "N/A"}
                </span>
              </div>

              <div>
                <span className="block font-medium text-foreground">Born</span>
                <span className="text-muted-foreground">
                  {person.birthday
                    ? new Date(person.birthday).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>

              {person.deathday && (
                <div>
                  <span className="block font-medium text-foreground">
                    Died
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(person.deathday).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}

              {person.place_of_birth && (
                <div className="col-span-2">
                  <span className="block font-medium text-foreground">
                    Place of Birth
                  </span>
                  <span className="text-muted-foreground">
                    {person.place_of_birth}
                  </span>
                </div>
              )}
            </div>
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
