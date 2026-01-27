import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const Captions = ({ captions, fps }: { captions: any[], fps: number }) => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill
            style={{
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: 160,
                pointerEvents: "none",
            }}
        >
            {captions.map((cap, i) => {
                const start = cap.start * fps;
                const end = cap.end * fps;
                if (frame < start || frame > end) return null;

                return (
                    <div
                        key={i}
                        style={{
                            background: "rgba(0,0,0,0.8)",
                            color: "white",
                            padding: "18px 32px",
                            borderRadius: 14,
                            fontSize: 48,
                            fontWeight: 800,
                            textTransform: "uppercase"
                        }}
                    >
                        {cap.text}
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};
