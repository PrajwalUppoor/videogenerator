import { VideoInput } from "../../schema/video.schema";
import { TextScene } from "./scenes/TextScene";
import { ImageTextScene } from "./scenes/ImageTextScene";

export const SceneRenderer = ({
    scene,
    theme,
}: {
    scene: VideoInput["scenes"][number];
    theme: VideoInput["theme"];
}) => {
    switch (scene.type) {
        case "text":
            return <TextScene text={scene.text} lyrics={scene.lyrics} theme={theme} />;
        case "image-text":
            return (
                <ImageTextScene
                    text={scene.text}
                    lyrics={scene.lyrics}
                    imageUrl={scene.imageUrl!}
                    theme={theme}
                    layout={scene.layout}
                />
            );
        default:
            return null;
    }
};
