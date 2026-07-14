import { useState } from 'react';
import { Shield, Hash, ArrowLeftRight, Fingerprint } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { ToolTabs } from './components/layout/ToolTabs';
import { OutputPanel } from './components/layout/OutputPanel';
import { PasswordGenerator } from './components/tools/PasswordGenerator';
import { HashTool } from './components/tools/HashTool';
import { EncodeDecodeTool } from './components/tools/EncodeDecodeTool';
import { UUIDTool } from './components/tools/UUIDTool';
import { useHistory } from './hooks/useHistory';
import type { ToolConfig } from './types';

const TOOLS: ToolConfig[] = [
  { id: 'password', label: 'Password', icon: <Shield size={18} />, component: PasswordGenerator },
  { id: 'hash', label: 'Hash', icon: <Hash size={18} />, component: HashTool },
  { id: 'encode', label: 'Encode / Decode', icon: <ArrowLeftRight size={18} />, component: EncodeDecodeTool },
  { id: 'uuid', label: 'UUID', icon: <Fingerprint size={18} />, component: UUIDTool },
];

export default function App() {
  const [activeTool, setActiveTool] = useState('password');
  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory();

  const ActiveComponent = TOOLS.find((t) => t.id === activeTool)?.component || PasswordGenerator;

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <Sidebar
        history={history}
        onClearHistory={clearHistory}
        onRemoveItem={removeFromHistory}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ToolTabs tools={TOOLS} active={activeTool} onChange={setActiveTool} />

        <main className="flex-1 overflow-y-auto p-6">
          <ActiveComponent onGenerate={addToHistory} />
        </main>

        <OutputPanel outputs={history} onClear={clearHistory} />
      </div>
    </div>
  );
}
