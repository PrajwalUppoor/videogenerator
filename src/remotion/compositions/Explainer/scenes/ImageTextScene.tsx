import { AbsoluteFill, Img } from "remotion";

export const ImageTextScene = ({ text, imageUrl, theme }: any) => (
    <AbsoluteFill style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Img src={imageUrl} style={{ width: "80%", borderRadius: 20, marginBottom: 40 }} />
        <div
            style={{
                padding: "0 80px",
                fontSize: 60,
                color: theme.textColor,
                fontFamily: theme.fontFamily,
                textAlign: "center"
            }}
        >
            {text}
        </div>
    </AbsoluteFill>
);
