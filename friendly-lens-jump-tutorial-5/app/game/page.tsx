"use client";

declare global {
  interface Window {
    score: any;
  }
}

import { useEffect, useState } from "react";

import { Game } from "./main";
import Followers from "./followers";

import { useActiveProfile } from "@lens-protocol/react-web";

export default () => {
  const [gameover, setGameover] = useState<boolean>(false);
  const [scoreObj, setScore] = useState<any>();
  const [shouldLoadFriends, setShouldLoadFriends] = useState<boolean>(false);
  const {
    data: activeProfile,
    error: profileError,
    loading: isActiveProfileLoading,
  } = useActiveProfile();

  useEffect(() => {
    if (!isActiveProfileLoading && !activeProfile) {
      alert("Please login to play..");
    }
  }, [isActiveProfileLoading]);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = document.getElementById(
      "game"
    ) as HTMLCanvasElement;
    if (!canvas) throw new Error("Canvas not found");
    const ctx = canvas.getContext("2d");

    let game = new Game(ctx, canvas);
    game.setGameOverCallback((score) => {
      setGameover(true);
    });
    game.setScoreCallback((score) => {
      setScore(score);
      window.score = score;
    });
    game.start();
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ maxWidth: "1000px" }}>
        <canvas style={{ width: "100%" }} id="game"></canvas>
      </div>
      <div style={{ marginTop: "30px" }}>
        {gameover ? (
          <>
            <button
              className="button"
              onClick={() => {
                setShouldLoadFriends(true);
              }}
            >
              Challenge Friends ?
            </button>
            <a href="/game" className="button">
              Try again
            </a>
          </>
        ) : (
          ""
        )}

        {shouldLoadFriends && !isActiveProfileLoading ? (
          <Followers
            profileId={activeProfile?.id}
            lensHandle={activeProfile?.handle}
            score={scoreObj}
          ></Followers>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
