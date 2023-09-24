import { useSubscription, useW3iAccount } from "@web3inbox/widget-react";
import React from "react";

function Subscription() {
  const { account } = useW3iAccount();
  const { subscription } = useSubscription(account);

  return (
    <div>
      <h2>Subscription</h2>
      <div>
        <pre
          style={{
            overflow: "scroll",
          }}
        >
          {JSON.stringify(subscription, undefined, 2)}
        </pre>
      </div>
    </div>
  );
}

export default Subscription;
