import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { LiveProvider, LivePreview, LiveError } from 'react-live';

function stripImports(src) {
  return src
    .replace(/^[ \t]*import\s+[^;]+;\s*/gm, '')
    .replace(/^[ \t]*import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"]\s*;?\s*/gm, '')
    .replace(/^[ \t]*import\s+['"][^'"]+['"]\s*;?\s*/gm, '')
    .replace(/^[ \t]*export\s+default\s+function\s+([A-Za-z0-9_$]+)/gm, 'function $1')
    .replace(/^[ \t]*export\s+default\s+/gm, '')
    .replace(/^[ \t]*export\s+const\s+/gm, 'const ')
    .replace(/^[ \t]*export\s+/gm, '');
}

function extractName(src) {
  const m = src.match(/(?:export\s+default\s+)?function\s+([A-Za-z0-9_$]+)/);
  const c = src.match(/(?:export\s+)?const\s+([A-Za-z0-9_$]+)\s*=/);
  return m?.[1] || c?.[1] || 'App';
}

const GeneratedResult = ({ code = '', title = 'Generated component', componentType = '' }) => {
  const [tab, setTab] = useState('preview');
  const [copied, setCopied] = useState(false);

  const liveCode = useMemo(() => {
    const cleaned = stripImports(code);
    if (!cleaned.trim()) return '';
    const name = extractName(code);
    return `${cleaned}\nrender(<${name} />)`;
  }, [code]);

  const scope = {
    React, useState, useEffect, useRef, useCallback, useMemo,
    require: (name) => {
      const map = { react: React, 'react-dom': ReactDOM };
      return map[name] || {};
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div className="mt-6 rounded-xl bg-[#06101a]/60 p-4 border border-white/6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => setTab('preview')} className={`rounded-md px-3 py-1 ${tab === 'preview' ? 'bg-white/8' : 'bg-transparent'}`}>
            Preview
          </button>
          <button onClick={() => setTab('code')} className={`rounded-md px-3 py-1 ${tab === 'code' ? 'bg-white/8' : 'bg-transparent'}`}>
            Code
          </button>
        </div>
        <div className="flex items-center gap-2">
          {componentType && (
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
              {componentType}
            </span>
          )}
          {tab === 'code' && (
            <button onClick={copyCode} className="rounded-md bg-linear-to-r from-cyan-400 to-blue-500 px-3 py-1 text-sm text-slate-900">
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </div>

      <div className="rounded-md bg-[#071317] p-4">
        {tab === 'preview' ? (
          <div className="min-h-[420px] overflow-hidden rounded-3xl bg-[#020617]">
            {liveCode ? (
              <LiveProvider code={liveCode} scope={scope} noInline>
                <LivePreview className="p-4" />
                <LiveError className="p-4 text-sm text-red-400 font-mono" />
              </LiveProvider>
            ) : (
              <div className="flex items-center justify-center h-[420px] text-gray-400">
                No component generated yet.
              </div>
            )}
          </div>
        ) : (
          <pre className="overflow-auto text-sm text-gray-200">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default GeneratedResult;
