import React, { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { login } from '../firebase';
import { retrieveUserDecryptedData } from '../utils/indexeddb';

interface LoginProps {
  onUnlock: (user: any, keys: any[]) => void;
}

const Login: React.FC<LoginProps> = ({ onUnlock }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(false);

    try {
      const user = await login(email, password);
      const keys = await retrieveUserDecryptedData(user.uid, 'vault_keys');
      onUnlock(user, keys || []);
    } catch (error) {
      console.error('Login failed', error);
      setError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-500/10">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">API VAULT</h1>
        <p className="text-zinc-500 text-sm">Secure authorization required to access keys.</p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="space-y-4">
          <div className="relative">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className={`w-full bg-zinc-950 border ${error ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">
              Security Code
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter vault password..."
                className={`w-full bg-zinc-950 border ${error ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Access Denied. Invalid security code.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || !email || !password}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Decrypt Vault'
            )}
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </form>
      
      <p className="text-center mt-6 text-zinc-600 text-[10px] uppercase tracking-[0.2em]">
        Secure local storage system
      </p>
    </div>
  );
};

export default Login;
