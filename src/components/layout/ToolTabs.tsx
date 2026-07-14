import type { ToolConfig } from '../../types';

interface ToolTabsProps {
  tools: ToolConfig[];
  active: string;
  onChange: (id: string) => void;
}

const TAB_STYLES: Record<string, string> = {
  'password': 'tab-active-blue',
  'hash': 'tab-active-blue',
  'encode': 'tab-active-emerald',
  'uuid': 'tab-active-purple',
};

export function ToolTabs({ tools, active, onChange }: ToolTabsProps) {
  return (
    <nav className="px-6 pt-4 pb-2">
      <div className="flex gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onChange(tool.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 ${
              active === tool.id
                ? TAB_STYLES[tool.id] || 'tab-active-blue'
                : 'tab-inactive'
            }`}
          >
            <span className="text-lg">{tool.icon}</span>
            <span>{tool.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
