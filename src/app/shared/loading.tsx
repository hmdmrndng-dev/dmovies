import { IconLoader } from "@tabler/icons-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center text-zinc-500">
      <IconLoader className="h-7 w-7 animate-spin" />
    </div>
  );
}
