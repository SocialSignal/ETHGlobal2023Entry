import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import Skeleton from "react-loading-skeleton";
import { TribeDetail } from "../../../types/types";
import { GenericRow } from "../../../components/GenericRow";
import { toastError } from "../../../components/Notifications";
import { useAtom } from "jotai";
import { sfxAtom } from "../../../components/core/Navbar";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import tribeAbi from "../../../abis/tribe-abi.json";
import useSendNotification from "../../../utils/useSendNotification";

export default () => {
  const { chainId, tribeAddress } = useRouter().query;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [audioEnabled] = useAtom(sfxAtom);
  const { address } = useAccount();

  const { handleSendNotification, isSending } = useSendNotification();

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

  const { writeAsync: revokeMembership } = useContractWrite({
    address: tribeAddress?.toString() as any,
    abi: tribeAbi,
    functionName: "revoke",
    onError: (e) => {
      console.error(e);
      toastError(`${e.name}: ${e.message}`);
    },
  });

  const { writeAsync: acceptMembership } = useContractWrite({
    address: tribeAddress?.toString() as any,
    abi: tribeAbi,
    functionName: "accept",
    onError: (e) => {
      console.error(e);
      toastError(`${e.name}: ${e.message}`);
    },
  });

  const { data: isMember } = useContractRead({
    address: tribeAddress?.toString() as any,
    abi: tribeAbi,
    functionName: "isMember",
    args: [address],
    enabled: !!address,
    onError: (e) => {
      console.error(e);
      toastError(`${e.name}: ${e.message}`);
    },
  });

  const { data: ownerAddress } = useContractRead({
    address: tribeAddress?.toString() as any,
    abi: tribeAbi,
    functionName: "owner",
    args: [],
    onError: (e) => {
      console.error(e);
      toastError(`${e.name}: ${e.message}`);
    },
  });

  const { data: memberState } = useContractRead({
    address: tribeAddress?.toString() as any,
    abi: tribeAbi,
    functionName: "getMemberState",
    args: [address],
    enabled: !!address,
    onError: (e) => {
      console.error(e);
      toastError(`${e.name}: ${e.message}`);
    },
  });

  const isOwner =
    address != null &&
    (ownerAddress as string | undefined)?.toLowerCase() ===
      address?.toLowerCase();

  if (!tribeData) {
    return <Skeleton width={500} height={728} />;
  }

  console.log(tribeData, {
    memberState,
    address,
    ownerAddress,
    isOwner,
  });

  return (
    <div className="flex flex-col gap-y-8">
      {isOwner ? (
        <>
          <button className="btn">Edit Tribe</button>
          <button className="btn">Send Invite</button>
        </>
      ) : (
        <>
          <button
            className="btn"
            onClick={async () => {
              await acceptMembership({
                args: [address],
              }).then((txResult) => {
                handleSendNotification(
                  {
                    title: "New tribe join request",
                    body: `Somebody has requested to join your tribe`,
                    icon: "https://social-signal.vercel.app/favicon-32x32.png",
                    url: `https://goerli.etherscan.io/tx/${txResult.toString()}`,
                    type: "transactional",
                  },
                  ownerAddress as string
                );
              });
            }}
          >
            Request to Join
          </button>

          {isMember ? (
            <button
              className="btn"
              onClick={async () => {
                await revokeMembership({
                  args: [address],
                }).then((txResult) => {
                  handleSendNotification(
                    {
                      title: isMember
                        ? `Your tribe shrank`
                        : `Request to join rescinded`,
                      body: isMember
                        ? `Somebody has left your tribe`
                        : `Somebody has withdrawn their request to join`,
                      icon: "https://social-signal.vercel.app/favicon-32x32.png",
                      url: `https://goerli.etherscan.io/tx/${txResult.toString()}`,
                      type: "transactional",
                    },
                    ownerAddress as string
                  );
                });
              }}
            >
              {isMember ? "Leave Tribe" : "Cancel Request to Join"}
            </button>
          ) : null}
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
              onAction={
                isOwner
                  ? () => {
                      revokeMembership({
                        args: [x.address],
                      }).then((txResult) => {
                        handleSendNotification(
                          {
                            title: "Membership revoked",
                            body: `The owner of ${tribeData.displayName} has revoked your membership`,
                            icon: "https://social-signal.vercel.app/favicon-32x32.png",
                            url: `https://goerli.etherscan.io/tx/${txResult.hash.toString()}`,
                            type: "transactional",
                          },
                          x.address
                        );
                      });
                    }
                  : null
              }
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
              onAction={
                isOwner
                  ? () => {
                      acceptMembership({
                        args: [x.address],
                      }).then((txResult) => {
                        handleSendNotification(
                          {
                            title: "Request accepted",
                            body: `The owner of ${tribeData.displayName} has approved your request to join`,
                            icon: "https://social-signal.vercel.app/favicon-32x32.png",
                            url: `https://goerli.etherscan.io/tx/${txResult.hash.toString()}`,
                            type: "transactional",
                          },
                          x.address
                        );
                      });
                    }
                  : null
              }
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
              onAction={
                isOwner
                  ? () => {
                      revokeMembership({
                        args: [x.address],
                      }).then((txResult) => {
                        handleSendNotification(
                          {
                            title: "Invite revoked",
                            body: `The owner of ${tribeData.displayName} has revoked your invitation`,
                            icon: "https://social-signal.vercel.app/favicon-32x32.png",
                            url: `https://goerli.etherscan.io/tx/${txResult.hash.toString()}`,
                            type: "transactional",
                          },
                          x.address
                        );
                      });
                    }
                  : null
              }
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
