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
          {
            name: "announcementText",
            type: "string",
            label: "Announcement Bar Text",
            ui: { description: "Top banner shown above the hero" },
          },
          {
            name: "heroHeadline",
            type: "string",
            label: "Hero Headline (first line)",
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
            label: "Trust Chip 1 (e.g. Named account manager)",
          },
          {
            name: "heroTrustLine2",
            type: "string",
            label: "Trust Chip 2 (e.g. Ofsted Good)",
          },
          {
            name: "heroTrustLine3",
            type: "string",
            label: "Trust Chip 3 (e.g. 100% funded)",
          },
          {
            name: "ctaHeadline",
            type: "string",
            label: "CTA Section Headline",
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
            label: "Contact Phone Number",
          },
          {
            name: "ctaEmail",
            type: "string",
            label: "Contact Email",
          },

          // ── Hero images ──
          { name: "heroImage1", type: "string", label: "Hero — Main Image URL" },
          { name: "heroImage2", type: "string", label: "Hero — Small Image URL" },

          // ── Stats ──
          {
            name: "stats",
            type: "object",
            label: "Stats",
            list: true,
            ui: { itemProps: (item: { label?: string }) => ({ label: item?.label || "Stat" }) },
            fields: [
              { name: "value", type: "number", label: "Number" },
              { name: "suffix", type: "string", label: "Suffix (e.g. %, +)" },
              { name: "label", type: "string", label: "Label" },
            ],
          },

          // ── Employers marquee ──
          { name: "employers", type: "string", label: "Employer Names (marquee)", list: true },

          // ── Why BrightPeak ──
          { name: "whyHeadline", type: "string", label: "Why BrightPeak — Headline" },
          { name: "whySubtext", type: "string", label: "Why BrightPeak — Subtext", ui: { component: "textarea" } },
          { name: "whyImage1", type: "string", label: "Why BrightPeak — Main Image URL" },
          { name: "whyImage2", type: "string", label: "Why BrightPeak — Small Image URL" },
          {
            name: "features",
            type: "object",
            label: "Why BrightPeak — Features",
            list: true,
            ui: { itemProps: (item: { title?: string }) => ({ label: item?.title || "Feature" }) },
            fields: [
              { name: "title", type: "string", label: "Title" },
              { name: "desc", type: "string", label: "Description", ui: { component: "textarea" } },
            ],
          },

          // ── How It Works ──
          { name: "howHeadline", type: "string", label: "How It Works — Headline" },
          { name: "howImage", type: "string", label: "How It Works — Image URL" },
          {
            name: "steps",
            type: "object",
            label: "How It Works — Steps",
            list: true,
            ui: { itemProps: (item: { title?: string }) => ({ label: item?.title || "Step" }) },
            fields: [
              { name: "title", type: "string", label: "Step Title" },
              { name: "desc", type: "string", label: "Step Description", ui: { component: "textarea" } },
            ],
          },

          // ── Insights ──
          { name: "insightsHeadline", type: "string", label: "Insights — Headline" },
          {
            name: "insights",
            type: "object",
            label: "Insights — Blog Posts",
            list: true,
            ui: { itemProps: (item: { title?: string }) => ({ label: item?.title || "Post" }) },
            fields: [
              { name: "tag", type: "string", label: "Tag" },
              { name: "title", type: "string", label: "Title" },
              { name: "date", type: "string", label: "Date" },
              { name: "read", type: "string", label: "Read Time" },
              { name: "img", type: "string", label: "Image URL" },
              { name: "href", type: "string", label: "Link URL" },
            ],
          },

          // ── Dual Audience ──
          { name: "dualHeadline", type: "string", label: "Dual Audience — Headline" },
          { name: "dualSubtext", type: "string", label: "Dual Audience — Subtext" },
          { name: "employerCardHeadline", type: "string", label: "Employer Card — Headline" },
          { name: "employerCardSubtext", type: "string", label: "Employer Card — Subtext", ui: { component: "textarea" } },
          { name: "employerCardImage", type: "string", label: "Employer Card — Image URL" },
          { name: "employerBullets", type: "string", label: "Employer Card — Bullet Points", list: true },
          { name: "learnerCardHeadline", type: "string", label: "Learner Card — Headline" },
          { name: "learnerCardSubtext", type: "string", label: "Learner Card — Subtext", ui: { component: "textarea" } },
          { name: "learnerCardImage", type: "string", label: "Learner Card — Image URL" },
          { name: "learnerBullets", type: "string", label: "Learner Card — Bullet Points", list: true },
        ],
      },
    ],
  },
});
