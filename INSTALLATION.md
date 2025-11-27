# Installation & Setup Guide

## ✅ Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Node.js 16+** installed ([Download](https://nodejs.org/))
- [ ] **npm** (comes with Node.js) or **yarn**
- [ ] **Backend API** running at `http://localhost:3000` (or configured URL)
- [ ] **Git** (optional, for version control)
- [ ] **Code editor** (VS Code recommended)

---

## 🚀 Quick Installation (5 minutes)

### Step 1: Verify Node.js Installation

Open a terminal and run:

```bash
node --version
# Should show v16.x.x or higher

npm --version
# Should show 8.x.x or higher
```

### Step 2: Install Dependencies

In the project directory:

```bash
npm install
```

This will install all required packages (~240 packages, takes 2-3 minutes).

### Step 3: Configure Environment

The `.env` file should already exist. Verify it contains:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Better Car Auction
VITE_APP_VERSION=1.0.0
```

**Important**: Change `VITE_API_BASE_URL` if your backend runs on a different URL.

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:

```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 5: Open in Browser

Navigate to `http://localhost:5173`

You should see the Better Car Auction home page! 🎉

---

## 🔍 Verify Installation

### Test 1: Home Page Loads
- ✅ You should see the hero section with "Welcome to Better Car Auction"
- ✅ Navigation menu at the top
- ✅ Footer at the bottom

### Test 2: Register a New User
1. Click "Register" in the header
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: Test1234
   - Confirm Password: Test1234
3. Click "Register"
4. ✅ Should redirect to dashboard/my-cars
5. ✅ Should see toast notification "Registration successful!"

### Test 3: Navigate Around
- ✅ Click "Auctions" - should show auctions list
- ✅ Click "Cars" - should show cars page
- ✅ Click "My Cars" - should show your cars (empty initially)
- ✅ Open profile menu (user icon) - should show dropdown

### Test 4: Create a Car
1. Go to "My Cars"
2. Click "Add New Car"
3. Fill in the form:
   - VIN: 1HGBH41JXMN109186
   - Year: 2020
   - Odometer: 50000
   - Exterior Color: Blue
   - Interior Color: Black
   - MSRP: 35000
4. Click "Create Car"
5. ✅ Should see success message
6. ✅ Should redirect to My Cars

---

## ❌ Troubleshooting

### Problem: "Failed to fetch" errors

**Solution**:
1. Verify backend is running: `http://localhost:3000`
2. Check `.env` has correct `VITE_API_BASE_URL`
3. Verify backend CORS is configured for `http://localhost:5173`

### Problem: "Port 5173 already in use"

**Solution**:
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.ts:
server: {
  port: 5174,
}
```

### Problem: "npm install" fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Problem: TypeScript errors in IDE

**Solution**:
1. Restart VS Code
2. Check TypeScript version: `npm list typescript`
3. Install VS Code extensions:
   - ESLint
   - TypeScript and JavaScript Language Features

### Problem: Blank page or "Cannot find module" errors

**Solution**:
```bash
# Rebuild the project
npm run build

# If still fails, check browser console for specific errors
```

---

## 🏗️ Build for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Opens the production build at `http://localhost:4173`

### Deploy to Server

The `dist/` folder contains static files that can be deployed to:
- **Netlify**: Drag & drop the `dist` folder
- **Vercel**: Connect GitHub repo, set build command: `npm run build`
- **AWS S3**: Upload `dist` folder contents
- **Any static host**: Upload `dist` folder

**Important**: Configure environment variables on your hosting platform!

---

## 🔧 Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Browser DevTools

Install these browser extensions:
- **React Developer Tools** - Inspect React components
- **Redux DevTools** - Debug state (if using Redux)

---

## 📊 Project Status Check

Run this to verify everything is working:

```bash
# Check TypeScript compilation
npm run build

# Should output:
# ✓ built in ~7s
# No errors
```

If build succeeds, your installation is complete! ✅

---

## 🎯 Next Steps

1. **Read the documentation**:
   - `README.md` - Full project documentation
   - `QUICKSTART.md` - Quick start guide
   - `PROJECT_SUMMARY.md` - What's been built
   - `DEVELOPMENT_ROADMAP.md` - How to expand features

2. **Explore the code**:
   - Start with `src/App.tsx` - Main routing
   - Look at `src/pages/` - All pages
   - Check `src/components/common/` - Reusable components

3. **Make changes**:
   - Edit any file
   - Save
   - See changes instantly in browser (Hot Module Replacement)

4. **Add features**:
   - Follow `DEVELOPMENT_ROADMAP.md` for guidance
   - Start with Priority 1 features

---

## 📞 Need Help?

### Resources
- **Technical Spec**: `FRONTEND_TZ.md` - Original requirements
- **GitHub Issues**: Report bugs and ask questions
- **Backend API Docs**: Check backend repository

### Common Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality

# Troubleshooting
npm cache clean --force     # Clear npm cache
rm -rf node_modules         # Remove dependencies
npm install                 # Reinstall dependencies
```

---

## ✅ Installation Complete!

If you've made it here and all tests pass, congratulations! 🎉

Your Better Car Auction frontend is ready for development.

**Happy Coding!** 🚀

---

**Last Updated**: November 17, 2025
**Version**: 1.0.0

