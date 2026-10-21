import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const AnimatedText = ({ text }: { text: string }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(frame, [0, 10], [0, 1]);
    const scale = spring({
        frame,
        fps,
        config: {
            damping: 12,
        },
    });

    return (
        <div style={{ opacity, transform: `scale(${scale})` }}>
            {text}
        </div>
    );
};
