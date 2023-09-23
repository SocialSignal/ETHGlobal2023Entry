import Skeleton from "react-loading-skeleton";
import { useQuery } from "react-query";
import { TribeSummary } from "../types/types";
import { TribeRow } from "./TribeRow";

export const TribeList = () => {
  const { data, isLoading } = useQuery(
    "tribes",
    async () => await (await fetch("/api/tribes")).json(),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return (
      <div>
        <Skeleton count={8} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 my-4">
      {data?.tribes?.map((x: TribeSummary, i: number) => (
        <div key={i}>
          <TribeRow tribeSummary={x} />
        </div>
      ))}
    </div>
  );
};
