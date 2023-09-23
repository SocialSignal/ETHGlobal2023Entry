import tippy from "tippy.js";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});

const summaryCache: any = {};

async function getSocialSignalSummary(address: string) {
  try {
    const data =
      summaryCache[address] ||
      (await (
        await fetch(
          `https://social-signal.vercel.app/api/extension/${address.trim()}`
        )
      ).json());

    summaryCache[address] = data;
  } catch (e) {
    console.error(e);
    return "FAILED TO RETRIEVE DATA";
  }
}

const allLinks = Array.from(document.getElementsByTagName("a"));

allLinks.forEach(async (x, i) => {
  if (x.href.indexOf("/address/") === -1) return;
  const address = x.href.split("/address/")[1].split("/")[0];

  // We aren't able to give a function as the content, so instead
  // we have to dynamically update the content when we are notified of mount event.
  tippy(x, {
    placement: "bottom",
    content: "",
    onMount: (instance) => {
      getSocialSignalSummary(address).then((summary) => {
        instance.setContent(`🍡 ${JSON.stringify(summary, null, 4)}`);
      });
    },
  });
});
