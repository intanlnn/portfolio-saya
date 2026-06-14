# Identity Orbit Portfolio

Futuristik portfolio personal dengan konsep "Identity Orbit" — ruang digital sinematik yang menggambarkan identitasmu sebagai penjelajah galaksi ide, teknologi, dan kreativitas.

## ✨ Features

- **Physics Lanyard** — ID Card dengan physics animation, bisa ditarik, berayun secara realistis
- **Particle Background** — Ruang gelap sinematik dengan bintang-bintang hidup dan nebula
- **Orbit Navigation** — Menu melingkar seperti satelit mengelilingi planet
- **Light Rail Timeline** — About section dengan jalur kereta cahaya interaktif
- **Project Museum** — Project cards dengan hover 3D dan glow effect
- **DNA Helix Skills** — Animasi helix 3D yang berputar
- **Hologram Contact** — Control room futuristik dengan scan line effect
- **Cinematic Reveal** — Transisi sinematik ketika ID Card diklik
- **Custom Cursor** — Cursor dengan lerp animation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Buka http://localhost:5173

### Build untuk production
```bash
npm run build
npm run preview
```

## 📁 Structure

```
src/
  components/
    Cursor.jsx          — Custom cursor dengan lerp
    ParticleBackground.jsx — Canvas starfield + nebula
    Lanyard.jsx         — Physics ID Card (MAIN FEATURE)
    HeroSection.jsx     — Hero dengan floating items
    OrbitNav.jsx        — Orbit navigation menu
    AboutSection.jsx    — Light rail timeline
    ProjectsSection.jsx — Project museum cards
    SkillsSection.jsx   — DNA Helix animation
    ExperienceSection.jsx — Tabbed experience
    ContactSection.jsx  — Hologram control room
    CinematicReveal.jsx — Cinematic transition
  App.jsx               — Main app
  main.jsx              — Entry point
```

## 🎨 Kustomisasi

### Ganti nama & info
Edit `Lanyard.jsx` — cari bagian `YOUR NAME` dan `CREATIVE DEVELOPER`

### Ganti projects
Edit array `PROJECTS` di `ProjectsSection.jsx`

### Ganti skills
Edit array `SKILLS` di `SkillsSection.jsx`

### Ganti experience
Edit array `EXPERIENCES` di `ExperienceSection.jsx`

### Ganti contact links
Edit array `CONTACTS` di `ContactSection.jsx`

### Tambah foto profil ke ID Card
Di `Lanyard.jsx`, bagian `drawCard()`, ganti bagian Avatar circle dengan:
```js
const img = new Image()
img.src = '/your-photo.jpg'
ctx.drawImage(img, -28, -ch/2+32, 56, 56)
```

## 🛠 Tech Stack

- React 18
- Vite
- Canvas 2D API (physics, particles, helix)
- CSS Animations
- Google Fonts (Syne + Space Mono)

> **Note:** Versi ini menggunakan Canvas 2D pure (tanpa Three.js/R3F) untuk
> maximum compatibility dan 60fps performance tanpa dependency hell.
> Untuk upgrade ke Three.js WebGL, bisa ditambahkan secara modular.

## 📦 Deploy ke Vercel / Netlify

```bash
npm run build
# Upload folder dist/ ke Vercel/Netlify
```

Atau drag & drop folder `dist/` ke Netlify Drop.

---

Built with ❤️ · Identity Orbit Portfolio
