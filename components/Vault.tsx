import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Lock, 
  Settings, 
  LogOut, 
  Shield, 
  LayoutGrid, 
  List,
  Filter,
  RefreshCcw,
  Download
} from 'lucide-react';
import { APIKey } from '../types';
import KeyItem from './KeyItem';
import AddKeyModal from './AddKeyModal';
import { storeUserEncryptedData, retrieveUserDecryptedData } from '../utils/indexeddb';

interface VaultProps {
  onLock: () => void;
  user: any;
  initialKeys: APIKey[];
}

const Vault: React.FC<VaultProps> = ({ onLock, user, initialKeys }) => {
  const [keys, setKeys] = useState<APIKey[]>(initialKeys);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Persist keys whenever the keys state changes
  useEffect(() => {
    const saveKeysToDB = async () => {
      if (!user || !user.uid) return;
      try {
        await storeUserEncryptedData(user.uid, 'vault_keys', keys);
      } catch (err) {
        console.error('Failed to save keys to IndexedDB', err);
      }
    };
    saveKeysToDB();
  }, [keys, user]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const saveKeys = (newKeys: APIKey[]) => {
    setKeys(newKeys);
    // Persistence is handled in the keys useEffect.
  };

  const addKey = (key: Omit<APIKey, 'id' | 'createdAt'>) => {
    const newKey: APIKey = {
      ...key,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    saveKeys([newKey, ...keys]);
    setIsAddModalOpen(false);
  };

  const deleteKey = (id: string) => {
    if (confirm("Are you sure you want to delete this key? This cannot be undone.")) {
      saveKeys(keys.filter(k => k.id !== id));
    }
  };

  const editKey = (updatedKey: APIKey) => {
    saveKeys(keys.map(k => k.id === updatedKey.id ? updatedKey : k));
  };

  const filteredKeys = keys.filter(k => 
    k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl">
            <Shield className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vault Dashboard</h1>
            <p className="text-zinc-500 text-sm">Managing {keys.length} secure credentials</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {deferredPrompt && (
            <button 
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Install App</span>
            </button>
          )}
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400"
            title="Toggle View"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
          </button>
          <button 
            onClick={onLock}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Lock</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Create Secret</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800/50 rounded-[2rem] flex-1 flex flex-col min-h-[600px] overflow-hidden shadow-2xl">
        {/* Toolbar */}
        <div className="p-6 border-b border-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search by name, provider, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800/50 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-zinc-600 text-white"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-widest">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button 
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 500);
              }}
              className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Keys Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-zinc-500 animate-pulse text-sm">Decrypting metadata...</p>
            </div>
          ) : filteredKeys.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4" 
              : "flex flex-col gap-3 pb-4"
            }>
              {filteredKeys.map((key) => (
                <KeyItem 
                  key={key.id} 
                  data={key} 
                  layout={viewMode}
                  onDelete={() => deleteKey(key.id)}
                  onEdit={editKey}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-zinc-950 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800">
                <Lock className="w-8 h-8 text-zinc-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {searchQuery ? "No matching secrets found" : "Your vault is empty"}
              </h3>
              <p className="text-zinc-500 max-w-xs mx-auto mb-8">
                {searchQuery 
                  ? "Try refining your search or clearing filters to find what you're looking for." 
                  : "Store your API keys and secrets securely in this encrypted local vault."}
              </p>
              {!searchQuery && (
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-8 py-3.5 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-2xl transition-all shadow-xl shadow-white/5 active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Secret
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <AddKeyModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={addKey} 
        />
      )}
      
      <footer className="mt-8 flex justify-between items-center px-4">
        <div className="flex items-center gap-4 text-zinc-600 text-[10px] font-medium uppercase tracking-[0.2em]">
          <span>AES-256 SIMULATED</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span>LOCAL PERSISTENCE</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
           <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Vault Encrypted</span>
        </div>
      </footer>
    </div>
  );
};

export default Vault;
