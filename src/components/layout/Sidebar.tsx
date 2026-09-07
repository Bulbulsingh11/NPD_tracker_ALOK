import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  RotateCcw,
  Clock,
  FileBarChart,
  Lightbulb,
  Workflow,
  Settings,
  FlaskConical,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'register',
      label: 'Sample Register',
      icon: ClipboardList,
      badge: 'Master',
    },
    {
      id: 'tat',
      label: 'Lab Efficiency & TAT',
      icon: FlaskConical,
      badge: '7d Target',
    },
    {
      id: 'feedback',
      label: 'Customer Feedback',
      icon: MessageSquare,
      badge: 'Sales Action',
    },
    {
      id: 'redevelopment',
      label: 'Redevelopment RCA',
      icon: RotateCcw,
      badge: '12.7%',
    },
    {
      id: 'reports',
      label: 'Monthly NPD Report',
      icon: FileBarChart,
      badge: 'Jul 2026',
    },
    {
      id: 'insights',
      label: 'Chemist Workload',
      icon: Lightbulb,
      badge: null,
    },
    {
      id: 'workflow',
      label: 'Process SOP Flow',
      icon: Workflow,
      badge: null,
    },
    {
      id: 'settings',
      label: 'SLA Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-60 bg-slate-900 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="text-blue-400 font-bold text-base leading-tight uppercase tracking-wider flex items-center gap-2">
          <span>Alok Masterbatches</span>
        </div>
        <div className="text-slate-400 text-[11px] uppercase tracking-wider mt-1 font-semibold">
          NPD Management System
        </div>
        <div className="text-[9px] bg-slate-800 text-amber-400 border border-slate-700 px-2 py-0.5 rounded mt-2 font-bold inline-block">
          PROTOTYPE V2.0 • DEMO
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    isActive
                      ? 'bg-blue-700 text-blue-100'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="p-3 border-t border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400">
          AM
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-slate-200 truncate">
            Alok Management
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            Head Office Executive
          </div>
        </div>
      </div>
    </aside>
  );
};
