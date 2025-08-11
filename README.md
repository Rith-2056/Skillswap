## 🛠️ SkillSwap

SkillSwap is a peer-to-peer micro-help platform to request and offer short bursts of help — from debugging a script to editing an essay — with a lightweight, friendly UX.

“Everyone has something to teach. Everyone has something to learn.”

---

## ✨ Features

- Authentication
  - Google Sign-In via Firebase Auth
  - Protected routes, auth-aware UI, loading states
- Profiles
  - Bio, skills with category/proficiency, external links
  - Skill endorsements with counters
  - Testimonials (submission + profile-owner approval flow)
  - Badges and achievements (auto-awarded based on rules)
- Real-time Chat
  - Firestore-backed chats per request
  - Live message stream with read/unread
  - Notifications for new chats/messages
- Leaderboard
  - Karma-based ranking (top contributors)
  - Multiple view modes: Standard, Compact (cards), Detailed
  - Rank-change indicators, top badges, personal-rank hint
  - One-click social sharing
- Contributions & Activity
  - “My Contributions” and request history
  - Share contributions socially
- Social Sharing
  - Web Share API (mobile)
  - Twitter/X, LinkedIn, Facebook, Email, Telegram, WhatsApp
- AI Assist (Gemini)
  - Tag suggestions for requests
  - Clarity tips and quality analysis
  - Optional description enhancement with lightweight placeholders
  - Robust fallback simulation when API not available
- Accessibility & UX Polish
  - Skip-to-content, keyboard focus management
  - Reduced motion support (prefers-reduced-motion)
  - Semantic markup, ARIA, WCAG-friendly contrast choices
  - Framer Motion animations gated by motion preferences
- Design System
  - Centralized tokens for spacing, colors, typography
  - Standardized styles for `Button`, `Card`, inputs, alerts, modals

---

## 🧱 Tech Stack

- Frontend: React (Vite)
- Routing: React Router v7
- Styling: Tailwind CSS
- Animations: Framer Motion
- Icons: Lucide Icons
- Date utils: date-fns
- Backend: Firebase (Auth, Firestore)
- AI: Google Generative AI (Gemini)

Key packages: react 19, vite 6, firebase 11, @google/generative-ai, tailwindcss 3, framer-motion, lucide-react.

---

## 🗂 Project Structure

- `src/lib/firebase.js`: Firebase initialization (Auth, Firestore)
- `src/lib/userFunctions.js`: User creation/update, endorsements, badge helpers
- `src/utils/chatService.js`: Chats and messages (create, subscribe, send, unread)
- `src/utils/aiService.js`: Gemini tag suggestions, clarity tips, request analysis, enhancement (with simulation fallback)
- `src/utils/achievementSystem.js`: Badge catalog, tiers, rules, awarding
- `src/utils/socialSharingUtils.js`: Web Share API + platform share URLs
- `src/utils/accessibilityUtils.js`: Reduced motion hook, focus ring, skip link
- `src/utils/DesignSystem.js`: Tokens and standardized component styles
- `src/components/ChatWindow.jsx`: Real-time chat UI
- `src/components/Leaderboard.jsx`: Enhanced leaderboard
- `src/pages/ProfilePage.jsx`: Profile, endorsements, testimonials, badges
- `src/layouts/MainLayout.jsx`: App shell, responsive nav, footer, transitions
- `firebase.json`, `firestore.rules`, `firestore.indexes.json`: Hosting, security rules, indexes
- `UI/`: Optional separate TypeScript UI playground (standalone Vite app)

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+ (20+ recommended)
- Firebase project + Firebase CLI (`npm i -g firebase-tools`)
- Google AI Studio API Key (optional but recommended for AI features)

### Install
```bash
npm install
```

### Environment Variables (AI)
Create a `.env` in project root:
```bash
# Google AI (Gemini) key for request assist features
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```
Notes:
- If omitted, AI features simulate outputs so the app still works for demo/development.

### Firebase Configuration
Update `src/lib/firebase.js` with your Firebase config (Auth + Firestore). Example:
```js
// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
```
Then:
- Enable Google provider in Firebase Auth.
- Create a Firestore database.

### Firestore Rules & Indexes
Deploy included rules and indexes:
```bash
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

Rules cover:
- `users` (public read, self write)
- `requests` (+ nested `responses`)
- `chats` (participants-only access for read/update/create)
- `notifications` (recipient-only access)

Indexes optimize `chats`, `requests`, `notifications` queries.

---

## 🧪 Development

- Start dev server:
```bash
npm run dev
```

- Build for production:
```bash
npm run build
```

- Preview production build:
```bash
npm run preview
```

- Lint:
```bash
npm run lint
```

---

## 🚀 Deployment

### Firebase Hosting (configured)
`firebase.json` serves the Vite build (`dist`) with SPA rewrites:
```bash
npm run build
firebase deploy --only hosting
```

### Vercel / Netlify
- Build command: `npm run build`
- Output dir: `dist`
- Add `VITE_GOOGLE_AI_API_KEY` in project settings

---

## 🔐 Security & Privacy

- Keep secrets out of source control. The sample Firebase config in `src/lib/firebase.js` should be updated to your project; consider migrating to environment variables in production builds.
- Firestore security rules restrict sensitive operations; deploy before real usage.
- Web Share API uses native OS share sheet where available.

---

## 🧠 AI Features (Gemini)

- Tag suggestions for requests
- Clarity tips (concise, actionable bullet points)
- Request quality scores (clarity, specificity, likelihood)
- Optional description enhancement (adds `<placeholder>` only when needed)
- Simulation fallback allows continued use without a key

Env: GOOGLE_AI_API_KEY = <your key>


---

## 🏅 Achievements & Badges

- Categories: Participation, Helper, Skill, Community, Special
- Tiers: Bronze, Silver, Gold, Platinum
- Auto-awarded based on user stats (endorsements, testimonials, leaderboard rank, etc.)
- See `src/utils/achievementSystem.js` for full catalog and rules

---

## 🌐 Social Sharing

- Web Share API on mobile
- Platform shares: Twitter/X, LinkedIn, Facebook, Email, Telegram, WhatsApp
- Reusable `SocialShareButton` and helpers in `src/utils/socialSharingUtils.js`

---

## ♿ Accessibility

- Skip-to-content link
- Keyboard-only focus ring behavior
- Reduced motion support with `prefers-reduced-motion`
- Semantic elements and ARIA usage throughout

---

## 📚 Related Docs

- `COMMUNITY_FEATURES.md`: Leaderboard, badges, profile improvements, social sharing details
- `UI_IMPROVEMENTS.md`: Design system, responsiveness, animations, accessibility
- `SkillSwap_Roadmap.md`: Detailed multi-milestone product roadmap

---

## 🗺 Roadmap (Highlight)

- Request feed & filtering
- Offer flow & notifications
- Offer management & Karma system
- Real-time chat (implemented)
- Profiles with endorsements and badges (implemented)
- LLM assistance (implemented)
- Advanced search, dashboard, CI/CD, full accessibility sweep

---

## 🙌 Acknowledgements

- React + Vite
- Firebase (Auth, Firestore)
- Google AI (Gemini)
- Tailwind CSS, Framer Motion, Lucide Icons