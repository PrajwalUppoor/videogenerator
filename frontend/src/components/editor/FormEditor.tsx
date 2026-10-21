"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { Plus, Trash2, GripVertical, Settings2, Sparkles, Image as ImageIcon, Music, Type, MessageSquareText, Upload, Link, Wand2, Loader2, Monitor, Smartphone, Square as SquareIcon, Maximize2 } from "lucide-react";
import { motion, Reorder } from "framer-motion";
import { useRef, useState } from "react";

export const FormEditor = () => {
    const { videoData, setVideoData, updateScene, addScene, removeScene } = useEditorStore();
    const audioInputRef = useRef<HTMLInputElement>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            if (e.target === audioInputRef.current) {
                setAudioFile(file);
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    callback(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMagicTranscribe = async () => {
        if (!audioFile) {
            alert("Please upload an audio file first!");
            return;
        }

        setIsTranscribing(true);
        try {
            const formData = new FormData();
            formData.append("file", audioFile);

            const response = await fetch("http://localhost:8000/api/v1/ai/transcribe", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Transcription failed");

            const data = await response.json();

            if (data.scenes && data.scenes.length > 0) {
                setVideoData({ scenes: data.scenes });
            }
        } catch (error) {
            console.error("Transcription error:", error);
            alert("Failed to transcribe audio. Make sure the backend is running and OpenAI API key is configured.");
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) {
            alert("Please enter a prompt first!");
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch("http://localhost:8000/api/v1/video/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: aiPrompt }),
            });

            if (!response.ok) throw new Error("AI generation failed");

            const data = await response.json();

            // Merge titles and theme if returned, otherwise just update scenes
            setVideoData({
                title: data.title || videoData.title,
                scenes: data.scenes,
                theme: data.theme || videoData.theme
            });

            setAiPrompt(""); // Clear prompt after successful generation
        } catch (error) {
            console.error("AI generation error:", error);
            alert("Failed to generate video with AI. Make sure the backend is running.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header & Global Audio */}
            <div className="space-y-4">
                <input
                    type="text"
                    value={videoData.title}
                    onChange={(e) => setVideoData({ title: e.target.value })}
                    className="text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full text-slate-100"
                    placeholder="Video Title"
                />

                <div className="flex flex-col gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <label className="text-xs font-semibold text-slate-400 flex items-center gap-2 mb-2">
                        <Maximize2 size={14} /> Video Format
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {[
                            { id: 'portrait', label: '9:16', icon: <Smartphone size={16} />, w: 1080, h: 1920 },
                            { id: 'landscape', label: '16:9', icon: <Monitor size={16} />, w: 1920, h: 1080 },
                            { id: '4k', label: '4K', icon: <Monitor size={16} className="text-amber-400" />, w: 3840, h: 2160 },
                            { id: '2k', label: '2K', icon: <Monitor size={16} className="text-sky-400" />, w: 2560, h: 1440 },
                            { id: 'ultrawide', label: '21:9', icon: <Maximize2 size={16} />, w: 2560, h: 1080 },
                            { id: 'led', label: 'LED', icon: <SquareIcon size={16} />, w: 1920, h: 640 },
                            { id: 'square', label: '1:1', icon: <SquareIcon size={16} />, w: 1080, h: 1080 },
                        ].map((fmt) => (
                            <button
                                key={fmt.id}
                                onClick={() => setVideoData({ width: fmt.w, height: fmt.h })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${videoData.width === fmt.w && videoData.height === fmt.h
                                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                                    : 'bg-slate-800/40 border-slate-700 text-slate-500 hover:border-slate-600'
                                    }`}
                            >
                                {fmt.icon}
                                <span className="text-[10px] font-bold">{fmt.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold">Width</label>
                            <input
                                type="number"
                                value={videoData.width}
                                onChange={(e) => setVideoData({ width: parseInt(e.target.value) || 1080 })}
                                className="w-full bg-slate-800/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold">Height</label>
                            <input
                                type="number"
                                value={videoData.height}
                                onChange={(e) => setVideoData({ height: parseInt(e.target.value) || 1920 })}
                                className="w-full bg-slate-800/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                            <Music size={14} /> Background Audio
                        </label>
                        <button
                            onClick={() => audioInputRef.current?.click()}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition flex items-center gap-1"
                        >
                            <Upload size={10} /> Upload MP3
                        </button>
                    </div>
                    <input
                        type="file"
                        ref={audioInputRef}
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setVideoData({ audioUrl: url }))}
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={videoData.audioUrl || ''}
                            onChange={(e) => setVideoData({ audioUrl: e.target.value })}
                            className="flex-1 bg-slate-800/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400 focus:border-indigo-500 outline-none font-mono"
                            placeholder="Audio URL (or upload file)"
                        />
                        <button
                            onClick={handleMagicTranscribe}
                            disabled={!audioFile || isTranscribing}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-indigo-500/20"
                        >
                            {isTranscribing ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Wand2 size={14} />
                            )}
                            Magic Transcribe
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-slate-800 rounded-2xl">
                    <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-[14px]">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-indigo-400" /> AI Video Generator
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                                className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                                placeholder="Describe the video you want to create..."
                            />
                            <button
                                onClick={handleAiGenerate}
                                disabled={isGenerating || !aiPrompt.trim()}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isGenerating ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Wand2 size={14} />
                                )}
                                Generate
                            </button>
                        </div>
                    </div>
                </div>

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
                                        <div className="flex items-center gap-1 bg-slate-800/50 p-0.5 rounded ml-2">
                                            {[
                                                { id: 'standard', label: 'Standard' },
                                                { id: 'full-screen', label: 'Full Screen' }
                                            ].map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => updateScene(index, { layout: opt.id as any })}
                                                    className={`px-2 py-1 text-[9px] font-bold uppercase rounded transition-all ${(scene.layout || 'standard') === opt.id
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'text-slate-500 hover:text-slate-300'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
                                                <Type size={12} /> Display Text
                                            </label>
                                            <textarea
                                                value={scene.text}
                                                onChange={(e) => updateScene(index, { text: e.target.value })}
                                                className="w-full bg-slate-800/50 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition outline-none resize-none text-sm"
                                                placeholder="Enter scene text..."
                                                rows={2}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
                                                <MessageSquareText size={12} /> Lyrics / Script
                                            </label>
                                            <textarea
                                                value={scene.lyrics || ''}
                                                onChange={(e) => updateScene(index, { lyrics: e.target.value })}
                                                className="w-full bg-slate-800/50 border border-slate-800 rounded-lg p-3 text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition outline-none resize-none text-sm"
                                                placeholder="Enter lyrics for this scene..."
                                                rows={2}
                                            />
                                        </div>
                                    </div>

                                    {scene.type === 'image-text' && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
                                                    <ImageIcon size={12} /> Image Asset
                                                </label>
                                                <input
                                                    type="file"
                                                    id={`image-upload-${index}`}
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleFileUpload(e, (url) => updateScene(index, { imageUrl: url }))}
                                                />
                                                <label
                                                    htmlFor={`image-upload-${index}`}
                                                    className="text-[10px] cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition flex items-center gap-1"
                                                >
                                                    <Upload size={10} /> Attach Image
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={scene.imageUrl || ''}
                                                    onChange={(e) => updateScene(index, { imageUrl: e.target.value })}
                                                    className="flex-1 bg-slate-800/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400 focus:border-indigo-500 outline-none"
                                                    placeholder="Image URL"
                                                />
                                            </div>
                                        </div>
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
        </div >
    );
};
