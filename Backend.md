# BrightPeak — Backend & Portal Architecture Plan

## Overview

Three-layer system:
1. **Marketing site** — public, what we have now (Next.js)
2. **Learner Hub portal** — authenticated, post-enrolment
3. **Staff Admin** — internal tool for team to manage everything

---

## Tech Stack

| Layer | Tool | Cost |
|-------|------|------|
| Hosting | Vercel | Free → £20/mo |
| Database | Supabase (PostgreSQL / SQL) | Free → £25/mo |
| Authentication / Login | Clerk | Free up to 10,000 users |
| Email (transactional) | Resend | Free up to 3,000/mo |
| CRM (leads pipeline) | HubSpot | Free up to 1,000 contacts |
| Video hosting | Vimeo Business | £17/mo |
| File storage (PDFs, docs) | Supabase Storage | Included |
| Form → CRM automation | Zapier / Make | Free tier |
| **Total at Phase 2** | | **~£60/month** |

---

## Database Schema (SQL via Supabase)

```sql
-- Users (learners, employers, staff, tutors)
users
  id, email, name, role (learner|employer|staff|tutor|admin),
  clerk_id, created_at, last_login

-- Employers
employers
  id, company_name, contact_name, email, phone,
  levy_payer (bool), created_at

-- Learner profiles
learner_profiles
  id, user_id (→ users), employer_id (→ employers),
  programme_start_date, expected_end_date,
  tutor_id (→ users), status (active|paused|completed|withdrawn)

-- Enrolments (which learner is on which course)
enrolments
  id, learner_id (→ learner_profiles), course_slug,
  approved_at, approved_by (→ users), status

-- Module progress
module_progress
  id, learner_id, course_slug, module_slug,
  started_at, completed_at, time_spent_mins, video_watched_pct

-- Off-the-job hours (legal requirement — 20% rule)
otj_hours
  id, learner_id, date, hours, category
  (training|shadowing|coursework|assessment|project),
  description, evidence_url, approved (bool)

-- Progress reviews (Ofsted requirement — every 12 weeks)
progress_reviews
  id, learner_id, tutor_id, review_date,
  notes, targets, learner_signed (bool), employer_signed (bool)

-- Leads / enquiries
leads
  id, name, email, phone, company, message,
  source (hero_form|cta|contact), hubspot_id,
  status (new|contacted|qualified|enrolled|lost), created_at

-- Audit log
audit_log
  id, user_id, action, resource, resource_id, ip, created_at
```

---

## Enquiry → Enrolment Flow

```
1. Visitor submits form on website
        ↓
2. Lead saved to Supabase `leads` table
   + synced to HubSpot CRM automatically (Zapier/webhook)
   + Slack notification to sales team
   + Auto-reply email to enquirer (Resend)
        ↓
3. Sales team qualifies lead in HubSpot
   Books discovery call → agrees programme
        ↓
4. Staff approves in admin dashboard:
   - Selects course
   - Sets start date
   - Links to employer
        ↓
5. System auto-creates:
   - User account (Clerk)
   - Learner profile (Supabase)
   - Enrolment record
   - Sends welcome email with "Set your password" link
        ↓
6. Learner clicks link → sets password → logs into Learner Hub
```

**Nothing manual after step 4.** One button click by staff triggers everything.

---

## Learner Hub Portal (`/portal`)

### Routes
```
/portal                     → redirect to dashboard
/portal/dashboard           → overview: progress, hours, next steps
/portal/courses             → enrolled courses list
/portal/courses/[slug]      → course detail + modules
/portal/courses/[slug]/[module] → watch video, read resources, mark complete
/portal/hours               → off-the-job hour logger
/portal/reviews             → progress review history
/portal/messages            → tutor messages
/portal/profile             → personal details
```

### What learner sees on dashboard
- Progress bar per course (% modules complete)
- Off-the-job hours: logged vs. target (e.g. 120/450 hrs)
- Next module to complete
- Upcoming progress review date
- Recent tutor message
- At-risk alert if falling behind

---

## Employer Portal (`/portal/employer`)

