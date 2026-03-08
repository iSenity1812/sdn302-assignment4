## Design System: SaaS Quiz

### Pattern
- **Name:** Minimal & Direct + Demo
- **CTA Placement:** Above fold
- **Sections:** Hero > Features > CTA

### Style
- **Name:** Flat Design
- **Keywords:** 2D, minimalist, bold colors, no shadows, clean lines, simple shapes, typography-focused, modern, icon-heavy
- **Best For:** Web apps, mobile apps, cross-platform, startup MVPs, user-friendly, SaaS, dashboards, corporate
- **Performance:** ⚡ Excellent | **Accessibility:** ✓ WCAG AAA

### Colors
| Role | Hex |
|------|-----|
| Primary | #6366F1 |
| Secondary | #818CF8 |
| CTA | #10B981 |
| Background | #F5F3FF |
| Text | #1E1B4B |

*Notes: Indigo primary + emerald CTA*

### Typography
- **Heading:** Baloo 2
- **Body:** Comic Neue
- **Mood:** kids, education, playful, friendly, colorful, learning
- **Best For:** Children's apps, educational games, kid-friendly content
- **Google Fonts:** https://fonts.google.com/share?selection.family=Baloo+2:wght@400;500;600;700|Comic+Neue:wght@300;400;700
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Comic+Neue:wght@300;400;700&display=swap');
```

### Key Effects
No gradients/shadows, simple hover (color/opacity shift), fast loading, clean transitions (150-200ms ease), minimal icons

### Avoid (Anti-patterns)
- Complex onboarding flow
- Cluttered layout

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px

