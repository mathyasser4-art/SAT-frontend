# 🚀 Quick Start Guide - Abacus Heroes

## For Future Development Sessions

### ⚡ Fastest Way to Start

**Option 1: Using the Start Script (Recommended)**
```powershell
.\start-dev.ps1
```

**Option 2: Manual Start**
```bash
npm start
```

That's it! The app will automatically open at http://localhost:3000

---

## 🔍 What Each Method Does

### The Start Script (`start-dev.ps1`)
✅ Creates `.env` file if missing  
✅ Installs dependencies if needed  
✅ Cleans up conflicting processes  
✅ Starts the development server  

### Manual Method
Assumes you've already:
- Created `.env` file
- Installed dependencies with `npm install`

---

## 📝 First Time Setup (Already Done!)

The following has been completed for you:
- ✅ `.env` file created from `.env.example`
- ✅ Dependencies installed
- ✅ Development server configured

---

## 🛠️ Common Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm test` | Run tests |
| `npm run build` | Build for production |
| `npm run winBuild` | Build without source maps |

---

## 🔧 Troubleshooting

### Issue: Port Already in Use
**Solution:**
```powershell
Get-Process node | Stop-Process -Force
npm start
```

### Issue: Missing Dependencies
**Solution:**
```bash
npm install
```

### Issue: Environment Variables Not Working
**Solution:**
- Verify `.env` file exists in root directory
- Check that it contains `REACT_APP_API_URL` and `REACT_APP_GOOGLE_CLIENT_ID`
- Restart the dev server after changes

---

## 📱 Access Points

- **Frontend:** http://localhost:3000
- **API (Production):** https://abacus-2ntk.onrender.com
- **API (Local):** http://localhost:3000 (if running backend locally)

---

## 🎯 Next Steps

1. Open http://localhost:3000 in your browser
2. The app should load with Google OAuth login
3. Start developing! Changes will hot-reload automatically

---

## 💡 Pro Tips

- Keep the PowerShell window open while developing (server runs here)
- Press `Ctrl+C` in the terminal to stop the server
- Use `.\start-dev.ps1` every time you want to start fresh
- Check the browser console for any runtime errors

---

**Happy Coding! 🎉**