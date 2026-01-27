"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { Plus, Trash2, GripVertical, Settings2, Sparkles } from "lucide-react";
import { motion, Reorder } from "framer-motion";

export const FormEditor = () => {
    const { videoData, setVideoData, updateScene, addScene, removeScene } = useEditorStore();

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div>
                <input
                    type="text"
                    value={videoData.title}
                    onChange={(e) => setVideoData({ title: e.target.value })}
                    className="text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full text-slate-100"
                    placeholder="Video Title"
                />
            </div>

            {/* Scenes */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-300 flex items-center gap-2">
                        Scenes <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-500 font-normal">{videoData.scenes.length}</span>
                    </h2>
                    <button
                        onClick={addScene}
                        className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition"
                    >
                        <Plus size={16} /> Add Scene
                    </button>
                </div>

                <div className="space-y-4">
                    {videoData.scenes.map((scene, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-5 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={scene.type}
                                            onChange={(e) => updateScene(index, { type: e.target.value as any })}
                                            className="bg-slate-800 text-xs text-slate-400 border-none rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500"
                                        >
                                            <option value="text">Text Scene</option>
                                            <option value="image-text">Image + Text</option>
                                        </select>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                                            Duration:
                                            <input
                                                type="number"
                                                value={scene.duration}
                                                onChange={(e) => updateScene(index, { duration: parseFloat(e.target.value) })}
                                                className="bg-transparent w-8 text-indigo-400 focus:outline-none text-center"
                                                step="0.5"
                                            />s
                                        </div>
                                    </div>

                                    <textarea
                                        value={scene.text}
                                        onChange={(e) => updateScene(index, { text: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition outline-none resize-none"
                                        placeholder="Enter scene text..."
                                        rows={2}
                                    />

                                    {scene.type === 'image-text' && (
                                        <input
                                            type="text"
                                            value={scene.imageUrl}
                                            onChange={(e) => updateScene(index, { imageUrl: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400 focus:border-indigo-500 outline-none"
                                            placeholder="Image URL"
                                        />
                                    )}
                                </div>
                                <button
                                    onClick={() => removeScene(index)}
                                    className="p-2 text-slate-600 hover:text-red-400 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Theme Settings */}
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Settings2 size={16} /> Theme Settings
                </h2>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-slate-500">Background Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={videoData.theme.background}
                                onChange={(e) => setVideoData({ theme: { ...videoData.theme, background: e.target.value } })}
                                className="h-10 w-20 bg-transparent border-none cursor-pointer"
                            />
                            <span className="text-sm text-slate-300 font-mono tracking-tighter uppercase">{videoData.theme.background}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-slate-500">Text Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={videoData.theme.textColor}
                                onChange={(e) => setVideoData({ theme: { ...videoData.theme, textColor: e.target.value } })}
                                className="h-10 w-20 bg-transparent border-none cursor-pointer"
                            />
                            <span className="text-sm text-slate-300 font-mono tracking-tighter uppercase">{videoData.theme.textColor}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
