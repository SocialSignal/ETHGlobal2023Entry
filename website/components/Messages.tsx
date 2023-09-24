import { useMessages, useW3iAccount } from "@web3inbox/widget-react";
import Link from "next/link";
import React from "react";

function Messages() {
  const { account } = useW3iAccount();
  const { messages, deleteMessage } = useMessages(account);

  return (
    <div>
      <div>Last Messages</div>

      <div>
        {!messages?.length ? (
          <div>No messages yet.</div>
        ) : (
          messages
            .sort((a, b) => b.id - a.id)
            .map(({ id, message }) => (
              <div>
                <a
                  //   as={Link}
                  href={message.url}
                  target="_blank"
                  key={id}
                  //   status="info"
                  //   colorScheme={
                  //     message.type === "transactional" ? "blue" : "purple"
                  //   }
                  //   rounded="xl"
                >
                  {/* <AlertIcon /> */}

                  {message.body}
                  {/* <Flex flexDir={"column"} flexGrow={1}>
                    <AlertTitle>{message.title}</AlertTitle>
                    <AlertDescription flexGrow={1}>
                      {message.body}
                    </AlertDescription> */}
                  {/* </Flex>
                  <Flex w="60px" justifyContent="center">
                    <Image
                      src={message.icon}
                      alt="notification image"
                      height="60px"
                      rounded="full"
                      alignSelf="center"
                    />
                  </Flex> */}
                  <div
                  // alignSelf="flex-start"
                  // position="relative"
                  // right={-1}
                  // top={-1}
                  // onClick={async (e) => {
                  //   e.preventDefault();
                  //   deleteMessage(id);
                  // }}
                  >
                    DELETE
                  </div>
                </a>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Messages;
