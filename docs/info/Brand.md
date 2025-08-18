
# Brand system (from the provided logo)

## Core palette (exact from logo)

* **Teal (primary)**: `#04828F`
* **Navy (secondary)**: `#162952`
* **White**: `#FFFFFF`
* **Black (mono lockups)**: `#000000`

### Accessibility notes

* Teal on white has \~**4.57:1** contrast → OK for **large** text (≥18 pt / 24px or 14 pt bold) but **not** for small body text. Prefer Navy for body text, or use white text on Navy/Teal blocks.
* Navy on white is \~**14.25:1** → safe for all text sizes.

### Helpful tints/shades (for hovers, backgrounds)

Use these as a practical scale around the two brand colors (you don’t need every step; pick a couple per component):

**Teal scale**

* 50 `#E6F6F8`
* 100 `#CDECEF`
* 200 `#9FD8DD`
* 300 `#71C4CB`
* 400 `#3EAEB9`
* 500 `#1C9FAA`
* 600 `#04828F`  ← brand
* 700 `#036A75`
* 800 `#03565F`
* 900 `#023E45`

**Navy scale**

* 50 `#EEF2F8`
* 100 `#D9E1EE`
* 200 `#B3C1DD`
* 300 `#8DA2CC`
* 400 `#566D9F`
* 500 `#2F487A`
* 600 `#1E386A`
* 700 `#162952`  ← brand
* 800 `#112040`
* 900 `#0B162D`

(Scales are tuned around the sampled brand hexes so hover/active states feel native.)

---

## Typography

* **Arabic UI/Headings**: `Tajawal`, `Cairo`, `Noto Kufi Arabic`, system fallback: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"`
* **Latin UI/Body**: `Inter`, `Nunito Sans`, or system sans (same fallback as above)

**Sizing (clamp for responsive rhythm)**

* Display: `clamp(2rem, 1.2rem + 2.2vw, 3rem)`
* H1: `clamp(1.75rem, 1.05rem + 1.9vw, 2.5rem)`
* H2: `clamp(1.5rem, 0.95rem + 1.6vw, 2rem)`
* Body: `1rem` (16px) line-height `1.7`
* Small: `0.875rem` (14px)

**Weights**

* Headings: 700
* Body: 400–500
* Emphasis (Arabic & English): use weight before color.

**RTL**

* All public pages should support RTL. Use an `dir="rtl"` attribute on `<html>` for Arabic, and `dir="ltr"` for English.

---

## Spacing, radius & elevation

* Spacing scale: Tailwind default; prefer **4px** multiples (1 = 0.25rem).
* Radii: `sm: 6px`, `md: 10px`, `lg: 14px`, `xl: 20px`, `2xl: 28px`.
* Shadows (soft, educational feel):

  * `sm`: `0 1px 2px rgb(0 0 0 / 0.06)`
  * `md`: `0 4px 12px rgb(0 0 0 / 0.08)`
  * `lg`: `0 10px 24px rgb(0 0 0 / 0.10)`

---

## Logo usage

* **Clearspace**: keep free space around the mark equal to **0.5× the logo height** on all sides (minimum).
* **Minimum digital size**:

  * Horizontal lockup: **32px** tall
  * Stacked lockup: **64px** tall
* **Color usage**:

  * Full-color (Teal+Navy) only on **white** or very light neutral backgrounds.
  * On photos or colored backgrounds: use **white** (reversed) or **black** mono versions only.
* **Don’ts**: no squashing/stretching, no recoloring, no drop shadows/glows on the logo, no placing on busy/high-contrast areas.

---

## Tailwind setup

### 1) Install (with RTL support)

```bash
npm i -D tailwindcss @tailwindcss/typography @tailwindcss/forms tailwindcss-rtl
```

