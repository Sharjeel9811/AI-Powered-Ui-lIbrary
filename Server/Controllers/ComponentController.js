import User from '../Models/UserModel.js';

import { AskAi } from '../Utils/OperROuter.js';
export const GenerateComponent = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !String(prompt).trim()) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'user' && user.aicredits < 50) {
      return res.status(403).json({ message: 'Not enough AI credits' });
    }

    const normalizedPrompt = String(prompt).trim();

    const systemContent = `You are a senior UI engineer generating ONE premium React component that matches the user's prompt.

Output ONLY a valid JSON object. No markdown, no backticks, no explanation.

CRITICAL: Your entire response must be parseable by JSON.parse(). Start with { and end with }.

OUTPUT FORMAT:
{
  "name": "ComponentName",
  "code": "<full component code as single escaped string>",
  "props": ["prop1", "prop2"],
  "width": "number or responsive size",
  "height": "number or responsive size",
  "type": "card|button|hero|navbar|form|profile|modal|sidebar|feature|other"
}

--- CODE RULES ---
- The generated component must match the user's prompt. Do not default to a card unless the prompt asks for a card.
- Infer the correct component type from the prompt: button, hero, navbar, form, profile, modal, sidebar, feature section, pricing card, dashboard widget, or other.
- If the user request is vague, default to a polished hero section or feature block, not a card.
- Use a single named export only: export const ComponentName = ({ ...props }) => { ... }
- Inline styles ONLY. No CSS classes, no Tailwind, no styled-components.
- All props must have default values.
- Self-contained only. No external libraries except React and its hooks.
- Do NOT include any import or require statements. React is already in scope.
- No TypeScript.
- Never use fixed positioning.
- Use strong visual hierarchy, layered surfaces, soft gradients, glassmorphism, and subtle borders.
- Include the right UI structure for the requested type.
- Make the card feel complete with zero props passed and make it visually impressive at first glance.
- Prefer concise, readable component code with reusable constants for colors, spacing, and shadows.
- Escape every double quote inside the code string as \" and every newline as \n.
- Infer the width and height directly from the requested content and make the component size feel correct for that layout.
- If the request is a card, provide a realistic card width between 320px and 520px and a height that matches the content density.
- If the request is a hero, navbar, sidebar, modal, or form, size it according to that structure instead of card defaults.
- If the content is taller, increase height naturally instead of forcing a cramped design.
- Make sizing decisions based on the visible elements in the component, not arbitrary defaults.

--- DESIGN RULES ---
- Dark backgrounds: #020617, #0b1020, #0f172a, #111827.
- Accent colors: #22d3ee, #3b82f6, #a855f7, #10b981, #f59e0b.
- border-radius: 20px to 28px on cards, 12px to 16px on buttons.
- Font: system-ui, -apple-system, sans-serif.
- Subtle borders: 1px solid rgba(255,255,255,0.08).
- Box shadows: layered shadows with depth, never flat.
- The output must look like a premium marketing card.
- The first render should feel finished, not like a placeholder.
- The component must communicate its size visually through balanced spacing and proportion.
- The output must feel tailored to the specific prompt, not generic.

--- LIVE PREVIEW RULES ---
- Renders inside react-live sandbox. Container is dark #020617, 800px wide, 400px min-height.
- NEVER use position fixed. It breaks the sandbox.
- NEVER import from any external package. Only React and its hooks are in scope.
- Everything must be self-contained inside the component.
- Use widths between 280px and 720px so it centers nicely in preview.
`;

    const messages = [
      { role: 'system', content: systemContent },
      { role: 'user', content: `Create a polished premium card component from this request: ${normalizedPrompt}` },
    ];
    const aiResponse = await AskAi(messages);
    let parsed;
    try {
      // First parse raw response; fallback to unescaped content if provider returns escaped JSON string.
      parsed = JSON.parse(aiResponse);
    } catch (error) {
      try {
        const clean = aiResponse.replace(/\\n/g, '\n').replace(/\\"/g, '"').trim();
        parsed = JSON.parse(clean);
      } catch (fallbackError) {
        console.error('Failed to parse AI response:', fallbackError.message);
        return res.status(500).json({ message: 'Failed to parse AI response' });
      }
    }

    if (parsed?.code) {
      parsed.code = parsed.code
        .split('\n').filter(l => !/^\s*import\b/.test(l)).join('\n')
        .replace(/^\s*export\s+/gm, '')
        .replace(/export default function\s+([A-Za-z0-9_]+)\s*\(/, 'function $1(')
        .replace(/export\s+const\s+([A-Za-z0-9_]+)\s*=\s*/, 'const $1 = ');
    }

    if (user.role === 'user') {
      user.aicredits = user.aicredits - 50;
      await user.save();
    }

    const detectedWidth = parsed?.width || '320px - 520px';
    const detectedHeight = parsed?.height || 'auto';

    return res.json({
      parsed,
      width: detectedWidth,
      height: detectedHeight,
      aicredits: user.role === 'user' ? user.aicredits : null
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
