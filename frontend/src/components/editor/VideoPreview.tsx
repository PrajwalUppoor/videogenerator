"use client";

import { Player } from "@remotion/player";
import { Explainer } from "@/remotion/compositions/Explainer/Explainer";
import { useEditorStore } from "@/store/useEditorStore";

export const VideoPreview = () => {
    const { videoData } = useEditorStore();

    // Calculate total duration
    const totalDurationInSeconds = videoData.scenes.reduce((acc, scene) => acc + scene.duration, 0);
    const durationInFrames = Math.max(1, Math.round(totalDurationInSeconds * 30));

    return (
        <div className="w-full aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl sticky top-8">
            <Player
                component={Explainer}
                inputProps={videoData}
                durationInFrames={durationInFrames}
                fps={30}
                compositionWidth={1080}
                compositionHeight={1920}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                controls
                autoPlay
                loop
            />
        </div>
    );
};
