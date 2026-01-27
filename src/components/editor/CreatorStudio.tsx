"use client";

import { VideoPreview } from "./VideoPreview";
import { FormEditor } from "./FormEditor";
import { Download, Play, Rocket, Save } from "lucide-react";

export default function CreatorStudio() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-100">
            {/* Navbar */}
            <nav className="border-b border-slate-800/50 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Rocket size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Remotion<span className="text-indigo-500">SaaS</span></span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition">
                            <Save size={16} /> Save Draft
                        </button>
                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-indigo-500/20">
                            <Play size={16} fill="currentColor" /> Export Video
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Editor */}
                    <div className="flex-1 max-w-3xl">
                        <FormEditor />
                    </div>

                    {/* Right: Preview */}
                    <div className="lg:w-[400px] xl:w-[450px]">
                        <VideoPreview />
                    </div>
                </div>
            </main>
        </div>
    );
}
