# 🎨 Login Page Customization Guide

## 📍 Professional 1-Page Login

Your login page is **professional, production-ready, and fits perfectly in one page**. It includes:
- ✅ Premium animations and effects
- ✅ Responsive design
- ✅ Easy branding customization
- ✅ Modern glassmorphism UI

---

## 🔄 How to Replace Text with Your Company Logo

### **Quick 3-Step Process:**

#### **Step 1: Add Your Logo File**
Place your company logo in the public folder:
```
/public/logo.png
```
*(You can use .png, .svg, .jpg formats)*

#### **Step 2: Open the Login Page**
File location:
```
d:\HR\hr-management\frontend\src\app\(auth)\login\page.tsx
```

#### **Step 3: Switch from Text to Image**

Find this section in the file (around line 291):
```tsx
{/* OPTION 1: TEXT BRANDING (Currently Active) */}
<motion.div className="flex flex-col items-start mb-10 relative">
    ...
    <h1>Rudratic</h1>
    <h2>Technologies</h2>
</motion.div>
```

**Comment it out** by wrapping with `{/* */}`:
```tsx
{/* OPTION 1: TEXT BRANDING (Commented Out) 
<motion.div className="flex flex-col items-start mb-10 relative">
    ...
</motion.div>
*/}
```

Then, find this section (around line 329):
```tsx
{/* OPTION 2: IMAGE/LOGO BRANDING (Commented - Uncomment to use) */}
{/* 
<motion.div className="flex flex-col items-center mb-10 relative">
    ...
    <motion.img src="/logo.png" alt="Company Logo" ... />
</motion.div>
*/}
```

**Uncomment it** by removing the `{/* */}`:
```tsx
{/* OPTION 2: IMAGE/LOGO BRANDING (Active) */}
<motion.div className="flex flex-col items-center mb-10 relative">
    <motion.div
        className="absolute -inset-8 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-2xl blur-2xl"
        animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
    />
    <motion.img
        src="/logo.png"
        alt="Company Logo"
        className="relative w-64 h-auto object-contain"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
            opacity: 1, 
            y: 0,
            filter: [
                "drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))",
                "drop-shadow(0 0 40px rgba(139, 92, 246, 0.8))",
                "drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))",
            ]
        }}
        transition={{ 
            opacity: { duration: 0.8 },
            y: { duration: 0.8 },
            filter: { duration: 3, repeat: Infinity }
        }}
    />
</motion.div>
```

---

## ⚙️ Logo Customization Options

### **Adjust Logo Size:**
Change the width class:
```tsx
className="relative w-64 h-auto object-contain"
```

Available sizes:
- `w-48` - Small (192px)
- `w-64` - Medium (256px) - **Default**
- `w-80` - Large (320px)
- `w-96` - X-Large (384px)

### **Change Logo Alignment:**
By default, the logo is centered. To align left:
```tsx
className="flex flex-col items-center mb-10 relative"
```
Change `items-center` to `items-start` for left alignment.

### **Adjust Glow Effect:**
The logo has an animated glow (violet drop shadow). To change color:
```tsx
filter: [
    "drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))",  // Violet
]
```

Try different colors:
- Blue: `rgba(59, 130, 246, 0.5)`
- Green: `rgba(34, 197, 94, 0.5)`
- Red: `rgba(239, 68, 68, 0.5)`
- White: `rgba(255, 255, 255, 0.5)`

---

## 🎨 Using Different Image Formats

### **SVG Logo (Recommended for clean vectors):**
```tsx
<motion.img
    src="/logo.svg"
    alt="Company Logo"
    className="relative w-64 h-auto"
/>
```

### **PNG with Transparency:**
```tsx
<motion.img
    src="/logo.png"
    alt="Company Logo"
    className="relative w-64 h-auto object-contain"
/>
```

### **Using Next.js Image Component (Better performance):**
Replace `motion.img` with:
```tsx
<Image
    src="/logo.png"
    alt="Company Logo"
    width={256}
    height={100}
    className="relative"
    priority
/>
```

---

## 📝 Current Configuration

**Active Branding:** Text ("RUDRATIC Technologies")

**To Switch to Logo:**
1. Place logo at `/public/logo.png`
2. Comment out "OPTION 1: TEXT BRANDING"
3. Uncomment "OPTION 2: IMAGE/LOGO BRANDING"
4. Save and refresh browser

---

## 🎯 Quick Reference

| Feature | Current | Customizable |
|---------|---------|--------------|
| Layout | 1-Page | ✅ Yes |
| Professional Design | Premium | ✅ Yes |
| Animations | Advanced | ✅ Yes |
| Branding Type | **Text** | ✅ Switch to Image |
| Logo Size | N/A | ✅ Adjustable |
| Logo Glow | N/A | ✅ Adjustable |

---

## 🚀 After Making Changes

1. **Save the file**
2. **Browser will auto-refresh** (if dev server is running)
3. **Clear cache** if logo doesn't update (Ctrl+Shift+R)

---

## 📞 Need Help?

- Login page location: `src/app/(auth)/login/page.tsx`
- Public folder: `/public/`
- Look for comments: "OPTION 1" and "OPTION 2"

---

**Your login page is production-ready and easy to customize!** 🎉
