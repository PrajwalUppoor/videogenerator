import { VideoInput } from "../../schema/video.schema";
import { TextScene } from "./scenes/TextScene";
import { ImageTextScene } from "./scenes/ImageTextScene";
import { VideoComparisonScene } from "./scenes/VideoComparisonScene";

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
        case "video-comparison":
            return (
                <VideoComparisonScene
                    text={scene.text}
                    videoUrl1={scene.videoUrl1!}
                    videoUrl1Offset={scene.videoUrl1Offset}
                    videoUrl2={scene.videoUrl2!}
                    videoUrl2Offset={scene.videoUrl2Offset}
                    videoUrl3={scene.videoUrl3}
                    videoUrl3Offset={scene.videoUrl3Offset}
                    splitPosition={scene.splitPosition}
                    mode={scene.mode}
                    switchInterval={scene.switchInterval}
                    timeline={scene.timeline}
                    videoFit={scene.videoFit}
                    theme={theme}
                />
            );
        default:
            return null;
    }
};
