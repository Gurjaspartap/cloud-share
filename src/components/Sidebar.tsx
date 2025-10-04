import { logoutUser } from '@/lib/firebaseFunctions';
import { Cloud, FolderOpen, Users, Settings, LogOut } from 'lucide-react';

type SidebarProps = {
  activeTab: 'myfiles' | 'shared';
  setActiveTab: (tab: 'myfiles' | 'shared') => void;
};

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'myfiles' as const, icon: FolderOpen, label: 'My Files' },
    { id: 'shared' as const, icon: Users, label: 'Shared with Me' }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-white/20">
        <Cloud className="w-8 h-8" />
        <span className="text-2xl font-bold">CloudShare</span>
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
              activeTab === item.id
                ? 'bg-white/20 shadow-lg'
                : 'hover:bg-white/10'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/20">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all mt-2" onClick={logoutUser}>
          <LogOut className="w-5 h-5"  />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}