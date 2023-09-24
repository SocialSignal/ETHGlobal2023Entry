import React, { useCallback, useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { getAllSubscribers } from "../utils/fetchNotify";
import Link from "next/link";

function Subscribers() {
  const [subscribers, setSubscribers] = useState<string[]>();

  const getSubscribers = useCallback(async () => {
    try {
      const allSubscribers = await getAllSubscribers();
      setSubscribers(allSubscribers);
    } catch (getSubscribersError) {
      console.log({ getSubscribersError });
    }
  }, []);

  useEffect(() => {
    getSubscribers();
  }, [getSubscribers]);

  return (
    <>
      <div>ADMIN - All subscribers</div>
      <div>
        <div>
          {!subscribers?.length ? (
            <div>No subscribers yet.</div>
          ) : (
            subscribers.map((caip10Account) => (
              <a
                // as={Link}
                href={`https://etherscan.io/address/${
                  caip10Account.split("eip155:1:")[1]
                }`}
                // target="_blank"
                // key={caip10Account}
                // status="info"
                // rounded="xl"
                // gap={2}
              >
                {/* <BsPersonCircle /> */}

                <div>{caip10Account}</div>
              </a>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Subscribers;
