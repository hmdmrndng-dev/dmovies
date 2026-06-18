import { Suspense } from "react";
import SearchPage from "./SearchPage";
import Loading from "@/app/shared/loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchPage />
    </Suspense>
  );
}
