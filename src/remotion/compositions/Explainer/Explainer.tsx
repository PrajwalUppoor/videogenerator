import { AbsoluteFill, Sequence, Audio, useVideoConfig } from "remotion";
import { VideoInput } from "../../schema/video.schema";
import { SceneRenderer } from "./SceneRenderer";
import { Captions } from "../../components/Captions";

export const Explainer: React.FC<VideoInput> = (props) => {
    const { scenes, audioUrl, theme, captions } = props;
    const { fps } = useVideoConfig();

    let from = 0;

    return (
        <AbsoluteFill style={{ backgroundColor: theme.background }}>
            {audioUrl && <Audio src={audioUrl} />}
            {scenes.map((scene, index) => {
                const durationInFrames = Math.round(scene.duration * fps);
                const seq = (
                    <Sequence key={index} from={from} durationInFrames={durationInFrames}>
                        <SceneRenderer scene={scene} theme={theme} />
                    </Sequence>
                );
                from += durationInFrames;
                return seq;
            })}
            {captions && <Captions captions={captions} fps={fps} />}
        </AbsoluteFill>
    );
};
