# Milidia - Advanced Security Tools

A modern, client-side password generator, hash generator, and encoding tool built with React 19, TypeScript, Vite, and Tailwind CSS.

## Features

- **Password Generator** - Generate secure passwords with custom character sets, entropy calculation, and crack time estimation
- **Hash Generator** - Bcrypt, SHA-256, and Argon2id hashing (client-side)
- **Encode/Decode** - Base64, Hexadecimal, and URL encoding/decoding
- **UUID Generator** - Generate UUID v4 (random) and v7 (time-ordered)
- **History** - All outputs saved to localStorage with copy-to-clipboard

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 3
- bcryptjs (for client-side Bcrypt)
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+ (check with `node --version`)
- npm or yarn

### Installation

```bash
# 1. Extract the project files
cd milidia-react

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder. Deploy these to any static hosting (Netlify, Vercel, GitHub Pages, etc.).

## Project Structure

```
src/
├── App.tsx                          # Main layout with sidebar + tool router
├── main.tsx                         # Entry point
├── index.css                        # Tailwind + custom styles
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx              # Left panel (history, templates, saved configs)
│   │   ├── ToolTabs.tsx             # Top navigation tabs
│   │   └── OutputPanel.tsx          # Bottom output area
│   │
│   ├── shared/
│   │   ├── CopyButton.tsx           # Copy to clipboard with feedback
│   │   ├── EntropyDisplay.tsx       # Entropy + crack time + strength bar
│   │   ├── StrengthMeter.tsx        # Visual strength indicator
│   │   ├── LengthSlider.tsx         # Reusable length control with +/- buttons
│   │   └── CheckboxGroup.tsx        # Styled checkbox grid
│   │
│   └── tools/
│       ├── PasswordGenerator/       # Password generation with entropy
│       ├── HashTool/                # Bcrypt, SHA-256, Argon2id
│       ├── EncodeDecodeTool/        # Base64, Hex, URL encode/decode
│       └── UUIDTool/                # UUID v4 and v7 generation
│
├── hooks/
│   ├── usePasswordGenerator.ts      # Core password generation logic
│   ├── useBcrypt.ts                 # Bcrypt hashing hook
│   ├── useBase64.ts                 # Base64 encode/decode hook
│   ├── useEntropy.ts                # Entropy and crack time calculation
│   └── useHistory.ts                # Output history with localStorage
│
├── lib/
│   ├── crypto.ts                    # Pure crypto functions
│   ├── wordlists.ts                 # Word lists for passphrases
│   └── utils.ts                     # Helper utilities
│
└── types/
    └── index.ts                     # TypeScript interfaces
```

## Adding New Tools

To add a new tool (e.g., "JWT Decoder"):

1. Create `src/components/tools/JWTTool/index.tsx`
2. Add it to the `TOOLS` array in `App.tsx`
3. Done. No existing code needs modification.

## Security Notes

- **All hashing and generation happens in your browser.** No data is sent to any server.
- Bcrypt and Argon2id in the browser are for **testing and demonstration only**. 
- For production systems, always hash passwords server-side with a proper backend.
- SHA-256 is **not suitable for password storage** — it's designed for data integrity.

## License

 GPL-3.0 license
