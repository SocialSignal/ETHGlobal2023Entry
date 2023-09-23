import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";

export const TribeRow = ({
  tribeSummary: {
    tribeId,
    displayName,
    ensProfile,
    avatar,
    badge,
    memberCount,
  },
}: any) => {
  const router = useRouter();

  return (
    <div
      className="shadow-inner flex flex-col bg-[#E0B779] rounded-xl px-4 py-1 text-black cursor-pointer hover:shadow-2xl hover:scale-[101%]"
      onClick={() => {
        router.push(`/tribes/${tribeId.chainId}/${tribeId.address}`);
      }}
    >
      <div className="flex flex-row justify-between gap-x-4">
        <div>
          <Skeleton width={80} height={80} />
        </div>
        <div className="flex-1">
          <div>{displayName}</div>
          <div>{ensProfile.displayName}</div>
        </div>
        <div>
          <div>Members</div>
          <div>{memberCount}</div>
        </div>
      </div>
      <div>values,values</div>

      {/* <div>
        {tribeId.chainId}:{tribeId.address}
      </div>
      <div>{displayName}</div>
      <div>{avatar}</div>
      <div>{badge}</div>
      <div>{memberCount}</div> */}
    </div>
  );
};
