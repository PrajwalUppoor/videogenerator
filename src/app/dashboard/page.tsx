import { TemplateMarketplace } from "@/components/marketplace/TemplateMarketplace";
import { Plus, LayoutGrid, Film, CreditCard, Settings } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800/50 flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Film size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Vidal<span className="text-indigo-500">AI</span></span>
                    </div>

                    <nav className="space-y-1">
                        <a href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 font-medium transition group">
                            <LayoutGrid size={18} /> Templates
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 transition group">
                            <Film size={18} /> My Projects
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 transition group">
                            <CreditCard size={18} /> Billing
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 transition group">
                            <Settings size={18} /> Settings
                        </a>
                    </nav>
                </div>

                <div className="mt-auto p-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-4 rounded-2xl shadow-lg shadow-indigo-500/10">
                        <p className="text-xs font-bold text-indigo-100 mb-1">PRO PLAN</p>
                        <p className="text-sm text-white font-medium mb-3">12 / 50 renders used</p>
                        <div className="w-full bg-indigo-400/30 h-1.5 rounded-full mb-4">
                            <div className="bg-white h-1.5 rounded-full w-[24%]" />
                        </div>
                        <button className="w-full py-2 bg-white text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 transition">Upgrade</button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <TemplateMarketplace />
                </div>
            </main>
        </div>
    );
}
