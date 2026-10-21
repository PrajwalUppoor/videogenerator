import { AbsoluteFill, Sequence, Audio, useVideoConfig, staticFile } from "remotion";
import { VideoInput } from "../../schema/video.schema";
import { SceneRenderer } from "./SceneRenderer";
import { Captions } from "../../components/Captions";

export const Explainer: React.FC<VideoInput> = (props) => {
    const { scenes, audioUrl, theme, captions } = props;
    const { fps } = useVideoConfig();

    const resolvedAudio = audioUrl?.startsWith("/") ? staticFile(audioUrl) : audioUrl;

    let from = 0;

    return (
        <AbsoluteFill style={{ backgroundColor: theme.background }}>
            {resolvedAudio && <Audio src={resolvedAudio} />}
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
