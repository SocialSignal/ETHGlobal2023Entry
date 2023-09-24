import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import Skeleton from "react-loading-skeleton";
import { TribeDetail } from "../../../types/types";
import { GenericRow } from "../../../components/GenericRow";
import { toastError } from "../../../components/Notifications";
import { useAtom } from "jotai";
import { sfxAtom } from "../../../components/core/Navbar";
import { useContractWrite } from "wagmi";
import { useEthersSigner } from "../../../components/hooks/useEthersSigner";

export default () => {
  const { chainId, tribeAddress } = useRouter().query;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [audioEnabled] = useAtom(sfxAtom);
  const signer = useEthersSigner();

  const {
    data: tribeData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<TribeDetail>(
    ["tribe", chainId, tribeAddress],
    async () =>
      (await (await fetch(`/api/tribes/${chainId}/${tribeAddress}`)).json())
        .tribe,
    {
      enabled: !!chainId?.length && !!tribeAddress?.length,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const { write: revokeMembership } = useContractWrite({
    abi: null,
    signer,
    functionName: "revoke",
    onError: (e) => {
      console.error(e);
      toastError(`${e.name}: ${e.message}`);
    },
  });

  const { write: cancelInvite } = useContractWrite({
    abi: null,
    signer,
    functionName: "cancelInvite",
    onError: (e) => {
      console.error(e);
      toastError(`${e.name}: ${e.message}`);
    },
  });

  const { write: confirmRequest } = useContractWrite({
    abi: null,
    signer,
    functionName: "confirmRequest",
    onError: (e) => {
      console.error(e);
      toastError(`${e.name}: ${e.message}`);
    },
  });

  if (!tribeData) {
    return <Skeleton width={500} height={728} />;
  }

  console.log(tribeData);

  return (
    <div className="flex flex-col gap-y-8">
      {isOwner ? (
        <>
          <div>Edit Tribe</div>
          <div>Send Invite</div>
        </>
      ) : (
        <>
          <div>Request to Join</div>
          <div>Cancel Request to Join</div>
          <div>Leave Tribe</div>
        </>
      )}
      <div>
        <div className="roboto-condensed">
          {chainId}:{tribeAddress}
        </div>
        {isLoading ? (
          <div>...</div>
        ) : tribeData != null ? (
          <div className="flex flex-rpow gap-4 mt-4">
            <div className="flex w-[350px] h-[350px] items-center flex-col">
              <img
                src={tribeData.avatar}
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
            <div className="mooli bg-[#1a1a1a]/40 rounded-xl px-8 py-4">
              <h1 className="text-3xl">{tribeData.displayName}</h1>
              <div>description: {tribeData.ensProfile?.description}</div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div>
        <div className="text-2xl mb-2">
          Members ({tribeData.members.length})
        </div>
        <div className="flex flex-col gap-y-4">
          {tribeData.members.map((x, i) => (
            <UserRow
              key={i}
              user={x}
              actionLabel={"Revoke Membership"}
              onAction={() => {
                revokeMembership(x.address);
                toastError(audioEnabled, "Not implemented yet.");
              }}
            ></UserRow>
          ))}
        </div>
      </div>
      <div>
        <div className="text-2xl mb-2">
          Requests to Join ({tribeData.supporters.length})
        </div>
        <div className="flex flex-col gap-y-4">
          {tribeData.supporters.map((x, i) => (
            <UserRow
              key={i}
              user={x}
              actionLabel={"Accept Request"}
              onAction={() => {
                confirmRequest(x.address);
                toastError(audioEnabled, "Not implemented yet.");
              }}
            ></UserRow>
          ))}
        </div>
      </div>
      <div>
        <div className="text-2xl mb-2">
          Invites Sent ({tribeData.invites.length})
        </div>
        <div className="flex flex-col gap-y-4">
          {tribeData.invites.map((x, i) => (
            <UserRow
              key={i}
              user={x}
              actionLabel={"Cancel Invite"}
              onAction={() => {
                cancelInvite(x.address);
                toastError(audioEnabled, "Not implemented yet.");
              }}
            ></UserRow>
          ))}
        </div>
      </div>
    </div>
  );
};

const UserRow = ({ user, actionLabel, onAction }: any) => {
  return (
    <GenericRow>
      <div className="flex flex-row justify-between">
        <div>
          <span className="roboto-condensed">{user.address}:</span>{" "}
          {user.metaProfile.ensProfile.displayName}
          <img src={user.metaProfile.ensProfile.avatar} />
        </div>
        {actionLabel != null && onAction != null ? (
          <button className="btn btn-secondary" onClick={() => onAction()}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </GenericRow>
  );
};
