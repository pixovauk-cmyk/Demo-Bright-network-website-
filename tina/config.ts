import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ── Courses ──────────────────────────────────────────────
      {
        name: "course",
        label: "Courses",
        path: "content/courses",
        format: "yaml",
        ui: {
          router: ({ document }) => `/courses/${document._sys.filename}`,
        },
        fields: [
          {
            name: "title",
            type: "string",
            label: "Course Title",
            isTitle: true,
            required: true,
          },
          {
            name: "level",
            type: "string",
            label: "Apprenticeship Level",
            ui: { description: 'e.g. "3" or "4"' },
          },
          {
            name: "sector",
            type: "string",
            label: "Sector",
            options: [
              { label: "Business & Admin", value: "business" },
              { label: "Digital & Tech", value: "tech" },
              { label: "Finance", value: "finance" },
              { label: "Customer Service", value: "service" },
            ],
          },
          {
            name: "duration",
            type: "string",
            label: "Duration",
            ui: { description: 'e.g. "18 months"' },
          },
          {
            name: "tagline",
            type: "string",
            label: "Tagline (short headline on course card)",
          },
          {
            name: "description",
            type: "string",
            label: "Full Description",
            ui: { component: "textarea" },
          },
          {
            name: "heroImage",
            type: "string",
            label: "Hero Image URL",
            ui: { description: "Paste a full image URL (Unsplash, etc.)" },
          },
          {
            name: "featured",
            type: "boolean",
            label: "Show on homepage (Featured)",
          },
          {
            name: "whatYouLearn",
            type: "string",
            label: "What You'll Learn",
            list: true,
            ui: { description: "Add one bullet point per item" },
          },
          {
            name: "employerBenefits",
            type: "string",
            label: "Employer Benefits",
            list: true,
          },
          {
            name: "modules",
            type: "object",
            label: "Course Modules",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.title || "New Module" }),
            },
            fields: [
              { name: "title", type: "string", label: "Module Title", required: true },
              { name: "slug", type: "string", label: "Slug (URL-friendly ID)" },
              { name: "duration", type: "string", label: "Duration (e.g. 70 min)" },
              { name: "videoUrl", type: "string", label: "Video Embed URL" },
              {
                name: "description",
                type: "string",
                label: "Module Description",
                ui: { component: "textarea" },
              },
              {
                name: "resources",
                type: "string",
                label: "Resources / Downloads",
                list: true,
              },
            ],
          },
        ],
      },

      // ── Homepage ──────────────────────────────────────────────
      {
        name: "home",
        label: "Homepage",
        path: "content",
        format: "yaml",
        match: { include: "home" },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => "/",
        },
        fields: [
          // ── Announcement ──
          {
            name: "announcementText",
            type: "string",
            label: "Announcement Bar Text",
            ui: { description: "Top banner shown above the hero" },
          },

          // ── Hero ──
          {
            name: "heroHeadline",
            type: "string",
            label: "Hero Headline (first line)",
            ui: { description: 'e.g. "Start your career." — second line is always "The government picks up the bill."' },
          },
          {
            name: "heroSubtext",
            type: "string",
            label: "Hero Sub-text",
            ui: { component: "textarea" },
          },
          {
            name: "heroTrustLine1",
            type: "string",
            label: "Trust Chip 1",
          },
          {
            name: "heroTrustLine2",
            type: "string",
            label: "Trust Chip 2",
          },
          {
            name: "heroTrustLine3",
            type: "string",
            label: "Trust Chip 3",
          },
          {
            name: "heroImage1",
            type: "string",
            label: "Hero Image (right column)",
            ui: { description: "Full-height image filling the right hero column" },
          },
          {
            name: "heroImage2",
            type: "string",
            label: "Hero Image 2 (unused — reserved)",
          },

          // ── Stats bar ──
          {
            name: "stats",
            type: "object",
            label: "Stats Bar (4 numbers below hero)",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.label || "Stat" }),
            },
            fields: [
              { name: "value", type: "number", label: "Number" },
              { name: "suffix", type: "string", label: "Suffix (e.g. + or %)" },
              { name: "label", type: "string", label: "Label below number" },
            ],
          },

          // ── Employers marquee ──
          {
            name: "employers",
            type: "string",
            label: "Employer Names (scrolling marquee)",
            list: true,
            ui: { description: "One employer name per line" },
          },

          // ── Why BrightPeak ──
          {
            name: "whyHeadline",
            type: "string",
            label: "Why Section Headline",
          },
          {
            name: "whySubtext",
            type: "string",
            label: "Why Section Sub-text (funding card body)",
            ui: { component: "textarea" },
          },
          {
            name: "whyImage1",
            type: "string",
            label: "Why Section — Tutor Image",
            ui: { description: "Image used in the 'One tutor. Your tutor.' bento card" },
          },
          {
            name: "whyImage2",
            type: "string",
            label: "Why Section — Image 2 (reserved)",
          },
          {
            name: "features",
            type: "object",
            label: "Why Feature Cards (bento grid — 4 items)",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.title || "Feature" }),
            },
            fields: [
              { name: "title", type: "string", label: "Card Headline" },
              {
                name: "desc",
                type: "string",
                label: "Card Body",
                ui: { component: "textarea" },
              },
            ],
          },

          // ── How It Works ──
          {
            name: "howHeadline",
            type: "string",
            label: "How It Works Headline",
          },
          {
            name: "howImage",
            type: "string",
            label: "How It Works — Right Column Image",
          },
          {
            name: "steps",
            type: "object",
            label: "Process Steps (4 steps)",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.title || "Step" }),
            },
            fields: [
              { name: "title", type: "string", label: "Step Headline" },
              {
                name: "desc",
                type: "string",
                label: "Step Description",
                ui: { component: "textarea" },
              },
            ],
          },

          // ── Insights (hidden section — data kept for future use) ──
          {
            name: "insightsHeadline",
            type: "string",
            label: "Insights Section Headline",
          },
          {
            name: "insights",
            type: "object",
            label: "Insight Articles",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.title || "Article" }),
            },
            fields: [
              { name: "tag", type: "string", label: "Tag / Category" },
              { name: "title", type: "string", label: "Article Title" },
              { name: "date", type: "string", label: "Date (display)" },
              { name: "read", type: "string", label: "Read time (e.g. 5 min read)" },
              { name: "img", type: "string", label: "Image URL" },
              { name: "href", type: "string", label: "Link URL" },
            ],
          },

          // ── Dual Audience ──
          {
            name: "dualHeadline",
            type: "string",
            label: "Dual Audience Headline",
          },
          {
            name: "dualSubtext",
            type: "string",
            label: "Dual Audience Sub-text",
          },
          // Employer card
          {
            name: "employerCardHeadline",
            type: "string",
            label: "Employer Card — Headline",
          },
          {
            name: "employerCardSubtext",
            type: "string",
            label: "Employer Card — Body",
            ui: { component: "textarea" },
          },
          {
            name: "employerCardImage",
            type: "string",
            label: "Employer Card — Image",
          },
          {
            name: "employerBullets",
            type: "string",
            label: "Employer Card — Bullet Points",
            list: true,
          },
          // Learner card
          {
            name: "learnerCardHeadline",
            type: "string",
            label: "Learner Card — Headline",
          },
          {
            name: "learnerCardSubtext",
            type: "string",
            label: "Learner Card — Body",
            ui: { component: "textarea" },
          },
          {
            name: "learnerCardImage",
            type: "string",
            label: "Learner Card — Image",
          },
          {
            name: "learnerBullets",
            type: "string",
            label: "Learner Card — Bullet Points",
            list: true,
          },

          // ── CTA Section ──
          {
            name: "ctaHeadline",
            type: "string",
            label: "CTA Headline",
          },
          {
            name: "ctaSubtext",
            type: "string",
            label: "CTA Sub-text",
            ui: { component: "textarea" },
          },
          {
            name: "ctaPhone",
            type: "string",
            label: "Phone Number",
          },
          {
            name: "ctaEmail",
            type: "string",
            label: "Email Address",
          },
        ],
      },
    ],
  },
});
