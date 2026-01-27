import { AbsoluteFill } from "remotion";
import { AnimatedText } from "../../../components/AnimatedText";

export const TextScene = ({ text, theme }: any) => (
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
    </AbsoluteFill>
);
