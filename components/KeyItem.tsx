
import React, { useState } from 'react';
import { 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  MoreVertical, 
  ExternalLink,
  Edit2
} from 'lucide-react';
import { APIKey } from '../types';

interface KeyItemProps {
  data: APIKey;
  layout: 'grid' | 'list';
  onDelete: () => void;
  onEdit: (key: APIKey) => void;
}

const KeyItem: React.FC<KeyItemProps> = ({ data, layout, onDelete, onEdit }) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(data.name);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRename = () => {
    onEdit({ ...data, name: editName });
    setIsEditing(false);
  };

  const maskedKey = data.key.replace(/./g, '•').substring(0, 16) + '...';

  if (layout === 'list') {
    return (
      <div className="bg-zinc-950/40 border border-zinc-800/50 hover:border-zinc-700/50 rounded-2xl px-6 py-4 flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-blue-500 transition-colors">
            <span className="text-xs font-bold uppercase">{data.provider.substring(0, 2)}</span>
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                autoFocus
                className="bg-zinc-900 border border-blue-500/50 text-white rounded px-2 py-1 text-sm focus:outline-none"
              />
            ) : (
              <h4 className="text-sm font-semibold truncate group-hover:text-white transition-colors">{data.name}</h4>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">{data.provider}</span>
              <span className="text-zinc-800">•</span>
              <span className="mono text-xs text-zinc-500">
                {showKey ? data.key : maskedKey}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setShowKey(!showKey)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleCopy}
            className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950/40 border border-zinc-800/50 hover:border-blue-500/30 rounded-3xl p-5 group transition-all flex flex-col h-full relative overflow-hidden">
      {/* Provider Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded-lg">
          {data.provider}
        </span>
        <button 
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        {isEditing ? (
          <input 
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            autoFocus
            className="w-full bg-zinc-900 border border-blue-500/50 text-white rounded px-2 py-1 text-base focus:outline-none"
          />
        ) : (
          <h4 className="text-lg font-bold truncate group-hover:text-blue-400 transition-colors" onClick={() => setIsEditing(true)}>
            {data.name}
          </h4>
        )}
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">
          Added {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-3 flex-1 flex flex-col justify-center mb-4 relative overflow-hidden">
        <p className="mono text-sm text-zinc-400 break-all leading-relaxed pr-8">
          {showKey ? data.key : maskedKey}
        </p>
        <button 
          onClick={() => setShowKey(!showKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-700 hover:text-zinc-400"
        >
          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-auto">
        <button 
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            copied 
              ? 'bg-green-500/10 border-green-500/20 text-green-500' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Quick Copy
            </>
          )}
        </button>
        <button 
          className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl text-xs font-bold transition-all"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>

      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-600/10 transition-colors" />
    </div>
  );
};

export default KeyItem;
