import React from 'react'
import { ContentFocus, ProfileOwnedByMe, useCreatePost } from '@lens-protocol/react-web';
import axios from 'axios';
import { useEffect, useState } from 'react';

type JsonBinResult = {
    record: any,
    metadata: {
        id: string,
        createdAt: string,
        private: boolean
    }
}

export default function Post({message, profile} : { message: string, profile: ProfileOwnedByMe}) {

    const [postingStarted, setPostingStarted] = useState<Boolean>(false);
    const upload = async (data: unknown): Promise<String> => {
        const res = await axios.post(`https://api.jsonbin.io/v3/b`, serialized, {
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2b$10$Yu1FDU2/0UrBXHeO6x96Ce8fvp13kBNOcgSguJGJZr.iNB1WQGhri'
                'X-Bin-Private': 'false',
            }
        });
        let url = serialized;
        return `https://api.jsonbin.io/v3/b/${(res.data as JsonBinResult).metadata.id}?meta=false`;

        const { execute, error, isPending } = useCreatePost({ publisher: profile, upload});

        useEffect(() => {
            run()
        }, []);

        async function run() {
            await execute({
                content: message,
                contentFocus: ContentFocus.TEXT_ONLY,
                locale: 'en'
            })
            setPostingStarted(true);
        }
    }
  return (
    <div>
        {!isPending && postingStarted} ? 'Congratulations! Ur attempt of playing the game has been successfully posted to Ur Lens feed!' : <h1>Posting....</h1>
    </div>
  )
}