### Routes
```
/portal/employer/dashboard         → overview stats
/portal/employer/apprentices       → list of all their learners
/portal/employer/apprentices/[id]  → individual learner detail
/portal/employer/reports           → download progress reports
```

### What employer sees
- All apprentices: name, programme, progress %, last login
- Red flags: not logged in 14+ days, hours behind target
- Downloadable progress reports (PDF)
- Commitment statement + training plan docs

---

## Staff Admin (`/admin`)

### Routes
```
/admin                          → dashboard overview
/admin/leads                    → all enquiries + CRM status
/admin/learners                 → all learners across all programmes
/admin/learners/[id]            → full learner profile
/admin/learners/[id]/approve    → approve + create account
/admin/employers                → employer accounts
/admin/courses                  → manage courses (add/edit/delete)
/admin/courses/[slug]/modules   → manage modules, videos, resources
/admin/tutors                   → tutor assignments
/admin/reports                  → programme-wide reporting
/admin/audit                    → audit log
```

### How staff add a new course
1. Go to `/admin/courses` → click "Add Course"
2. Fill in: title, level, sector, duration, description, hero image
3. Add modules: title, video URL (Vimeo), resources (upload PDFs)
4. Set as featured (appears on homepage) or hidden
5. Publish → course live on public site + available to enrol learners

**Alternative (public site only):** Keystatic at `/keystatic` — no code needed, staff-friendly form UI. Already built.

---

## Authentication (Clerk)

### Setup
```
npm install @clerk/nextjs
```

Add to `middleware.ts`:
```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/portal(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

### Roles (Clerk metadata)
```typescript
// Set on account creation
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: { role: "learner" } // learner | employer | staff | tutor | admin
});
```

### Role-based route protection
```typescript
// middleware checks role → redirects if wrong role tries to access /admin
if (role === "learner" && req.url.includes("/admin")) redirect("/portal");
```

---

## Email System (Resend)

### Templates needed
1. **Welcome / account created** — login link + set password
2. **Enrolment confirmed** — course details, start date, tutor name
3. **Progress review reminder** — 1 week before scheduled review
4. **At-risk alert (to tutor)** — learner hasn't logged in 14 days
5. **Monthly progress summary (to employer)** — all apprentices snapshot
6. **Enquiry confirmation** — auto-reply on form submit

```typescript
// Example: send welcome email
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "BrightPeak <no-reply@brightpeakgroup.com>",
  to: learnerEmail,
  subject: "Welcome to BrightPeak — Set your password",
  html: WelcomeEmailTemplate({ name, loginUrl, courseName }),
});
```

---

## Learning Tracking

Every learner action logged to `module_progress` table:

```typescript
// Called when learner opens a module
await supabase.from("module_progress").upsert({
  learner_id, course_slug, module_slug,
  started_at: new Date(),
});

// Called when video player emits progress event (Vimeo API)
await supabase.from("module_progress").update({
  video_watched_pct: 73,
  time_spent_mins: 18,
}).eq("learner_id", learnerId).eq("module_slug", moduleSlug);

