# BrightPeak Apprenticeships — New Website Design Reference

## Brand Identity

**Brand name:** BrightPeak Apprenticeships (part of BrightPeak Group)
**Group brands:** Workpays (Midlands), WS Training (East of England), Orangebox (North East)
**Tagline:** "Infrastructure of a large provider. Care of a small one."
**Mission:** Empower People. Transforming Careers. Strengthening Communities.

## Colour System

Two-colour page system — strict white/pale alternation:
- White: `#FFFFFF`
- Pale indigo: `#F4F6FF`
- Brand dark: `#040B18` (text, borders)
- Accent: Indigo 600 `#4F46E5`

Section accent colours (matching Top Categories):
- Blue `#DBEAFE` — Business & Admin
- Violet `#EDE9FE` — Digital & Tech
- Emerald `#D1FAE5` — Finance & FS
- Pink `#FCE7F3` — Customer Service

## Typography

- Display font: Plus Jakarta Sans (Google Font, variable)
- CSS: `--font-display: var(--font-jakarta)`
- Body: system-ui / sans-serif
- Weights: 400, 500, 600, 700, 800, 900 (black)

## Component Patterns

**card-bold**: `bg-white; border: 2px solid rgba(4,11,24,0.09); border-radius: 1rem; hover: translateY(-4px)`
**btn-primary**: `bg-indigo-600 text-white rounded-full px-6 py-3 font-bold hover:bg-indigo-700`
**btn-outline-dark**: For dark backgrounds — white outlined
**btn-outline-light**: For light backgrounds — slate outlined

## Page Section Order (strict alternating bg)

1. Hero — `bg-white` (transparent over white)
2. Trust strip — `bg-white` (no border)
3. Employer logos — `bg-[#F4F6FF]`
4. Top Categories — `bg-[#F4F6FF]`
5. Why BrightPeak — `bg-white`
6. Stats / Results — `bg-[#F4F6FF]` (white cards with coloured top border)
7. Featured Courses — `bg-white`
8. Meet Our Team — `bg-[#F4F6FF]`
9. How It Works — `bg-white`
10. Testimonials — `bg-[#F4F6FF]`
11. Insights/Blog — `bg-white`
12. Dual Audience — `bg-white`
13. CTA — `bg-[#F4F6FF]` section, dark navy card inside

## Real Company Data

### Key Stats
- 30+ years experience (WS Training Est. 1995)
- 85% qualification success rate (above national average)
- 21 government-funded apprenticeship programmes
- 3 Ofsted Good rated brands (all independently rated)
- 11,000+ people supported annually
- 15 offices across England
- 80%+ placed into sustained employment
- 30% average attrition reduction for employer partners

### Contact Details
- Phone: 01246 918 340
- Email: contact@brightpeakgroup.com
- Address: 4 Babington Lane, Derby, DE1 1SU

### Leadership Team
| Name | Role |
|------|------|
| Alex Glasner | Chief Executive Officer |
| Anne Wright | Chief Executive Officer |
| Simon Corbett | Chief Revenue Officer (Founder, Orangebox) |
| Kylee Bates | Chief Operating Officer |
| Kirstie Wright | Group Director of Excellence |
| George Boylin | Chief Financial Officer |
| Neda Nazariyan | Group People & Culture Lead |

**Homepage team display (4 cards):** Alex Glasner, Kylee Bates, Simon Corbett, Kirstie Wright

### Real Employer Partners
- Co-Operative Bank
- Leeds Building Society
- Acorn Insurance
- Morrisons
- Marriott Hotels
- Nando's
- Costco
- Arriva Bus

### Real Testimonials
**Paul** (Apprenticeship Lead, The Co-operative Bank):
> "We are hugely impressed how they work with people from all different backgrounds."

**Heather** (Leeds Building Society):
> "BrightPeak feels like a real extension of our L&D team."
> Result: 92% completion rate

**Anthony** (Acorn Insurance):
> "Attrition rate dropped by around 30% within a year."
> Result: 30% attrition reduction in 12 months

## Apprenticeship Programmes (21 total)

### Business & Admin
- Business Administrator (Level 3, 18 months)
- Associate Project Manager (Level 4, 24 months)
- Business Analyst (Level 4, 24 months)
- HR Support (Level 3, 18 months)

### Digital & Tech
- Digital Support Technician (Level 3, 12 months)
- IT Solutions Technician (Level 3, 15 months)
- Cyber Security Technologist (Level 4, 24 months)
- Network Engineer (Level 4, 24 months)

### Finance & FS
- Financial Services Administrator (Level 3, 17 months)
- Mortgage Adviser (Level 3, 17 months)
- Regulatory Compliance Officer (Level 3, 18 months)
- Senior Financial Services Customer Adviser (Level 3, 18 months)
- Customer Service Practitioner — Financial Services (Level 2, 12 months)

### Customer Service
- Customer Service Practitioner (Level 2, 12 months)
- Customer Service Specialist (Level 3, 15 months)

### Operations & Improvement
- Improvement Technician (Level 3, 18 months)
- Lean Manufacturing Operative (Level 2, 12 months)
- Supply Chain Warehouse Operative (Level 2, 12 months)
- Coaching Professional (Level 5, 14 months)

## CMS Strategy

**Current setup:** Keystatic (already installed + configured)
- Access at: `/keystatic` route
- Local storage mode (YAML files in `content/`)
- Collections: `courses`, `testimonials`

**Recommended approach:** Keep Keystatic + add Git mode for multi-user editing

To switch from local to GitHub-backed:
```ts
storage: { kind: "github", repo: "your-org/brightpeak" }
```

**What Keystatic can manage now:**
- ✅ Add/edit/delete courses
- ✅ Add/edit testimonials
- ✅ Course modules (title, slug, duration, video, resources)
- ✅ Featured flag for homepage display

**Recommended additions to Keystatic schema:**
- Team members collection (name, role, bio, photo URL)
- Blog/insights posts collection
- Employer logos collection

## Navbar Design

- Scroll-responsive: starts compact (`py-1.5`, `h-9` logo), expands on scroll >55px
- Compact state: `bg-transparent border-transparent`
- Scrolled state: `bg-white/96 backdrop-blur-md shadow-sm`
- Logo: `brightness-0` (dark), no invert
- Links: `text-slate-600` → active `text-indigo-600 bg-indigo-50`
- Mobile: hamburger menu, `bg-white` drawer

## Photo Composition Patterns

### Hero (3-square staircase)
- Container: `width:300 height:420` (fixed)
- Sq1: 178×178px, `top:0 left:0`, `border:3px solid #040B18`, no rotation
- Sq2: 158×158px, `top:130 left:82`, `rotate(-2.5deg)`, white border
- Sq3: 136×136px, `top:262 left:160`, `rotate(3deg)`, white border

### Why BrightPeak (arch + square)
- Container: `width:340 height:420`
- Arch main: 260×360px, custom border-radius (arch shape)
- Square overlay: 148×148px, `bottom:0 right:0`, overlaps arch corner

## Mobile Optimisation Notes

- All carousels: `overflow-x-auto scrollbar-hide snap-x snap-mandatory`
- Cards on mobile: `w-[64-80vw]` → desktop: `lg:flex-1` or `lg:w-auto`
- Hero: right column `hidden lg:flex` (hidden on mobile — clean left-col only)
- Why BrightPeak photo: `order-2 lg:order-1` (text first on mobile)
- All sections: `px-4 sm:px-6 lg:px-8` gutters
- Typography: `text-4xl md:text-5xl` pattern throughout
