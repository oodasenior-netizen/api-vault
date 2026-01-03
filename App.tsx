
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Vault from './components/Vault';
import { VaultStatus } from './types';
import { APIKey } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<VaultStatus>('locked');
  const [user, setUser] = useState<any>(null);
  const [initialKeys, setInitialKeys] = useState<APIKey[]>([]);

  const handleUnlock = (userData: any, keys: APIKey[]) => {
    setUser(userData);
    setInitialKeys(keys);
    setStatus('unlocked');
  };

  const handleLock = () => {
    setUser(null);
    setInitialKeys([]);
    setStatus('locked');
  };

  // Handle auto-lock on inactivity (optional, but good for vault security)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    const resetTimer = () => {
      if (status === 'unlocked') {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          handleLock();
        }, 1000 * 60 * 10); // Auto-lock after 10 mins
      }
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(timeout);
    };
  }, [status]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center p-4">
      {status === 'locked' ? (
        <Login onUnlock={handleUnlock} />
      ) : (
        <Vault onLock={handleLock} user={user} initialKeys={initialKeys} />
      )}
    </div>
  );
};

export default App;