// Called when learner clicks "Mark as Complete"
await supabase.from("module_progress").update({
  completed_at: new Date(),
}).eq("learner_id", learnerId).eq("module_slug", moduleSlug);
```

### Metrics tracked per learner
- Modules completed vs. total
- Time spent per module
- Video watched % per module
- Last login date
- Off-the-job hours logged vs. target
- Days since last tutor contact
- Assessment submissions

### At-risk auto-detection (cron job)
```typescript
// Runs daily — flags learners matching any condition
const atRiskConditions = [
  { check: "last_login > 14 days", severity: "amber" },
  { check: "otj_hours < 50% of target at programme midpoint", severity: "red" },
  { check: "module_completion < 30% after 3 months", severity: "red" },
  { check: "no progress review in 84 days", severity: "amber" },
];
```

---

## Off-the-Job Hours (OTJ) — Ofsted Requirement

Learners must log **20% of contracted hours** as off-the-job training.

Example: 30hrs/week contract = 6hrs/week OTJ minimum.

### Learner logs hours
```
Date: 12 Jun 2026
Hours: 2.5
Category: Training (video modules)
Description: Completed Module 3 — Regulatory Compliance
Evidence: screenshot.png (optional upload)
```

### Tutor approves
Tutor reviews logged hours → marks approved/needs more detail.

### Running total shown on dashboard
```
Off-the-Job Hours
████████░░░░░░░░░░░░  120 / 450 hrs (27%)
On track ✓  (Target: 25% at this point)
```

---

## Security & GDPR

### Security
- All `/portal` and `/admin` routes behind Clerk auth middleware
- HTTPS enforced (Vercel default)
- No PII in URLs — use IDs not names
- Row-level security in Supabase (learners can only query their own rows)
- Audit log: every data access recorded
- API routes validate user role before returning data
- Environment variables for all secrets (never in code)

### GDPR (UK — ICO)
- [ ] Cookie consent banner (add to site — currently missing)
- [ ] Privacy policy updated to cover portal data
- [ ] ICO registration — £40/year, mandatory
- [ ] Data retention policy — how long after programme ends
- [ ] Right to erasure — endpoint to delete learner data on request
- [ ] Data Processing Agreements signed with: Clerk, Supabase, HubSpot, Resend, Vimeo
- [ ] Supabase EU region (keeps data within UK/EEA)
- [ ] No learner data in US-only servers

---

## CRM — HubSpot

### Free tier covers
- 1,000 contacts
- Deal pipeline (lead → contacted → qualified → enrolled)
- Email sequences for follow-up
- Meeting booking link

### Integration
```typescript
// On form submit → create HubSpot contact
await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` },
  body: JSON.stringify({
    properties: { email, firstname: name, company, phone, message },
  }),
});
```

---

## Video — Vimeo

- Staff upload videos to Vimeo Business account
- Set videos as unlisted / domain-restricted (only playable on brightpeakgroup.com)
- Copy embed URL → paste into course module form
- Vimeo player API sends events: play, pause, % watched → tracked in database

---

## Build Order (Phased)

### Phase 1 — Capture leads (1 week, free)
- [ ] Wire enquiry form → Supabase leads table
- [ ] HubSpot contact creation on form submit
- [ ] Slack notification on new lead
- [ ] Auto-reply email via Resend
- [ ] Cookie consent banner

### Phase 2 — Learner Hub MVP (6–8 weeks, ~£60/mo)
- [ ] Supabase schema setup (all tables above)
- [ ] Clerk authentication
- [ ] Learner portal: dashboard, course view, module player
- [ ] Off-the-job hour logger
- [ ] Module completion tracking
- [ ] Welcome email on account creation

### Phase 3 — Staff Admin (4–6 weeks)
- [ ] Staff admin dashboard
- [ ] Approve enrolment → create account flow
- [ ] Course/module management UI (alternative to Keystatic)
- [ ] Tutor assignment
- [ ] At-risk flagging + alerts

### Phase 4 — Employer Portal + Reporting (3–4 weeks)
- [ ] Employer dashboard
- [ ] Learner progress visible to employer
- [ ] PDF report generation
- [ ] Progress review scheduling + sign-off

### Phase 5 — MIS Integration (ongoing)
- [ ] API connection to existing MIS (Maytas/Aptem/PICS)
- [ ] Sync learner records both ways
- [ ] Automated Ofsted evidence exports

---

## Environment Variables Needed

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal

# Resend
RESEND_API_KEY=

# HubSpot
HUBSPOT_ACCESS_TOKEN=

# Vimeo (optional, for API access)
VIMEO_ACCESS_TOKEN=
```

---

## Accounts to Create (All Free to Start)

| Service | URL | Time |
|---------|-----|------|
| Supabase | supabase.com | 10 min |
| Clerk | clerk.com | 10 min |
| Resend | resend.com | 5 min |
| HubSpot | hubspot.com | 15 min |
| Vimeo Business | vimeo.com | 10 min |

**Start with Supabase + Clerk.** Everything else can follow.

---

## Can Claude Code Build This?

Yes — everything in this document. Provide the API keys from the accounts above and Claude Code builds the full portal, database, auth, email system, tracking, and admin tools inside this Next.js project.
