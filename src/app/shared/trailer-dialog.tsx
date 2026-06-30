import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconLoader, IconMovieOff } from "@tabler/icons-react";

interface Trailer {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trailerKey: string | null | undefined;
  trailerTitle: string;
  trailerDescription?: string | null;
  loading?: boolean;
}

export default function Trailer({
  isOpen,
  onOpenChange,
  trailerKey,
  trailerTitle,
  trailerDescription,
  loading = false,
}: Trailer) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] md:w-[88vw] lg:w-[80vw] xl:w-[75vw] sm:max-w-[1800px] p-2 sm:p-4 gap-3 border-none bg-zinc-950 text-white">
        <DialogHeader>
          <DialogTitle className="px-2 pt-2 sm:p-0 text-lg sm:text-xl font-bold tracking-tight">
            {trailerTitle}
          </DialogTitle>
          {trailerDescription && (
            <DialogDescription className="text-zinc-400">
              {trailerDescription}
            </DialogDescription>
          )}
        </DialogHeader>

        {trailerKey ? (
          <div className="aspect-video w-full overflow-hidden rounded-md bg-black shadow-2xl shadow-black/50">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title={`${trailerTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full border-none"
            />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-md bg-black">
            {loading ? (
              <IconLoader className="animate-spin text-zinc-400 h-8 w-8" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-500">
                <IconMovieOff className="h-12 w-12" />
                <span className="text-sm font-medium">
                  No Trailer Available
                </span>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="px-2 pb-2 sm:p-0">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="w-full sm:w-auto font-medium"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
