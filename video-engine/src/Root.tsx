import { Composition } from "remotion";
import { Explainer } from "./compositions/Explainer/Explainer";
import { VideoSchema } from "./schema/video.schema";

export const Root: React.FC = () => {
    return (
        <>
            <Composition
                id="Explainer"
                component={Explainer}
                schema={VideoSchema}
                durationInFrames={300} // Fallback
                fps={30}
                width={1080}
                height={1920}
                calculateMetadata={({ props }) => {
                    const totalDurationSeconds = props.scenes.reduce((acc, scene) => acc + scene.duration, 0);
                    return {
                        durationInFrames: Math.ceil(totalDurationSeconds * props.fps),
                        width: props.width || 1080,
                        height: props.height || 1920,
                    };
                }}
                defaultProps={{
                    title: "Video Comparison Test",
                    fps: 30,
                    width: 1080,
                    height: 1920,
                    scenes: [
                        {
                            type: "text",
                            text: "Comparing Three Videos",
                            duration: 3,
                            splitPosition: 50,
                            videoUrl1Offset: 0,
                            videoUrl2Offset: 0,
                            videoUrl3Offset: 0,
                            mode: "split",
                            switchInterval: 1,
                            videoFit: "cover",
                            layout: "standard"
                        },
                        {
                            type: "video-comparison",
                            text: "User Req: 3-Video Manual",
                            videoUrl1: "/sample1.mp4",
                            videoUrl1Offset: 0,
                            videoUrl2: "/sample2.mp4",
                            videoUrl2Offset: 0,
                            videoUrl3: "/sample3.mp4",
                            videoUrl3Offset: 0,
                            splitPosition: 50,
                            mode: "manual",
                            switchInterval: 1,
                            videoFit: "contain",
                            timeline: [
                                { "video": 2, "duration": 7.7, "offset": 0, "playbackRate": 1.0 },
                                { "video": 3, "duration": 20.0, "offset": 0, "playbackRate": 2.0 },
                                { "video": 1, "duration": 30.0, "offset": 60.0, "playbackRate": 0.5 }
                            ],
                            duration: 57.7,
                            layout: "standard"
                        }
                    ],
                    theme: {
                        background: "#0f172a",
                        textColor: "#ffffff",
                        fontFamily: "Inter"
                    }
                }}
            />
        </>
    );
};
