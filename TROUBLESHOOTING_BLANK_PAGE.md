# Student Journey Page - Troubleshooting Guide

## ✅ IF YOU SEE A BLANK WHITE PAGE

### **Solution 1: Hard Refresh (99% fixes it)**
1. Open Developer Tools: `F12` or `Cmd+Option+I`
2. Right-click the refresh button in the browser
3. Select "Empty cache and hard refresh"
4. Navigate to `http://localhost:5175/how-it-works`

### **Solution 2: Clear Browser Cache**
- **Chrome/Edge**: `Cmd+Shift+Delete` → Clear cache → Refresh
- **Safari**: Develop → Empty Caches → Refresh
- **Firefox**: `Ctrl+Shift+Delete` → Clear Recent History → Refresh

### **Solution 3: Restart Dev Server**
```bash
# Kill current dev server
pkill -f "vite"

# Restart
cd /Users/rahul/Downloads/Frontend
npm run dev
```

### **Solution 4: Check Console for Errors**
1. Open DevTools: `F12`
2. Go to **Console** tab
3. Look for red error messages
4. If you see errors, screenshot them and send to dev team

### **Solution 5: Verify Route is Live**
1. Open DevTools: `F12`
2. Go to **Network** tab
3. Navigate to `/how-it-works`
4. Check if request completes (200 status)
5. Click on the request → **Preview** tab
6. Should show page HTML, not error

---

## 🔍 EXPECTED BEHAVIOR

### **Desktop (1024px+)**
You should see:
- ✅ Hero section with blue/teal gradient headline
- ✅ "Schedule a College Demo" button with gradient
- ✅ Trust markers below CTA
- ✅ 7-stage timeline with connecting line (animates on scroll)
- ✅ Stage cards in 2-column grid (left/right alternating)
- ✅ Pedagogical note explaining stage sequence
- ✅ 3 support system cards (purple, green, blue)
- ✅ 3 benefits cards with icons
- ✅ College success story with metrics
- ✅ Final CTA section with contact methods

### **Mobile (< 640px)**
You should see:
- ✅ Same sections as desktop
- ✅ Single column layout
- ✅ No SVG timeline line (mobile optimization)
- ✅ Simplified animations
- ✅ Touch-friendly button sizes
- ✅ Readable text without horizontal scroll

---

## 🛠️ IF PAGE STILL BLANK

### **Check 1: Component Import Issue**
```bash
# Verify all files exist
ls -la src/components/StudentJourney/
ls -la src/components/StudentJourneyPage.jsx
ls -la src/constants/studentJourneyStages.js
ls -la src/theme/student-journey-page.css
```

Expected output: All 8 files should exist ✅

### **Check 2: Build for Errors**
```bash
cd /Users/rahul/Downloads/Frontend
npm run build 2>&1 | grep -i error
```

Expected: No error output (just build summary)

### **Check 3: Lint Check**
```bash
npx eslint src/components/StudentJourney/ src/components/StudentJourneyPage.jsx
```

Expected: No errors (might have warnings, that's OK)

### **Check 4: App.jsx Route**
```bash
grep -A2 'path="/how-it-works"' src/App.jsx
```

Expected output:
```
<Route path="/how-it-works" element={<StudentJourneyPage />} />
```

### **Check 5: Browser Network Issues**
1. Open DevTools → Network tab
2. Filter by "fetch" and "xhr"
3. Check if any requests show red (failed)
4. If yes, those assets might be missing

---

## 💡 ADVANCED TROUBLESHOOTING

### **If You See "Module not found" Error:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **If Animations Don't Work:**
1. Check if Framer Motion imported: `import { motion } from 'framer-motion'`
2. Verify browser supports CSS transforms
3. Try on Chrome to isolate browser-specific issues

### **If Styling is Broken:**
1. Check if Tailwind CSS is working (other pages should have color)
2. Verify design tokens CSS is imported in `src/styles/design-tokens.css`
3. Check browser console for CSS parse errors

### **If SVG Line Doesn't Animate:**
1. Desktop view only (hidden on mobile)
2. Only animates on scroll (check if you've scrolled down)
3. Try hard refresh if SVG still doesn't show

---

## 📞 FINAL CHECKLIST BEFORE REPORTING ISSUE

- [ ] Tried hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- [ ] Cleared browser cache
- [ ] Dev server running on correct port (5173-5175)
- [ ] Using Chrome/Edge/Firefox (not IE 11)
- [ ] Checked browser console for errors
- [ ] Network tab shows 200 status for /how-it-works
- [ ] All component files exist in correct directories
- [ ] Build passes without errors

---

## 🚀 IF EVERYTHING WORKS

You should see:
1. **Smooth scroll animations** - Cards fade in as you scroll
2. **Hover effects** - Cards lift up, icons rotate
3. **Timeline line** - SVG line draws from top to bottom
4. **Responsive layout** - Resize browser, layout adjusts
5. **Fast load** - Page loads in < 2 seconds
6. **No console errors** - DevTools console is clean

---

## 📧 REPORT ISSUE WITH

If you still see blank page after all checks, send:
1. Screenshot of blank page
2. Browser version (Chrome 120.0 etc.)
3. Screenshot of DevTools Console tab (F12 → Console)
4. Screenshot of Network tab showing /how-it-works request
5. Output of: `npm run build 2>&1 | tail -20`

---

**That's it! The page should be live and beautiful.** 🎉

Happy scrolling! ✨
