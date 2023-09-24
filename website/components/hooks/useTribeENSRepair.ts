import { ZeroAddress } from "ethers";
import { getResolver } from "../../lib/ens-scripts/check-resolver";
import { setResolver } from "../../lib/ens-scripts/set-public-resolver";
import { getResolverContract } from "../../lib/ens-scripts/utils/contracts";
import { useEthersSigner } from "./useEthersSigner";
import { setTribeRecords } from "../../lib/ens-scripts/set-tribe-records";
import { TribeSummary } from "../../types/types";

export const useTribeENSRepair = () => {
  const signer = useEthersSigner();

  const configureTribeRecords = async (
    ensName: string,
    tribe: TribeSummary & {
      description: string;
      values: string[];
    }
  ) => {
    if (!signer) {
      throw new Error("No signer");
    }

    const currentResolver = await getResolver(ensName, signer);
    console.log("Current resolver: ", currentResolver);

    // 2. set resolver if the result was 0x0
    if (currentResolver == ZeroAddress) {
      const res = await setResolver(
        ensName,
        await getResolverContract(signer).getAddress(),
        signer
      );
      console.log(res);
    }

    // 3. Setting tribe records
    const res = await setTribeRecords(
      ensName,
      {
        name: tribe.displayName,
        avatar: tribe.avatar,
        badge: tribe.badge,
        contractChainId: tribe.tribeId.chainId,
        contractAddress: tribe.tribeId.address,
        description: tribe.description,
        values: tribe.values,
      },
      signer
    );
    console.log(res);
  };

  return {
    configureTribeRecords,
  };
};
