import { AbsoluteFill } from "remotion";
import { AnimatedText } from "../../../components/AnimatedText";

export const TextScene = ({ text, lyrics, theme }: any) => (
    <AbsoluteFill
        style={{
            justifyContent: "center",
            alignItems: "center",
            color: theme.textColor,
            fontFamily: theme.fontFamily,
            fontSize: 80,
            padding: 100,
            textAlign: "center",
        }}
    >
        <AnimatedText text={text} />
        {lyrics && (
            <div style={{
                position: "absolute",
                bottom: 80,
                fontSize: 32,
                opacity: 0.8,
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "8px 24px",
                borderRadius: 12,
                maxWidth: "80%"
            }}>
                {lyrics}
            </div>
        )}
    </AbsoluteFill>
);
