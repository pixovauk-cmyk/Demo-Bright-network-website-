# BrightPeak — Design System & Creative Direction

## Design Philosophy
**"Ambitious clarity"** — premium, modern, trustworthy. Feels like a Y Combinator-backed edtech startup, not a government training provider. Dark-mode first, light and confident.

Inspiration: Linear.app's precision, Stripe's trust signals, Coursera's learner focus — combined into one bold B2B+B2C experience.

---

## Color Palette

### Primary
| Name | Hex | Use |
|------|-----|-----|
| Midnight | `#0A0F1E` | Primary background, hero |
| Deep Navy | `#0F172A` | Section backgrounds |
| Navy Surface | `#1E293B` | Cards, panels |
| Navy Border | `#334155` | Borders, dividers |

### Accent
| Name | Hex | Use |
|------|-----|-----|
| Peak Purple | `#7C3AED` | Primary CTA, links, highlights |
| Peak Purple Light | `#A78BFA` | Hover states, subtle accents |
| Peak Gradient | `from #6366F1 to #7C3AED` | Hero gradients, badges |

### Energy
| Name | Hex | Use |
|------|-----|-----|
| Amber | `#F59E0B` | Badges, "funded" callouts, stars |
| Cyan | `#06B6D4` | Tech courses, progress indicators |
| Emerald | `#10B981` | Success states, "completed" |

### Text
| Name | Hex | Use |
|------|-----|-----|
| White | `#FFFFFF` | Primary headings on dark |
| Muted | `#94A3B8` | Body text, captions |
| Subtle | `#64748B` | Placeholders, disabled |

---

## Typography

### Font Stack
- **Headings:** `Inter` (700, 800) — clean, modern, authoritative
- **Body:** `Inter` (400, 500) — consistent system
- **Mono/Code:** `JetBrains Mono` — for module counts, stats

### Scale
| Element | Size | Weight |
|---------|------|--------|
| Hero H1 | 64–80px | 800 |
| Section H2 | 40–48px | 700 |
| Card H3 | 24px | 600 |
| Body | 16–18px | 400 |
| Caption | 14px | 500 |
| Label/Badge | 12px | 600, uppercase |

---

## UI Components

### Cards
- Dark glass morphism: `bg-navy-surface/80 backdrop-blur-xl border border-navy-border`
- Hover: subtle purple glow `shadow-purple-500/20`
- Corner radius: `rounded-2xl`

### Buttons
- **Primary:** Purple gradient + white text, hover lift effect
- **Secondary:** Ghost with purple border
- **Ghost:** Text only with arrow →
- All buttons: `rounded-xl`, medium font weight

### Badges
- Level badges: amber background, dark text
- Funded badge: emerald, "100% Funded"
- Sector tags: navy border, muted text

### Progress
- Purple fill on navy track
- Animated on scroll-into-view

---

## Page Layouts

### Home Page Sections
1. **Hero** — Full-viewport dark gradient, bold headline, dual CTA, floating stat cards
2. **Social Proof Bar** — Logos of employer partners + Ofsted badge
3. **Problem/Solution** — Two-column: "The old way vs BrightPeak way"
4. **Course Showcase** — Filterable grid by sector/level
5. **How It Works** — 4-step timeline (employer + learner tabs)
6. **Results** — Animated stat counters (30yrs, 85%, 30% attrition drop)
7. **Testimonials** — Quote carousel with employer branding
8. **Final CTA** — Full-width purple gradient, "Book a Free Call"
9. **Footer** — Dark, clean, 4-column

### Courses Page
- Filter bar: Level, Sector, Duration
- Card grid (3 cols desktop, 2 tablet, 1 mobile)
- Each card: image, level badge, title, duration, sector tag, CTA

### Course Preview Page
- Hero with course title, level, duration, sector
- "What you'll learn" — icon list
- Module accordion/sidebar
- Employer benefits section
- Tutor profile (placeholder)
- Sticky CTA sidebar: "Start This Programme" + "Book a Call"

### Module Page
- Sidebar: module list with progress indicators
- Main: Video embed placeholder (iframe-ready for YouTube/Vimeo)
- Below video: module description, key takeaways, resources
- Navigation: prev/next module
- Completion tracker

---

## Motion & Animation

- **Hero entrance:** stagger fade-up (headings, then subtext, then CTAs, then stat cards)
- **Section reveals:** `IntersectionObserver` fade-up on scroll
- **Stat counters:** count-up animation on first viewport entry
- **Course cards:** hover lift + purple glow
- **Page transitions:** smooth fade (Next.js App Router)
- **Progress bars:** animate fill on mount

---

## Imagery Strategy

Since we can't scrape live images:
- **Unsplash free images** — search terms: "professional training", "office learning", "team meeting", "laptop study", "career development"
- Use `next/image` with blur placeholder
- Overlay dark gradient on all hero images for text readability
- Abstract geometric shapes as section backgrounds (SVG, pure CSS)

---

## Responsive Breakpoints
- Mobile: 375px+ (single column)
- Tablet: 768px+ (2 columns)
- Desktop: 1280px+ (3 columns, full layout)
- Wide: 1536px+ (max-width container)

---

## CMS Strategy (Keystatic)

Keystatic manages:
- Course entries (title, slug, level, sector, duration, description, modules)
- Module entries (title, video URL, description, resources)
- Testimonials
- Site settings (hero text, CTAs)

All content stored as MDX files in `/content/` — no database, git-native.

---

## Interview Talking Points
1. **Design decisions:** "Premium dark-mode builds trust with enterprise HR buyers, while the energetic purple gradient speaks to ambitious learners"
2. **CMS choice:** "Keystatic is git-native — zero database cost, non-technical editors can update courses via UI, changes are version-controlled"
3. **Customer journey mapping:** "Dual audience (employers + learners) handled via tabbed sections rather than separate sites"
4. **Performance:** "Next.js App Router + static generation for course pages = sub-1s load times"
5. **Scalability:** "Add a new course in 5 minutes via Keystatic UI — no code needed"
