# Developer Portfolio Studio

A modern, high-performance developer portfolio built with React, Vite, and custom CSS styling. Features full dynamic content management via an integrated Admin Studio.

## 👤 Profile Avatar & Image Setup

To set your profile picture (DP/Avatar):
1. Place your profile image inside the `src/assets/` directory (e.g., `src/assets/Avatar.png`).
2. Point `src/data/defaultPortfolioData.js` to your asset file:
   ```javascript
   import defaultAvatar from '../assets/Avatar.png';
   ```
3. You can also change your avatar image dynamically at runtime via the **Portfolio Admin Studio** UI.

## 🚀 Features

- **Dynamic Admin Studio**: Edit profile, achievements, projects, skills, and experience in real-time.
- **Optimized Local Storage**: Clean storage management and automatic image compression to keep data fast and lightweight.
- **Responsive & Modern Design**: Dark mode aesthetic with custom glassmorphism and animations.

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
