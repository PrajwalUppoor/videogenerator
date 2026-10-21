"use client";

import { Play, Star, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

const templates = [
    { id: "explainer", name: "Explainer Pro", category: "Education", duration: "15-60s", reviews: 128, image: "https://picsum.photos/seed/exp/400/700" },
    { id: "shorts", name: "Shorts Hook", category: "Social Media", duration: "15s", reviews: 450, image: "https://picsum.photos/seed/short/400/700" },
    { id: "ads", name: "Dynamic Ad", category: "E-commerce", duration: "30s", reviews: 89, image: "https://picsum.photos/seed/ad/400/700" },
];

export const TemplateMarketplace = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Template Marketplace</h2>
                    <p className="text-slate-500 text-sm">Choose a starting point for your next masterpiece</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-700 transition">Filter</button>
                    <button className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-500 transition">Trending</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <motion.div
                        key={template.id}
                        whileHover={{ y: -5 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group cursor-pointer"
                    >
                        <div className="aspect-[9/16] relative bg-slate-800">
                            <img src={template.image} alt={template.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-xl scale-90 group-hover:scale-100 transition transform">
                                    <Play size={24} fill="currentColor" />
                                </div>
                            </div>
                            <div className="absolute top-4 left-4">
                                <span className="bg-indigo-600 text-[10px] font-bold px-2 py-1 rounded-full text-white flex items-center gap-1 shadow-lg">
                                    <Zap size={10} fill="currentColor" /> POPULAR
                                </span>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-100">{template.name}</h3>
                                    <p className="text-xs text-slate-500">{template.category}</p>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                    <Star size={12} fill="currentColor" /> 4.9
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                                <div className="flex items-center gap-1">
                                    <Clock size={12} /> {template.duration}
                                </div>
                                <div>{template.reviews} reviews</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
