import { AbsoluteFill, Img, useVideoConfig, staticFile } from "remotion";
import { AnimatedText } from "../../../components/AnimatedText";

const resolveAsset = (src: string) => {
    if (src.startsWith("/")) {
        return staticFile(src);
    }
    return src;
};

export const ImageTextScene = ({ text, lyrics, imageUrl, theme, layout = 'standard' }: any) => {
    const { width, height } = useVideoConfig();
    const isLandscape = width > height;
    const isFullScreen = layout === 'full-screen';
    const resolvedImage = imageUrl ? resolveAsset(imageUrl) : null;

    if (isFullScreen) {
        return (
            <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 160 }}>
                {resolvedImage && (
                    <Img
                        src={resolvedImage}
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Overlay for readability - made stronger for LED */}
                <AbsoluteFill style={{
                    background: "radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
                    backgroundColor: "rgba(0,0,0,0.4)"
                }} />

                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        padding: "0 100px",
                        fontSize: isLandscape ? 120 : 100, // Increased font size for 4K
                        color: "#ffffff",
                        fontWeight: 800, // Extra Bold for LED
                        fontFamily: theme.fontFamily,
                        textAlign: "center",
                        lineHeight: 1.2,
                        textShadow: `
                            0 0 30px rgba(0,0,0,0.8),
                            0 0 60px rgba(0,0,0,0.5),
                            6px 6px 0px rgba(0,0,0,0.9)
                        `,
                        WebkitTextStroke: "2px rgba(0,0,0,0.6)" // Stronger outline for larger text
                    }}
                >
                    <AnimatedText text={text} />
                </div>

                {lyrics && (
                    <div style={{
                        position: "absolute",
                        bottom: 80,
                        fontSize: 36,
                        fontWeight: 700,
                        color: "white",
                        backgroundColor: "rgba(0,0,0,0.75)",
                        padding: "16px 32px",
                        borderRadius: 20,
                        maxWidth: "85%",
                        textAlign: "center",
                        border: "2px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                    }}>
                        {lyrics}
                    </div>
                )}
            </AbsoluteFill>
        );
    }

    return (
        <AbsoluteFill
            style={{
                flexDirection: isLandscape ? "row" : "column",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            {resolvedImage ? (
                <Img
                    src={resolvedImage}
                    style={{
                        width: isLandscape ? "45%" : "80%",
                        height: isLandscape ? "80%" : "auto",
                        maxHeight: isLandscape ? "none" : "60%",
                        objectFit: "cover",
                        borderRadius: 20,
                        marginBottom: isLandscape ? 0 : 40,
                        marginRight: isLandscape ? 60 : 0
                    }}
                />
            ) : (
                <div
                    style={{
                        width: isLandscape ? "45%" : "80%",
                        height: isLandscape ? "80%" : 400,
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: 20,
                        marginBottom: isLandscape ? 0 : 40,
                        marginRight: isLandscape ? 60 : 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.textColor,
                        opacity: 0.5
                    }}
                >
                    No image selected
                </div>
            )}
            <div
                style={{
                    width: isLandscape ? "45%" : "100%",
                    padding: isLandscape ? "0 40px" : "0 80px",
                    fontSize: isLandscape ? 48 : 60,
                    color: theme.textColor,
                    fontFamily: theme.fontFamily,
                    textAlign: isLandscape ? "left" : "center"
                }}
            >
                <AnimatedText text={text} />
            </div>
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
};