### 2) `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: ["class"], // optional if you’ll support dark
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1440px" }
    },
    extend: {
      colors: {
        // Brand tokens
        primary: {
          50: "#E6F6F8",
          100: "#CDECEF",
          200: "#9FD8DD",
          300: "#71C4CB",
          400: "#3EAEB9",
          500: "#1C9FAA",
          600: "#04828F", // base
          700: "#036A75",
          800: "#03565F",
          900: "#023E45"
        },
        secondary: {
          50: "#EEF2F8",
          100: "#D9E1EE",
          200: "#B3C1DD",
          300: "#8DA2CC",
          400: "#566D9F",
          500: "#2F487A",
          600: "#1E386A",
          700: "#162952", // base
          800: "#112040",
          900: "#0B162D"
        },
        // Semantic aliases (use these in components)
        brand: {
          DEFAULT: "#04828F",
          navy: "#162952",
          bg: "#FFFFFF",
          ink: "#162952"
        }
      },
      fontFamily: {
        arabic: ['Tajawal', 'Cairo', 'Noto Kufi Arabic', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', '"Helvetica Neue"', 'Arial', '"Noto Sans"'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', '"Helvetica Neue"', 'Arial', '"Noto Sans"']
      },
      borderRadius: { sm: "6px", md: "10px", lg: "14px", xl: "20px", "2xl": "28px" },
      boxShadow: {
        sm: "0 1px 2px rgb(0 0 0 / 0.06)",
        md: "0 4px 12px rgb(0 0 0 / 0.08)",
        lg: "0 10px 24px rgb(0 0 0 / 0.10)"
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.secondary.700"),
            a: { color: theme("colors.primary.600"), "&:hover": { color: theme("colors.primary.700") } },
            h1: { color: theme("colors.secondary.700"), fontWeight: "700" },
            h2: { color: theme("colors.secondary.700"), fontWeight: "700" }
          }
        }
      })
    }
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-rtl")
  ]
}
```

### 3) Global CSS (base + logical spacing for RTL)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Direction helpers */
:root { --page-bg: #FFFFFF; --ink: #162952; }
html { background: var(--page-bg); color: var(--ink); }

/* Arabic pages toggle RTL */
html[lang="ar"] { direction: rtl; }
```

---

## Component recipes (class blueprints)

### Buttons

* **Primary (Teal)**
  `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md`
* **Secondary (Navy outline)**
  `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-secondary-700 border border-secondary-200 hover:border-secondary-400 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-200`
* **Danger/Destructive** (if needed) — borrow from Tailwind `rose-600` but keep usage minimal.

### Links

`text-primary-600 hover:text-primary-700 underline underline-offset-2`

### Cards / Panels

`rounded-xl bg-white shadow-md p-6 border border-secondary-50`

### Inputs

`block w-full rounded-lg border-secondary-200 focus:border-primary-600 focus:ring-primary-300`

### Badges

* Info: `inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary-50 text-primary-700`
* Neutral: `bg-secondary-50 text-secondary-700`

### Navigation bar

* Height: 72px
* Styles: `bg-white/90 backdrop-blur border-b border-secondary-50 text-secondary-700`

### Tables (readable density)

* Header: `text-secondary-700 font-semibold bg-secondary-50`
* Row hover: `hover:bg-secondary-50`

### Hero band

* Title in Navy, support line in Teal:

  * Title: `text-4xl md:text-5xl font-bold text-secondary-700`
  * Subtitle: `text-lg md:text-xl text-primary-700`

---

## Layout & grids

* Max readable width for content: **72ch** (≈ `prose` width).
* Grid gutters: `gap-6` on mobile, `gap-8` desktop.
* Section vertical rhythm: `py-12` mobile / `py-16` desktop.
* Use `container` + `mx-auto` for page bounds.

---

## Imagery & iconography

* Use **white** or **very light** backgrounds behind the full-color logo.
* On photos, prefer the **white mono** logo in a corner with `opacity-100`; ensure contrast by placing over a soft dark scrim `bg-black/20`.
* Keep illustrations flat or two-tone (Teal+Navy) with white negative space.

---

## Content & language

* Default to **Arabic (RTL)** on Arabic pages; English pages **LTR**.
* Numbers in data/figures may remain LTR in Arabic UI for legibility.
* Avoid coloring long bodies of text in Teal (contrast); use Navy for paragraphs.

---

## Example semantic usage (HTML)

```html
<header class="border-b border-secondary-50 bg-white">
  <div class="container h-[72px] flex items-center justify-between">
    <img src="/path/logo-horizontal-color.svg" alt="National Institute" class="h-8">
    <nav class="hidden md:flex gap-6 text-secondary-700">
      <a class="hover:text-primary-700" href="#">الرئيسية</a>
      <a class="hover:text-primary-700" href="#">البرامج</a>
      <a class="hover:text-primary-700" href="#">حول</a>
    </nav>
    <a class="btn-primary inline-flex items-center rounded-lg px-4 py-2 bg-primary-600 text-white hover:bg-primary-700" href="#">سجّل الآن</a>
  </div>
</header>
```

---

## Files & assets

* Use the **horizontal color** lockup for navigation bars and headers; the **stacked** version for square placements/cards.
* Keep SVG originals for crisp scaling; provide PNG fallbacks.

---
