import { AbsoluteFill, Video, staticFile, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { VideoInput } from "../../../schema/video.schema";

export const VideoComparisonScene = ({
    videoUrl1,
    videoUrl1Offset = 0,
    videoUrl2,
    videoUrl2Offset = 0,
    videoUrl3,
    videoUrl3Offset = 0,
    splitPosition = 50,
    mode = "split",
    switchInterval = 1,
    timeline,
    videoFit = "cover",
    text,
    theme,
}: {
    videoUrl1: string;
    videoUrl1Offset?: number;
    videoUrl2: string;
    videoUrl2Offset?: number;
    videoUrl3?: string;
    videoUrl3Offset?: number;
    splitPosition?: number;
    mode?: "split" | "alternate" | "interleave" | "manual";
    switchInterval?: number;
    timeline?: { video: number; duration: number; offset?: number; playbackRate?: number }[];
    videoFit?: "cover" | "contain";
    text: string;
    theme: VideoInput["theme"];
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const resolvedVideo1 = videoUrl1.startsWith("/") ? staticFile(videoUrl1) : videoUrl1;
    const resolvedVideo2 = videoUrl2.startsWith("/") ? staticFile(videoUrl2) : videoUrl2;
    const resolvedVideo3 = videoUrl3 ? (videoUrl3.startsWith("/") ? staticFile(videoUrl3) : videoUrl3) : null;

    const renderSplit = () => (
        <>
            {/* Video 1 (Left Side) - Base layer */}
            <AbsoluteFill>
                <Video
                    src={resolvedVideo1}
                    startFrom={Math.round(videoUrl1Offset * fps)}
                    style={{ width: "100%", height: "100%", objectFit: videoFit }}
                />
            </AbsoluteFill>

            {/* Video 2 (Right Side) - Clipped layer */}
            <AbsoluteFill
                style={{
                    clipPath: `inset(0 0 0 ${splitPosition}%)`,
                }}
            >
                <Video
                    src={resolvedVideo2}
                    startFrom={Math.round(videoUrl2Offset * fps)}
                    style={{ width: "100%", height: "100%", objectFit: videoFit }}
                />
            </AbsoluteFill>

            {/* Split Line */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: `${splitPosition}%`,
                    width: "8px",
                    height: "100%",
                    backgroundColor: "white",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                }}
            />
        </>
    );

    const renderAlternate = () => {
        const framesPerSwitch = Math.max(1, Math.round(switchInterval * fps));
        const showVideo2 = Math.floor(frame / framesPerSwitch) % 2 === 1;

        return (
            <AbsoluteFill>
                <Video
                    src={showVideo2 ? resolvedVideo2 : resolvedVideo1}
                    startFrom={Math.round((showVideo2 ? videoUrl2Offset : videoUrl1Offset) * fps)}
                    style={{ width: "100%", height: "100%", objectFit: videoFit }}
                />
            </AbsoluteFill>
        );
    };

    const renderInterleave = () => {
        const showVideo2 = frame % 2 === 1;
        return (
            <AbsoluteFill>
                <Video
                    src={showVideo2 ? resolvedVideo2 : resolvedVideo1}
                    startFrom={Math.round((showVideo2 ? videoUrl2Offset : videoUrl1Offset) * fps)}
                    style={{ width: "100%", height: "100%", objectFit: videoFit }}
                />
            </AbsoluteFill>
        );
    };

    const renderManual = () => {
        if (!timeline || timeline.length === 0) return renderAlternate();

        let elapsedFrames = 0;

        return (
            <>
                {timeline.map((segment, index) => {
                    const segmentFrames = Math.max(1, Math.round(segment.duration * fps));
                    const currentElapsed = elapsedFrames;
                    elapsedFrames += segmentFrames;

                    const activeVideo = segment.video;
                    const activeOffset = segment.offset ?? (
                        activeVideo === 1 ? videoUrl1Offset : (activeVideo === 2 ? videoUrl2Offset : videoUrl3Offset)
                    );
                    const speed = segment.playbackRate ?? 1.0;

                    let resolvedSrc = resolvedVideo1;
                    if (activeVideo === 2) resolvedSrc = resolvedVideo2;
                    if (activeVideo === 3 && resolvedVideo3) resolvedSrc = resolvedVideo3;

                    return (
                        <Sequence
                            key={`${index}-${activeVideo}`}
                            from={currentElapsed}
                            durationInFrames={segmentFrames}
                            layout="none"
                        >
                            <AbsoluteFill>
                                <Video
                                    src={resolvedSrc}
                                    startFrom={Math.round(activeOffset * fps)}
                                    playbackRate={speed}
                                    style={{ width: "100%", height: "100%", objectFit: videoFit }}
                                />
                            </AbsoluteFill>
                        </Sequence>
                    );
                })}
            </>
        );
    }

    return (
        <AbsoluteFill style={{ backgroundColor: theme.background }}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                {mode === "split" && renderSplit()}
                {mode === "alternate" && renderAlternate()}
                {mode === "interleave" && renderInterleave()}
                {mode === "manual" && renderManual()}

                {mode === "split" && (
                    <>
                        <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 15, background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '8px', color: 'white', fontFamily: theme.fontFamily }}>
                            Before
                        </div>
                        <div style={{ position: 'absolute', top: 40, right: 40, zIndex: 15, background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '8px', color: 'white', fontFamily: theme.fontFamily }}>
                            After
                        </div>
                    </>
                )}

                {/* Overlay Text */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 150,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zIndex: 20,
                    }}
                >
                    {text && (
                        <h2
                            style={{
                                color: theme.textColor,
                                fontFamily: theme.fontFamily,
                                fontSize: "72px",
                                fontWeight: 900,
                                textShadow: "0 4px 15px rgba(0,0,0,0.8)",
                                padding: "20px 60px",
                                background: "linear-gradient(to right, transparent, rgba(0,0,0,0.6), transparent)",
                                display: "inline-block",
                                textTransform: 'uppercase',
                                letterSpacing: '2px'
                            }}
                        >
                            {text}
                        </h2>
                    )}
                </div>
            </div>
        </AbsoluteFill>
    );
};
