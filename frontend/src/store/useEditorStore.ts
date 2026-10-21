import { create } from 'zustand';

interface Scene {
    type: 'text' | 'image-text';
    text: string;
    lyrics?: string;
    imageUrl?: string;
    duration: number;
    layout?: 'standard' | 'full-screen';
}

interface VideoData {
    title: string;
    audioUrl?: string;
    width: number;
    height: number;
    scenes: Scene[];
    theme: {
        background: string;
        textColor: string;
        fontFamily: string;
    };
}

interface EditorState {
    videoData: VideoData;
    setVideoData: (data: Partial<VideoData>) => void;
    updateScene: (index: number, scene: Partial<Scene>) => void;
    addScene: () => void;
    removeScene: (index: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    videoData: {
        title: 'My Awesome Video',
        width: 1080,
        height: 1920,
        scenes: [
            { type: 'text', text: 'Hook your audience here!', duration: 3, layout: 'standard' },
        ],
        theme: {
            background: '#0f172a',
            textColor: '#ffffff',
            fontFamily: 'Inter',
        },
    },
    setVideoData: (data) => set((state) => ({
        videoData: { ...state.videoData, ...data }
    })),
    updateScene: (index, scene) => set((state) => {
        const newScenes = [...state.videoData.scenes];
        newScenes[index] = { ...newScenes[index], ...scene };
        return { videoData: { ...state.videoData, scenes: newScenes } };
    }),
    addScene: () => set((state) => ({
        videoData: {
            ...state.videoData,
            scenes: [...state.videoData.scenes, { type: 'text', text: 'New Scene', duration: 3, layout: 'standard' }]
        }
    })),
    removeScene: (index) => set((state) => ({
        videoData: {
            ...state.videoData,
            scenes: state.videoData.scenes.filter((_, i) => i !== index)
        }
    })),
}));
