"use client";

import { Follower } from "@lens-protocol/react-web";
import {
  ThirdwebProvider,
  useSigner,
  useWallet,
  metamaskWallet,
  useConnect,
} from "@thirdweb-dev/react";
import { Client } from "@xmtp/xmtp-js";
import { useEffect, useState } from "react";

export const XMTPWidget = (props: any) => {
  const [sendingComplete, setSendingComplete] = useState<boolean>(false);
  const signer = useSigner();
  const score = Math.floor(props.score.score);

  async function run() {
    console.log("INSIDE RUN", signer);
    let xmtp;
    if (signer) {
      console.log("INSIDE SIGNER");
      try {
        xmtp = await Client.create(signer, { env: "dev" });
        const conversation = await xmtp.conversations.newConversation(
          (props.follower as Follower).wallet.address
        );
        const d = await conversation.send(
          `I'm challenging you to beat me at DinoJump! Challenge me on http://localhost:3000/game/${props.lensHandle}/${score}`
        );
        console.log(d);
      } catch (error) {
        console.log("error sending message, ", error);
      }
      setSendingComplete(true);
    }
  }

  useEffect(() => {
    run();
  }, []);

  return sendingComplete ? (
    <h1>Challenge sent!!!</h1>
  ) : (
    <h1>Sending Challenge to {props.follower.wallet.defaultProfile?.handle}</h1>
  );
};
