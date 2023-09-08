"use client"

declare global {
    interface Window {
        score:any;
    }
}

import React, {useEffect, useState} from 'react';
import { Game } from '../../main';
import { useActiveProfile } from '@lens-protocol/react-web';
import { Post } from './post';


export default function page({params} : {params : any}) {
    const [gameover, setGameover] = useState<Boolean>(false);
    const [gameWon, setGameWon] = useState<Boolean>(false);
    const [postStatus, setPostStatus] = useState<Boolean>(false);
    const [message, setMessage] = useState<String>();

    const {data: userProfile, error: userProfileError, loading: isUserProfileLoading} = useActiveProfile();

    useEffect(() => {
        if (!isUserProfileLoading && !userProfile) {
            window.location.href = `/?red=/game/${params.lensHandle}/${params.score}&challenger=${params.lensHandle}&score=${params.score}`;
        }

    }, [isUserProfileLoading]);

    useEffect(() => {
        const canvas : any = document.getElementById("game");
        const ctx = canvas.getContext("2d");

        let game = new Game(ctx, canvas);
        game.setGameOverCallback((score) => {
            setGameover(true);
            setGameWon(score.score > parseInt(params.score));
            if (score.score > parseInt(params.score)) {
                alert(`Congratulations! U jus beat ${params.lensHandle}!`);
            }
        });
        game.setScoreCallback((score) => {
            window.score = score;
        });
        game.start();
    }, []);

    const postToFeed = async () => {
        let messageText = '';
        if (gameWon) {
            messageText = `Yay! I just beat ${params.lensHandle} at LensJump!`;
        } else {
            messageText = `Nah! I just lost to ${params.lensHandle} at LensJump`;
        }
        setMessage(messageText);
        if (confirm("Post to feed: " + messageText)) {
            setPostStatus(true);
        }
    }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ maxWidth: "1000px" }}>
            {!gameover ? <canvas style={{ width: "100%" }} id="game"></canvas> : ""}
        </div>
        <div style={{ marginTop: "30px", display: "flex", flexDirection: "column" }}>
            {gameover ? (
                    {gameWon ? (
                        <h1>Congratulations {userProfile?.handle}! U won!</h1>
                    ) : (
                        <h1>Uh oh {userProfile?.handle}! U lost!</h1>
                    )}

                    <button onClick={postToFeed} className="button">
                        Post Result to Ur Lens feed!
                    </button>
                    {postStatus && userProfile ? (
                        <Post message={message || ""} profile={userProfile}
                    ) : (
                        ""
                    )} 
            ) : (
                ""
            )}
        </div>
    </div>
  );
}
