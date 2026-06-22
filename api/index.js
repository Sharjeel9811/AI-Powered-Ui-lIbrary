import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));

// MongoDB connection
try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Database Connected Successfully');
} catch (error) {
  console.error('Database connection failed:', error.message);
}

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use(cookieParser());

// ---------- Models ----------
const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  aicredits: { type: Number, default: 150 },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const componentSchema = new mongoose.Schema({
  name: String,
  code: String,
  props: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  npmPackage: String,
}, { timestamps: true });

const ComponentModel = mongoose.model('Component', componentSchema);

// ---------- Middleware ----------
const ISAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: 'Not Authenticated' });
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

// ---------- Helpers ----------
const generateToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  } catch (error) {
    console.error('Token generation failed:', error.message);
    return null;
  }
};

// ---------- AI Helper ----------
const AskAi = async (messages) => {
  const axios = (await import('axios')).default;
  try {
    if (!messages || messages.length === 0) throw new Error('Messages array is empty');
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'deepseek/deepseek-chat',
      messages,
      max_tokens: 2000,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const content = response?.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content found in response');
    return content;
  } catch (error) {
    console.error('Error in AskAi function:', error);
    throw error;
  }
};

// ---------- Auth Routes ----------
app.post('/api/auth/google', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and Email are required' });
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email });
    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: 'Google Authentication Successful', token, user });
  } catch (error) {
    return res.status(500).json({ message: 'Google Authentication Failed', error: error.message });
  }
});

app.get('/api/auth/logout', async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(200).json({ message: 'Logout Successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Logout Failed', error: error.message });
  }
});

// ---------- Component Routes ----------
app.post('/api/component/generate', ISAuth, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !String(prompt).trim()) return res.status(400).json({ message: 'Prompt is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'user' && user.aicredits < 50) return res.status(403).json({ message: 'Not enough AI credits' });

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
- No TypeScript.
- Never use fixed positioning.
- Use strong visual hierarchy, layered surfaces, soft gradients, glassmorphism, and subtle borders.
- Include the right UI structure for the requested type.
- Make the card feel complete with zero props passed and make it visually impressive at first glance.
- Prefer concise, readable component code with reusable constants for colors, spacing, and shadows.
- Escape every double quote inside the code string as \\" and every newline as \\n.
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
      aicredits: user.role === 'user' ? user.aicredits : null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

app.post('/api/component/save', ISAuth, async (req, res) => {
  try {
    const { name, code, props, visibility = 'private', npmPackage = '' } = req.body;
    if (!name || !code) return res.status(400).json({ message: 'Name and code are required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingPublicComponent = await ComponentModel.findOne({ visibility: 'public', name });
    const existingOwnedComponent = await ComponentModel.findOne({ owner: req.userId, name });

    if (user.role === 'admin') {
      if (visibility === 'public' && existingPublicComponent) {
        return res.status(400).json({ message: 'A public component with this name already exists. Please choose a different name.' });
      }
    }

    if (user.role === 'user') {
      if (existingOwnedComponent || existingPublicComponent) {
        return res.status(400).json({ message: 'You already have a component with this name, or a public component with this name exists. Please choose a different name.' });
      }
    }

    const component = new ComponentModel({
      name, code, props, owner: req.userId, visibility, npmPackage,
    });

    await component.save();
    return res.status(201).json({ message: 'Component saved successfully', component });
  } catch (error) {
    console.error('Error in SaveComponent controller:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ---------- User Routes ----------
app.get('/api/user/current', async (req, res) => {
  try {
    const { token } = req.cookies || {};
    if (!token) return res.status(200).json({ message: 'No active session', user: null });

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (verifyError) {
      return res.status(200).json({ message: 'No active session', user: null });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) return res.status(200).json({ message: 'No active session', user: null });

    return res.status(200).json({ message: 'User Found', user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to Fetch User', error: error.message });
  }
});

export default app;
