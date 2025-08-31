'use client';

import { PropsWithChildren, useMemo } from "react";
import { AgoraRTCProvider } from "agora-rtc-react";

export default function AgoraProvider({ children }: PropsWithChildren) {
    const client = useMemo(() => {
        if (typeof window === "undefined") return null;
        const AgoraRTC = require("agora-rtc-sdk-ng");
        return AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    }, []);

    if (!client) return null;
    return <AgoraRTCProvider client={client}>{children}</AgoraRTCProvider>;
}
