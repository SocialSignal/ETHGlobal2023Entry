import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import Skeleton from "react-loading-skeleton";

export default () => {
  const { id } = useRouter().query;
  const [imgLoaded, setImgLoaded] = useState(false);

  const {
    data: tribeData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery(
    ["tribe", id],
    async () => await (await fetch(`/api/tribes/${id}/`)).json(),
    {
      enabled: !!id?.length,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div>
      <div>Id is {id}</div>
      {isLoading ? (
        <div>...</div>
      ) : tribeData != null ? (
        <div className="flex flex-rpow gap-4 mt-4">
          <div className="flex w-[350px] h-[350px] items-center flex-col">
            <img
              src={tribeData.largeAvatar}
              className="max-w-[350px] max-h-[350px] bg-cover"
              onLoad={() => setImgLoaded(true)}
            />

            {!imgLoaded ? (
              <Skeleton
                width={350}
                height={350}
                className="block w-full h-full flex-1"
              />
            ) : null}
          </div>
          <div>
            <h1 className="text-3xl">{tribeData.name}</h1>
            <div>description: {tribeData.description}</div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
