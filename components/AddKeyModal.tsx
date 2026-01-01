
import React, { useState } from 'react';
import { X, Shield, Info } from 'lucide-react';
import { APIKey } from '../types';
import { PROVIDERS } from '../constants';

interface AddKeyModalProps {
  onClose: () => void;
  onSubmit: (key: Omit<APIKey, 'id' | 'createdAt'>) => void;
}

const AddKeyModal: React.FC<AddKeyModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    provider: PROVIDERS[0],
    key: '',
    tags: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.key) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create New Secret</h2>
                <p className="text-zinc-500 text-sm">Add a new credential to your vault</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.15em]">Friendly Name</label>
              <input 
                autoFocus
                type="text"
                placeholder="e.g. Production OpenAI Key"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.15em]">Provider</label>
                <div className="relative">
                  <select 
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer"
                  >
                    {PROVIDERS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.15em]">Usage Tags</label>
                <input 
                  type="text"
                  placeholder="dev, prod, secondary"
                  onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '')})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.15em]">Secret / Key</label>
              <div className="relative">
                <textarea 
                  rows={3}
                  placeholder="Paste your sensitive key here..."
                  value={formData.key}
                  onChange={(e) => setFormData({...formData, key: e.target.value})}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none placeholder:text-zinc-700"
                />
                <div className="absolute right-4 bottom-4 flex items-center gap-1.5 text-zinc-600">
                  <Info className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase">Stored Encrypted</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-zinc-900 text-zinc-400 hover:text-white font-bold rounded-2xl transition-all border border-zinc-800"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Create Secret
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-zinc-900/50 p-6 border-t border-zinc-900 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest leading-none">
            Credentials are saved only to your local browser storage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddKeyModal;
