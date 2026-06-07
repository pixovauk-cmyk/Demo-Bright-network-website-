import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: { kind: "local" },
  collections: {
    courses: collection({
      label: "Courses",
      slugField: "title",
      path: "content/courses/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        level: fields.select({
          label: "Level",
          options: [
            { label: "Level 2 — Foundation", value: "2" },
            { label: "Level 3 — Advanced", value: "3" },
            { label: "Level 4 — Higher", value: "4" },
            { label: "Level 5 — Higher", value: "5" },
          ],
          defaultValue: "3",
        }),
        sector: fields.select({
          label: "Sector",
          options: [
            { label: "Business & Admin", value: "business" },
            { label: "Digital & Tech", value: "tech" },
            { label: "Finance & FS", value: "finance" },
            { label: "Customer Service", value: "service" },
            { label: "Manufacturing", value: "manufacturing" },
            { label: "Logistics", value: "logistics" },
            { label: "Leadership & Coaching", value: "leadership" },
          ],
          defaultValue: "business",
        }),
        duration: fields.text({ label: "Duration (e.g. 18 months)" }),
        tagline: fields.text({ label: "Tagline (short)" }),
        description: fields.text({ label: "Description", multiline: true }),
        heroImage: fields.text({ label: "Hero Image URL (Unsplash)" }),
        whatYouLearn: fields.array(fields.text({ label: "Learning Outcome" }), {
          label: "What You Will Learn",
          itemLabel: (props) => props.value || "Outcome",
        }),
        employerBenefits: fields.array(
          fields.text({ label: "Benefit" }),
          {
            label: "Employer Benefits",
            itemLabel: (props) => props.value || "Benefit",
          }
        ),
        modules: fields.array(
          fields.object({
            title: fields.text({ label: "Module Title" }),
            slug: fields.text({ label: "Module Slug" }),
            duration: fields.text({ label: "Duration (e.g. 45 min)" }),
            videoUrl: fields.url({ label: "Video URL (YouTube embed)" }),
            description: fields.text({ label: "Module Description", multiline: true }),
            resources: fields.array(fields.text({ label: "Resource" }), {
              label: "Resources",
              itemLabel: (props) => props.value || "Resource",
            }),
          }),
          {
            label: "Modules",
            itemLabel: (props) => props.fields.title.value || "Module",
          }
        ),
        featured: fields.checkbox({ label: "Featured on homepage", defaultValue: false }),
      },
    }),
    testimonials: collection({
      label: "Testimonials",
      slugField: "name",
      path: "content/testimonials/*",
      format: { data: "yaml" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        role: fields.text({ label: "Role" }),
        company: fields.text({ label: "Company" }),
        quote: fields.text({ label: "Quote", multiline: true }),
        result: fields.text({ label: "Key Result (e.g. 30% attrition drop)" }),
      },
    }),
  },
});
