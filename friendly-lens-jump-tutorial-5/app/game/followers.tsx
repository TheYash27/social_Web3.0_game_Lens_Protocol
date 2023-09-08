"use client";

import { useEffect, useState } from "react";
import { useProfileFollowers, Follower } from "@lens-protocol/react-web";
import { useWallet, metamaskWallet, useConnect } from "@thirdweb-dev/react";
import { XMTPWidget } from "./XMTPWidget";

export default function Followers(props: any) {
  const [startXMTP, setStartXMTP] = useState<boolean>(false);
  const [follower, setFollower] = useState();
  const metamaskConfig = metamaskWallet();
  const connect = useConnect();
  const {
    data: followers,
    loading,
    hasMore,
    next,
  } = useProfileFollowers({
    profileId: props.profileId as any,
    limit: 50,
  });

  useEffect(() => {
    console.log("Loading the followers, ...", followers);
  }, [followers]);

  function convertIPFSUrls(link: string, acc: Follower) {
    if (!link) {
      return `https://cdn.stamp.fyi/avatar/eth:${acc.wallet.address}?s=300`;
    }
    if (link.indexOf("ipfs://") >= 0) {
      try {
        return "https://ipfs.io/ipfs/" + link.split("ipfs://")[1];
        // ipfs://jahuihkejnakuhrhkjn
      } catch (error) {
        console.log("Error converting the Image Url", error);
        return link;
      }
    } else {
      return link;
    }
  }

  async function startChallengeProcess(selectedFollower: any) {
    // load wallet
    const wallet = await connect(metamaskConfig);
    console.log("wallet", wallet);
    setFollower((x) => selectedFollower);
    alert(
      `Challenging ${
        (selectedFollower as Follower).wallet.defaultProfile?.handle
      }`
    );
    setStartXMTP(true);
  }

  return (
    <div>
      {startXMTP ? (
        <XMTPWidget
          follower={follower}
          lensHandle={props.lensHandle}
          score={props.score}
        />
      ) : (
        ""
      )}
      <div
        style={{
          maxWidth: "500px",
          maxHeight: "400px",
          overflowY: "scroll",
          border: "1px solid gray",
          marginTop: "30px",
          padding: "10px",
        }}
      >
        <h3 style={{ textDecoration: "underline" }}>Followers</h3>
        {(followers ? followers : []).map((acc: any) => (
          <div
            key={acc.wallet.defaultProfile?.id}
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <div style={{ marginRight: "4px" }}>
              <img
                width={"20px"}
                src={convertIPFSUrls(
                  acc.wallet.defaultProfile?.picture?.original.url,
                  acc
                )}
              />
            </div>
            <div style={{ marginRight: "15px" }}>
              <p>{acc.wallet.defaultProfile?.handle}</p>
            </div>
            <div>
              <a
                className="button"
                href="#"
                onClick={() => startChallengeProcess(acc)}
              >
                Challenge
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
