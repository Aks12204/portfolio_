# Free Portfolio Deployment Guide

This document outlines **100% free** ways to deploy your portfolio website live to the internet with custom domain support and automated SSL certificates.

---

## Option 1: Vercel (Recommended - Easiest & Fastest)

Vercel is the creator of Next.js and provides instant, free hosting for Vite/React applications.

### Method A: Connect with GitHub (Automatic Continuous Deployment)
1. Initialize git in your project directory (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   ```
2. Push your project to a new repository on [GitHub](https://github.com/new).
3. Go to [Vercel.com](https://vercel.com) and log in with your GitHub account.
4. Click **"Add New"** -> **"Project"**.
5. Select your GitHub portfolio repository and click **"Import"**.
6. Vercel automatically detects **Vite** settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Click **"Deploy"**.
8. Done! Your portfolio is now live at `https://your-project-name.vercel.app`.

---

## Option 2: Netlify (Drag-and-Drop or GitHub)

### Drag and Drop (No Git required!):
1. Open terminal in your portfolio directory and build the static files:
   ```bash
   npm run build
   ```
   *This creates a `dist` folder in your project directory.*
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag and drop the `dist` folder into the browser window.
4. Netlify will publish your site in 5 seconds with a live link!

### Connect with GitHub:
1. Log in to [Netlify](https://netlify.com).
2. Click **"Add new site"** -> **"Import an existing project"**.
3. Select **GitHub** and choose your repository.
4. Set Build command: `npm run build`, Publish directory: `dist`.
5. Click **"Deploy site"**.

---

## Option 3: GitHub Pages (Free GitHub Hosting)

1. Ensure your code is pushed to GitHub.
2. In `package.json`, add `"homepage": "https://<your-username>.github.io/<repo-name>"`
3. Install `gh-pages` helper package:
   ```bash
   npm install --save-dev gh-pages
   ```
4. Add these scripts into `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
5. Run deployment command:
   ```bash
   npm run deploy
   ```
6. Go to your GitHub repository -> **Settings** -> **Pages** -> Select branch `gh-pages`.

---

## Managing Your Portfolio Content

### How Edits Work
1. **Live Browser Edits**: Click **"Manage"** in the top navbar to open the Admin Studio.
2. Any changes you make (updating bio, adding achievements/posts, projects, image URLs, or skills) will save instantly to your browser's local memory (`localStorage`).
3. **Permanent Repository Backup**: Inside Admin Studio under **"Export & Backup"**, click **"Export JSON Config File"**. You can replace `src/data/defaultPortfolioData.js` with this exported data anytime to make your updates permanent across all visitors!
