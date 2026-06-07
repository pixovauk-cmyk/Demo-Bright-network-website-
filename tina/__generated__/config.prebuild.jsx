// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public"
    }
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
          router: ({ document }) => `/courses/${document._sys.filename}`
        },
        fields: [
          {
            name: "title",
            type: "string",
            label: "Course Title",
            isTitle: true,
            required: true
          },
          {
            name: "level",
            type: "string",
            label: "Apprenticeship Level",
            ui: { description: 'e.g. "3" or "4"' }
          },
          {
            name: "sector",
            type: "string",
            label: "Sector",
            options: [
              { label: "Business & Admin", value: "business" },
              { label: "Digital & Tech", value: "tech" },
              { label: "Finance", value: "finance" },
              { label: "Customer Service", value: "service" }
            ]
          },
          {
            name: "duration",
            type: "string",
            label: "Duration",
            ui: { description: 'e.g. "18 months"' }
          },
          {
            name: "tagline",
            type: "string",
            label: "Tagline (short headline on course card)"
          },
          {
            name: "description",
            type: "string",
            label: "Full Description",
            ui: { component: "textarea" }
          },
          {
            name: "heroImage",
            type: "string",
            label: "Hero Image URL",
            ui: { description: "Paste a full image URL (Unsplash, etc.)" }
          },
          {
            name: "featured",
            type: "boolean",
            label: "Show on homepage (Featured)"
          },
          {
            name: "whatYouLearn",
            type: "string",
            label: "What You'll Learn",
            list: true,
            ui: { description: "Add one bullet point per item" }
          },
          {
            name: "employerBenefits",
            type: "string",
            label: "Employer Benefits",
            list: true
          },
          {
            name: "modules",
            type: "object",
            label: "Course Modules",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.title || "New Module" })
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
                ui: { component: "textarea" }
              },
              {
                name: "resources",
                type: "string",
                label: "Resources / Downloads",
                list: true
              }
            ]
          }
        ]
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
          router: () => "/"
        },
        fields: [
          {
            name: "announcementText",
            type: "string",
            label: "Announcement Bar Text",
            ui: { description: "Top banner shown above the hero" }
          },
          {
            name: "heroHeadline",
            type: "string",
            label: "Hero Headline"
          },
          {
            name: "heroSubtext",
            type: "string",
            label: "Hero Sub-text",
            ui: { component: "textarea" }
          },
          {
            name: "heroTrustLine1",
            type: "string",
            label: "Trust Chip 1"
          },
          {
            name: "heroTrustLine2",
            type: "string",
            label: "Trust Chip 2"
          },
          {
            name: "heroTrustLine3",
            type: "string",
            label: "Trust Chip 3"
          },
          {
            name: "ctaHeadline",
            type: "string",
            label: "CTA Headline"
          },
          {
            name: "ctaSubtext",
            type: "string",
            label: "CTA Sub-text",
            ui: { component: "textarea" }
          },
          {
            name: "ctaPhone",
            type: "string",
            label: "Phone Number"
          },
          {
            name: "ctaEmail",
            type: "string",
            label: "Email"
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
