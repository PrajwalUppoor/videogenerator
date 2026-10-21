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
                    title: "Sample Video",
                    fps: 30,
                    width: 1080,
                    height: 1920,
                    scenes: [
                        { type: "text", text: "Welcome to our SaaS", duration: 3 },
                        { type: "image-text", text: "Create videos at scale", imageUrl: "https://picsum.photos/1080/1920", duration: 4 }
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
