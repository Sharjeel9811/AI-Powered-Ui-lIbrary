import { useMemo, useState } from 'react';

const GeneratedResult = ({ code = '', title = 'Generated component', componentType = '' }) => {
  const [tab, setTab] = useState('preview');
  const [copied, setCopied] = useState(false);

  const previewSrcDoc = useMemo(() => {
    const fallbackCode = `import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '24px', color: '#fff', background: '#020617', minHeight: '100vh' }}>
      <h3 style={{ margin: 0, fontSize: '24px' }}>No component generated yet.</h3>
    </div>
  );
}`;

    const sourceCode = code.trim() ? code : fallbackCode;
    const defaultFnMatch = sourceCode.match(/export default function\s+([A-Za-z0-9_]+)/);
    const exportConstMatch = sourceCode.match(/export\s+const\s+([A-Za-z0-9_]+)\s*=/);
    const componentName = defaultFnMatch?.[1] || exportConstMatch?.[1] || 'App';
    const shouldLoadTailwind = /\bclassName\s*=|\bclass\s*=/.test(sourceCode);
    const runtimeSource = sourceCode
      .replace(/^import\s.*$/gm, '')
      .replace(/export default function\s+([A-Za-z0-9_]+)\s*\(/, 'function $1(')
      .replace(/export default\s+([A-Za-z0-9_]+);?/g, '')
      .replace(/export\s+const\s+([A-Za-z0-9_]+)\s*=\s*/, 'const $1 = ');
    const encodedSource = JSON.stringify(`${runtimeSource}\nwindow.__GeneratedComponent = ${componentName};`).replace(/</g, '\\u003c');
    const tailwindScript = shouldLoadTailwind
      ? '<script src="https://cdn.tailwindcss.com"></script>'
      : '';

    return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    ${tailwindScript}
    <style>
      html, body, #root { margin: 0; width: 100%; min-height: 100%; background: #020617; }
      body { font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      * { box-sizing: border-box; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      try {
        const source = ${encodedSource};
        const transformed = Babel.transform(source, { presets: ['react'] }).code.replace(/^import\s.*$/gm, '').replace(/require\([^)]+\)/g, '');
        eval(transformed);
        const Component = window.__GeneratedComponent || App;
        ReactDOM.createRoot(document.getElementById('root')).render(
          React.createElement(Component)
        );
      } catch (error) {
        document.getElementById('root').innerHTML = '<pre style="color:#fca5a5; padding:24px; white-space:pre-wrap;">' + error.message + '</pre>';
      }
    </script>
  </body>
</html>`;
  }, [code]);

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
            <iframe
              title={`${title} preview`}
              sandbox="allow-scripts"
              srcDoc={previewSrcDoc}
              className="h-[420px] w-full border-0 bg-[#020617]"
            />
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
