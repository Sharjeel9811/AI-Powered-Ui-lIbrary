import axios from 'axios';
import { Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { ServerUrl } from '../App';
import GeneratedResult from '../Components/GeneratedResult';

const Generate = () => {
  const userData = useSelector((state) => state.user.userData);
  const UserRole = userData?.role;
  const aicredits = userData?.aicredits ?? 0;
  const lowcredits = UserRole === 'user' && aicredits < 50;
  const canGenerate = Boolean(userData);

  const [prompt, setprompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedName, setGeneratedName] = useState('');
  const [generatedMeta, setGeneratedMeta] = useState(null);
  const [generatedType, setGeneratedType] = useState('card');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const progressTimerRef = useRef(null);
  const historyStorageKey = 'virtual-ui-generated-history';
  const maxHistoryItems = 20;

  const clearProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const inferComponentType = (promptText) => {
    const lowerPrompt = promptText.toLowerCase();

    if (/\bnav(igation)?\b|navbar|menu/.test(lowerPrompt)) return 'navbar';
    if (/\bhero\b|landing page|banner/.test(lowerPrompt)) return 'hero';
    if (/\bsidebar\b|drawer/.test(lowerPrompt)) return 'sidebar';
    if (/\bmodal\b|popup|dialog/.test(lowerPrompt)) return 'modal';
    if (/\bform\b|input|signup|sign up|login|contact/.test(lowerPrompt)) return 'form';
    if (/\bprofile\b|avatar|user card/.test(lowerPrompt)) return 'profile';
    if (/\bpricing\b|plan|subscription/.test(lowerPrompt)) return 'pricing';
    if (/\bfeature\b|section|grid/.test(lowerPrompt)) return 'feature';
    if (/\bbutton\b|cta|call to action/.test(lowerPrompt)) return 'button';

    return 'card';
  };

  const loadHistory = () => {
    try {
      const storedHistory = window.localStorage.getItem(historyStorageKey);
      if (!storedHistory) return;

      const parsedHistory = JSON.parse(storedHistory);
      if (Array.isArray(parsedHistory)) {
        setHistoryItems(parsedHistory.slice(0, maxHistoryItems));
      }
    } catch (error) {
      console.error('Failed to load generation history', error);
    }
  };

  const saveHistory = (entry) => {
    try {
      setHistoryItems((currentHistory) => {
        const nextHistory = [entry, ...currentHistory].slice(0, maxHistoryItems);
        window.localStorage.setItem(historyStorageKey, JSON.stringify(nextHistory));
        return nextHistory;
      });
    } catch (error) {
      console.error('Failed to save generation history', error);
    }
  };

  const buildFallbackComponent = (promptText) => {
    const cleanPrompt = promptText.trim() || 'Beautiful card component';
    const lowerPrompt = cleanPrompt.toLowerCase();
    const componentType = inferComponentType(cleanPrompt);
    const title = cleanPrompt
      .replace(/\s+/g, ' ')
      .replace(/card component$/i, '')
      .trim()
      .replace(/^./, (char) => char.toUpperCase()) || 'Card Component';

    const isNavbar = /\bnav(igation)?\b|navbar|menu/.test(lowerPrompt);
    const isHero = /\bhero\b|landing page|banner/.test(lowerPrompt);
    const isForm = /\bform\b|input|signup|sign up|login|contact/.test(lowerPrompt);
    const isProfile = /\bprofile\b|avatar|user card/.test(lowerPrompt);
    const isModal = /\bmodal\b|popup|dialog/.test(lowerPrompt);
    const isSidebar = /\bsidebar\b|drawer/.test(lowerPrompt);
    const isFeature = /\bfeature\b|section|grid/.test(lowerPrompt);
    const isButton = /\bbutton\b|cta|call to action/.test(lowerPrompt)
      && !isNavbar
      && !isHero
      && !isForm
      && !isProfile
      && !isModal
      && !isSidebar
      && !isFeature;

    if (componentType === 'button' || isButton) {
      return `import React from 'react';

export default function GeneratedButton() {
  return (
    <button style={{
      minWidth: '180px',
      minHeight: '52px',
      border: 'none',
      borderRadius: '999px',
      padding: '14px 22px',
      background: 'linear-gradient(90deg, #67e8f9, #3b82f6)',
      color: '#071317',
      fontSize: '16px',
      fontWeight: 800,
      boxShadow: '0 14px 36px rgba(59,130,246,0.28)',
      cursor: 'pointer'
    }}>
      ${JSON.stringify(title)}
    </button>
  );
}`;
    }

    if (componentType === 'navbar' || isNavbar) {
      return `import React from 'react';

export default function GeneratedNavbar() {
  return (
    <nav style={{
      width: '100%',
      maxWidth: '960px',
      minHeight: '72px',
      borderRadius: '24px',
      padding: '16px 22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(7,19,23,0.96)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#fff'
    }}>
      <div style={{ fontWeight: 800, letterSpacing: '0.08em' }}>Virtual UI</div>
      <div style={{ display: 'flex', gap: '18px', fontSize: '14px', color: 'rgba(255,255,255,0.72)' }}>
        <span>Home</span><span>Components</span><span>Docs</span>
      </div>
      <button style={{ border: 'none', borderRadius: '999px', padding: '10px 16px', background: '#67e8f9', color: '#071317', fontWeight: 700 }}>Get Started</button>
    </nav>
  );
}`;
    }

    if (componentType === 'hero' || isHero) {
      return `import React from 'react';

export default function GeneratedHero() {
  return (
    <section style={{
      width: '100%',
      maxWidth: '980px',
      minHeight: '420px',
      borderRadius: '28px',
      padding: '40px',
      background: 'linear-gradient(135deg, rgba(7,19,23,0.98), rgba(10,15,35,0.98))',
      border: '1px solid rgba(103,232,249,0.16)',
      color: '#fff'
    }}>
      <div style={{ display: 'inline-flex', padding: '7px 12px', borderRadius: '999px', background: 'rgba(34,211,238,0.1)', color: '#67e8f9', fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>AI Generated</div>
      <h1 style={{ margin: '20px 0 12px', fontSize: '54px', lineHeight: 1.02 }}>Build something beautiful</h1>
      <p style={{ maxWidth: '620px', fontSize: '18px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)' }}>${JSON.stringify(cleanPrompt)}</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
        <button style={{ border: 'none', borderRadius: '999px', padding: '14px 22px', background: 'linear-gradient(90deg, #67e8f9, #3b82f6)', color: '#071317', fontWeight: 800 }}>Start Now</button>
        <button style={{ borderRadius: '999px', padding: '14px 22px', background: 'transparent', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', fontWeight: 700 }}>Learn More</button>
      </div>
    </section>
  );
}`;
    }

    if (componentType === 'form' || isForm) {
      return `import React from 'react';

export default function GeneratedForm() {
  return (
    <form style={{ width: '100%', maxWidth: '520px', minHeight: '360px', borderRadius: '26px', padding: '28px', background: 'rgba(7,19,23,0.98)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
      <h3 style={{ margin: 0, fontSize: '30px' }}>Join the list</h3>
      <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>${JSON.stringify(cleanPrompt)}</p>
      <div style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
        <input placeholder="Email address" style={{ height: '48px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '0 14px' }} />
        <button style={{ height: '48px', border: 'none', borderRadius: '14px', background: 'linear-gradient(90deg, #67e8f9, #3b82f6)', color: '#071317', fontWeight: 800 }}>Submit</button>
      </div>
    </form>
  );
}`;
    }

    if (componentType === 'profile' || isProfile) {
      return `import React from 'react';

export default function GeneratedProfile() {
  return (
    <div style={{ width: '100%', maxWidth: '420px', minHeight: '320px', borderRadius: '28px', padding: '24px', background: 'linear-gradient(135deg, rgba(7,19,23,0.98), rgba(10,15,35,0.98))', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '22px', background: 'linear-gradient(135deg, #67e8f9, #3b82f6)', display: 'grid', placeItems: 'center', color: '#071317', fontWeight: 900, fontSize: '24px' }}>A</div>
      <h3 style={{ margin: '16px 0 6px', fontSize: '28px' }}>Alex Morgan</h3>
      <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>${JSON.stringify(cleanPrompt)}</p>
    </div>
  );
}`;
    }

    if (componentType === 'modal' || isModal) {
      return `import React from 'react';

export default function GeneratedModal() {
  return (
    <div style={{ width: '100%', maxWidth: '560px', minHeight: '260px', borderRadius: '28px', padding: '26px', background: 'rgba(7,19,23,0.98)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
      <h3 style={{ margin: 0, fontSize: '28px' }}>Modal title</h3>
      <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>${JSON.stringify(cleanPrompt)}</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
        <button style={{ border: 'none', borderRadius: '14px', padding: '12px 18px', background: 'linear-gradient(90deg, #67e8f9, #3b82f6)', color: '#071317', fontWeight: 800 }}>Confirm</button>
        <button style={{ borderRadius: '14px', padding: '12px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.14)', color: '#fff' }}>Cancel</button>
      </div>
    </div>
  );
}`;
    }

    if (componentType === 'sidebar' || isSidebar) {
      return `import React from 'react';

export default function GeneratedSidebar() {
  return (
    <aside style={{
      width: '340px',
      minHeight: '520px',
      borderRadius: '28px',
      padding: '24px',
      background: 'linear-gradient(180deg, rgba(7,19,23,0.98), rgba(10,15,35,0.98))',
      border: '1px solid rgba(103,232,249,0.14)',
      color: '#fff',
      boxShadow: '0 24px 80px rgba(0,0,0,0.42)',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '18px', background: 'linear-gradient(135deg, #67e8f9, #3b82f6)', display: 'grid', placeItems: 'center', color: '#071317', fontWeight: 900 }}>A</div>
        <div>
          <h3 style={{ margin: 0, fontSize: '24px' }}>Alex Morgan</h3>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.62)', fontSize: '13px' }}>Product Designer</p>
        </div>
      </div>

      <div style={{ borderRadius: '22px', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>${JSON.stringify(cleanPrompt)}</p>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        <div style={{ height: '44px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 14px', color: 'rgba(255,255,255,0.8)' }}>Dashboard</div>
        <div style={{ height: '44px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 14px', color: 'rgba(255,255,255,0.8)' }}>Projects</div>
        <div style={{ height: '44px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 14px', color: 'rgba(255,255,255,0.8)' }}>Settings</div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
        <button style={{ flex: 1, border: 'none', borderRadius: '14px', padding: '12px 16px', background: 'linear-gradient(90deg, #67e8f9, #3b82f6)', color: '#071317', fontWeight: 800 }}>Open</button>
        <button style={{ flex: 1, borderRadius: '14px', padding: '12px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', fontWeight: 700 }}>Settings</button>
      </div>
    </aside>
  );
}`;
    }

    if (componentType === 'feature' || isFeature) {
      return `import React from 'react';

export default function GeneratedFeature() {
  return (
    <section style={{ width: '100%', maxWidth: '960px', minHeight: '300px', borderRadius: '28px', padding: '28px', background: 'rgba(7,19,23,0.98)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
      <h3 style={{ margin: 0, fontSize: '30px' }}>Feature section</h3>
      <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>${JSON.stringify(cleanPrompt)}</p>
    </section>
  );
}`;
    }

    return `import React from 'react';

export default function GeneratedCard() {
  return (
    <div style={{
      maxWidth: '460px',
      borderRadius: '28px',
      padding: '28px',
      background: 'linear-gradient(135deg, rgba(7, 19, 23, 0.98), rgba(10, 15, 35, 0.98))',
      border: '1px solid rgba(103, 232, 249, 0.18)',
      color: '#fff',
      boxShadow: '0 24px 80px rgba(0, 0, 0, 0.42)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.24), transparent 36%), radial-gradient(circle at bottom left, rgba(34, 211, 238, 0.18), transparent 32%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        display: 'inline-flex',
        padding: '7px 12px',
        borderRadius: '999px',
        fontSize: '12px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#67e8f9',
        background: 'rgba(34, 211, 238, 0.1)',
        border: '1px solid rgba(103, 232, 249, 0.14)',
        position: 'relative',
        zIndex: 1
      }}>
        AI Generated
      </div>

      <h3 style={{ marginTop: '18px', marginBottom: '10px', fontSize: '30px', lineHeight: 1.1, position: 'relative', zIndex: 1 }}>
        ${JSON.stringify(title)}
      </h3>

      <p style={{ margin: 0, color: 'rgba(255,255,255,0.76)', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
        ${JSON.stringify(cleanPrompt)}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', marginTop: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ borderRadius: '20px', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '6px' }}>Speed</div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>Instant</div>
        </div>
        <div style={{ borderRadius: '20px', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '6px' }}>Style</div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>Premium</div>
        </div>
        <div style={{ borderRadius: '20px', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '6px' }}>Layout</div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>Responsive</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px', position: 'relative', zIndex: 1 }}>
        <button style={{
          border: 'none',
          borderRadius: '999px',
          padding: '12px 18px',
          fontWeight: 700,
          background: 'linear-gradient(90deg, #67e8f9, #3b82f6)',
          color: '#071317',
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.25)'
        }}>
          Get Started
        </button>
        <button style={{
          borderRadius: '999px',
          padding: '12px 18px',
          fontWeight: 700,
          border: '1px solid rgba(255,255,255,0.14)',
          background: 'transparent',
          color: '#fff'
        }}>
          Preview
        </button>
      </div>
    </div>
  );
}`;
  };

  useEffect(() => {
    loadHistory();

    return () => {
      clearProgressTimer();
    };
  }, []);

  const handleGenerate = async (promptText) => {
    if (!promptText) return;
    setLoading(true);
    setErrorMessage('');

    if (!canGenerate) {
      const localCode = buildFallbackComponent(promptText);
      const localType = inferComponentType(promptText);

      setGeneratedName('GeneratedCard');
      setGeneratedCode(localCode);
      setGeneratedType(localType);
      setGeneratedMeta({ width: '460px', height: 'auto' });
      saveHistory({
        id: `${Date.now()}`,
        name: 'GeneratedCard',
        prompt: promptText,
        code: localCode,
        type: localType,
        width: '460px',
        height: 'auto',
        createdAt: new Date().toISOString(),
      });

      setLoading(false);
      window.setTimeout(() => {
        setProgress(0);
      }, 500);
      return;
    }

    try {
      const response = await axios.post(
        `${ServerUrl}/api/component/generate`,
        { prompt: promptText },
        { withCredentials: true }
      );

      const parsed = response?.data?.parsed;
      if (!parsed?.code) {
        throw new Error('AI response did not include component code');
      }

      setGeneratedName(parsed.name || 'GeneratedComponent');
      setGeneratedCode(parsed.code);
      setGeneratedType(parsed?.type || inferComponentType(promptText));
      setGeneratedMeta({
        width: response?.data?.width || parsed?.width || 'auto',
        height: response?.data?.height || parsed?.height || 'auto',
      });

      saveHistory({
        id: `${Date.now()}`,
        name: parsed.name || 'GeneratedComponent',
        prompt: promptText,
        code: parsed.code,
        type: parsed?.type || inferComponentType(promptText),
        width: response?.data?.width || parsed?.width || 'auto',
        height: response?.data?.height || parsed?.height || 'auto',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      setGeneratedName('GeneratedCard');
      setGeneratedCode(buildFallbackComponent(promptText));
      setGeneratedType(inferComponentType(promptText));
      setGeneratedMeta({ width: '460px', height: 'auto' });
      saveHistory({
        id: `${Date.now()}`,
        name: 'GeneratedCard',
        prompt: promptText,
        code: buildFallbackComponent(promptText),
        type: inferComponentType(promptText),
        width: '460px',
        height: 'auto',
        createdAt: new Date().toISOString(),
      });
      setErrorMessage('');
    } finally {
      setLoading(false);
      window.setTimeout(() => {
        setProgress(0);
      }, 500);
    }
  };

  const startGeneration = () => {
    const promptText = prompt.trim();

    if (!promptText) return;
    if (loading || progressTimerRef.current) return;

    setErrorMessage('');
    setGeneratedCode('');
    setGeneratedName('');
    setGeneratedMeta(null);
    setGeneratedType(inferComponentType(promptText));
    setProgress(0);

    clearProgressTimer();
    progressTimerRef.current = window.setInterval(() => {
      setProgress((current) => {
        const nextProgress = Math.min(current + 10, 100);

        if (nextProgress === 100) {
          clearProgressTimer();
          setGeneratedName('GeneratedCard');
          setGeneratedCode(buildFallbackComponent(promptText));
          setGeneratedType(inferComponentType(promptText));
          setGeneratedMeta({ width: '460px', height: 'auto' });
          void handleGenerate(promptText);
        }

        return nextProgress;
      });
    }, 90);
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(124, 58, 237, 0.16), transparent 32%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 28%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.12), transparent 30%), linear-gradient(135deg, #050816 0%, #0b1026 45%, #111936 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_55%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 bg-transparent border border-white/20">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold tracking-widest text-indigo-300 uppercase">AI Component Studio</span>
          </div>

          <h2 className="text-5xl font-bold mb-3 leading-tight">
            <span className="text-white">Built With <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">AI</span></span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Create stunning UI components with the power of artificial intelligence.</p>
        </motion.div>

        {UserRole === 'user' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex justify-end mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl">
              <span className="text-sm text-gray-400">AI Credits:</span>
              <span className={`text-sm font-semibold ${lowcredits ? 'text-red-400' : 'text-green-400'}`}>{aicredits}</span>
            </div>
          </motion.div>
        )}

        {lowcredits && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-end mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-400/20">
              <span className="text-sm text-red-400">Low AI Credits! Please recharge to continue generating components.</span>
            </div>
          </motion.div>
        )}

        {!canGenerate && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              You are not signed in, so the page will use local demo generation if the backend is unavailable.
          </motion.div>
        )}

        {errorMessage && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl p-1 mb-8 *:bg-linear-to-r from-cyan-400 to-blue-500">
          <div className="rounded-xl bg-[#071317] p-6">
            <p className="text-sm text-gray-400 mb-4">Tip: Start by describing the component you want to create, and let our AI generate it for you!</p>
            <textarea
              onChange={(e) => setprompt(e.target.value)}
              value={prompt}
              rows={3}
              name="componentDescription"
              id="componentDescription"
              placeholder="Describe the component you want to create..."
              className="w-full p-4 rounded-lg bg-gradient-to-b from-[#0b1220]/60 to-[#071317]/40 border border-white/10 text-gray-100 placeholder:text-gray-400 shadow-inner shadow-black/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow resize-y text-lg leading-relaxed"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02), 0 8px 30px rgba(2,6,23,0.6)' }}
            />

            {(progress > 0 || loading) && !generatedCode && (
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
                  <span>Generation Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-[width] duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  {progress < 100 ? 'Building your component...' : 'Generating component now...'}
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <div className="relative mr-3">
                <button
                  type="button"
                  onClick={() => setHistoryOpen((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
                >
                  History
                  <span className="text-xs text-cyan-300">{historyItems.length}</span>
                </button>

                {historyOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#071317] shadow-2xl shadow-black/40">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Previous components</p>
                      <p className="mt-1 text-xs text-slate-400">Click one to restore it.</p>
                    </div>

                    <div className="max-h-72 overflow-auto p-2">
                      {historyItems.length === 0 ? (
                        <p className="px-3 py-4 text-sm text-slate-400">No saved components yet.</p>
                      ) : (
                        historyItems.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setGeneratedName(item.name);
                              setGeneratedCode(item.code);
                              setGeneratedMeta({ width: item.width, height: item.height });
                              setGeneratedType(item.type || inferComponentType(item.prompt));
                              setprompt(item.prompt);
                              setHistoryOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full rounded-xl border border-transparent px-3 py-3 text-left transition-colors hover:border-white/10 hover:bg-white/5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{item.prompt}</p>
                              </div>
                              <div className="shrink-0 text-right text-[11px] text-slate-500">
                                <div>{item.width}</div>
                                <div>{item.height}</div>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                disabled={lowcredits || !prompt.trim() || (loading && !generatedCode) || progressTimerRef.current}
                onClick={startGeneration}
                className={`inline-flex items-center gap-3 px-5 py-2 rounded-md bg-linear-to-r from-cyan-400 to-blue-500 text-sm font-semibold text-slate-900 shadow-lg hover:from-cyan-500 hover:to-blue-600 transform transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 active:scale-95 ${lowcredits || !prompt.trim() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                {generatedCode
                  ? 'Generate Another'
                  : loading
                    ? 'Generating...'
                    : progressTimerRef.current
                      ? `Generating ${progress}%`
                      : 'Generate Component'}
              </button>
            </div>
          </div>
        </motion.div>

        {generatedCode && (
          <div className="mt-6">
            {generatedMeta ? (
              <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-200">
                  {generatedMeta.width} x {generatedMeta.height}
                </span>
              </div>
            ) : null}
            <GeneratedResult code={generatedCode} title={generatedName} componentType={generatedType} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Generate;
